import { gameStates, pieceTypes } from "../../constants";
import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Colors from "../../util/Colors";
import generateSolutionColors from "../functions/generateSolutionColors";
import generateDefaultRowColorsDataString from "../functions/generateDefaultRowColorsDataString";
import generateSolutionIcons from "../functions/generateSolutionIcons";
import { gameState } from "../../interfaces/types";
import ColorIcons from "../../util/ColorIcons";
import ColorIcon from "../../util/ColorIcon";
import Color from "../../util/Color";

enum aspectStatus {
    'amiss',
    'present',
    'correct'
};

const guess = (set: zustandSetter, get: zustandGetter) => () => {
    const state = get();
    const gamePalette = Colors.deserialize(state.game.paletteColorsDataString);
    let solutionColors = Colors.deserialize(state.game.solutionColorsDataString);
    let { solutionIconNames, iconCollectionNames } = state.game;
    const rowIndex = state.game.activeRowIndex;
    const { numColumns, pieceType } = state.gameSettings;
    let { solutionColorsDataString } = state.game;
    const currentRowColors = Colors.deserialize(state.game.gameRows[rowIndex].rowColorsDataString);
    const currentRowIconNames = state.game.gameRows[rowIndex].rowIconNames;

    // ### PART 0: Just-in-time generation of solution ###

    // Generate solution colors on the fly, if they haven't been set, yet
    if (solutionColorsDataString === generateDefaultRowColorsDataString(numColumns)) {
        solutionColors = generateSolutionColors(state);
        solutionColorsDataString = Colors.serialize(solutionColors);
    }

    // Generate solution icons on the fly, if they haven't been set, yet
    if ((pieceType === pieceTypes.icon || pieceType === pieceTypes.colorIcon) &&
        solutionIconNames?.every((solutionIcon: string) => solutionIcon === '')
    ) {
        solutionIconNames = generateSolutionIcons(state);
    }

    const solutionColorIcons = ColorIcons.fuse(solutionColors, solutionIconNames);

    // ### PART 1: Row evaluation ###

    // All aspects correct
    let _numFullyCorrect = 0;
    // Either color or icon correct (color or icon appear in solution)
    let _numCorrectAspect = 0;
    // Object for storing the many status counts
    let _infoPinStatusCounts: {[key: string]: number} = {};

    if (pieceType === pieceTypes.colorIcon && solutionIconNames !== undefined) {
        const currentRowColorIcons: ColorIcons = ColorIcons.fuse(solutionColors, solutionIconNames);

        // In this case there are a lot of different pin states:
        /* Everything correct
        _numFullyCorrect: All black

        icon at correct position, color does appear (n times)
        _numIconCorrectColorPresent: Center black, rim white

        color at correct position, icon does appear (n times)
        _numColorCorrectIconPresent: Rim black, center white

        icon at correct position, color does not appear (n times)
        _numIconCorrectColorAmiss: Center black, rim neutral

        color at correct position, icon does not appear (n times)
        _numColorCorrectIconAmiss: Rim black, center neutral

        ColorIcon appears (n times)
        _numColorIconPresent: All grey

        Color and icon appear, but not simultaneously (n times)
        _numColorPresentIconPresent: All white

        Color appears (n times), icon does not appear (n times)
        _numColorPresentIconAmiss: Rim white, center neutral

        Icon appears (n times), color does not appear (n times)
        _numIconPresentColorAmiss: Center white, rim neutral

        Neither icon nor color appear (n times)
        _numAllAmiss: All neutral

        Algorithmic strategy:
        For each colorIcon:
            Count solutionColorIcon occurences
        For each color:
            Count solutionColor occurrences
        For each icon:
            Count solutionIcon occurrences
        The counts at each step are stored in an object in which
        the key is serialization of the aspect and the value its count

        For each slot:
            Increment occurrence of colorIcon, color, and icon
            If the counter is higher than the number of solutionOccurrences, the respective
            aspect is amiss, otherwise it is present

            Check for equality of color and icon

            Compute colorStatus and iconStaus (correct | present | amiss) separately
            Increment the corresponding colorIconStatus counter
        */

        // Counts of the different status an evaluation pin can have
        let _numFullyCorrect = 0;
        let _numIconCorrectColorPresent = 0;
        let _numColorCorrectIconPresent = 0;
        let _numIconCorrectColorAmiss = 0;
        let _numColorCorrectIconAmiss = 0;
        let _numColorIconPresent = 0;
        let _numColorPresentIconPresent = 0;
        let _numColorPresentIconAmiss = 0;
        let _numIconPresentColorAmiss = 0;
        let _numAllAmiss = 0;

        // Objects storing the respective counts of the colorIcons, colors, and icons
        const solutionColorIconCounts: {[key: string]: number} = {};
        const solutionColorCounts: {[key: string]: number} = {};
        const solutionIconCounts: {[key: string]: number} = {};
        const rowColorIconCounts: {[key: string]: number} = {};
        const rowColorCounts: {[key: string]: number} = {};
        const rowIconCounts: {[key: string]: number} = {};

        // Create a set of all possible combinations of color and icon
        const colorIconSet: Set<ColorIcon> = new Set<ColorIcon>();
        gamePalette.forEach((color: Color) => {
            iconCollectionNames.forEach((iconName: string) => {
                const { hue, saturation, lightness } = color;
                const colorIcon = new ColorIcon(hue, saturation, lightness, iconName);
                colorIconSet.add(colorIcon);
            })
        })

        colorIconSet.forEach((colorIcon: ColorIcon) => {
            // For each colorIcon collect the number that it appears in the solutionColorIcons Array
            solutionColorIconCounts[colorIcon.serialize()] = solutionColorIcons.count(colorIcon);
            // Initialize the count of the colorIcon in this row with 0, increment it later!
            rowColorIconCounts[colorIcon.serialize()] = 0;
        });

        gamePalette.forEach((color: Color) => {
            // For each color collect the number that it appears in the solutionColors Array
            solutionColorCounts[color.serialize()] = solutionColors.count(color);
            // Initialize the count of the color in this row with 0, increment it later!
            rowColorCounts[color.serialize()] = 0;
        })

        iconCollectionNames.forEach((iconName: string) => {
            // For each icon collect the number that it appears in the solutionIcons Array
            solutionIconCounts[iconName] = solutionIconNames
                .reduce((sum, currIconName) => sum + currIconName === iconName ? 1 : 0, 0);
            // Initialize the count of the icon in this row with 0, increment it later!
            rowIconCounts[iconName] = 0;
        })

        for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
            // const colorIcon = currentRowColorIcons[columnIndex];
            const color = currentRowColors[columnIndex];
            const iconName = currentRowIconNames[columnIndex];
            const colorIcon = ColorIcon.fuse(color, iconName);
            let colorStatus = aspectStatus.amiss;
            let iconStatus = aspectStatus.amiss;
            let colorIconStatus = aspectStatus.amiss;

            // Check if colorIcon is present
            rowColorIconCounts[colorIcon.serialize()]++;
            if (rowColorIconCounts[colorIcon.serialize()] <= solutionColorIconCounts[colorIcon.serialize()]) {
                colorIconStatus = aspectStatus.present;
            }

            // Check if color is present
            rowColorCounts[color.serialize()]++;
            if (rowColorCounts[color.serialize()] <= solutionColorCounts[color.serialize()]) {
                colorStatus = aspectStatus.present;
            }

            // Check if color is correct
            if (color.equals(solutionColors[columnIndex])) {
                colorStatus = aspectStatus.correct;
            }

            // Check if icon is present
            rowIconCounts[iconName]++;
            if (rowIconCounts[iconName] <= solutionIconCounts[iconName]) {
                iconStatus = aspectStatus.present;
            }

            // Check if icon is correct
            if (iconName === solutionIconNames[columnIndex]) {
                iconStatus = aspectStatus.correct;
            }

            // Increment the corresponding evaluation pin counter
            if (colorStatus === aspectStatus.correct) {
                if (iconStatus === aspectStatus.correct) _numFullyCorrect++;
                if (iconStatus === aspectStatus.present) _numColorCorrectIconPresent++;
                if (iconStatus === aspectStatus.amiss) _numColorCorrectIconAmiss++;
            } else if (colorStatus === aspectStatus.present) {
                if (iconStatus === aspectStatus.correct) _numIconCorrectColorPresent++;
                if (iconStatus === aspectStatus.present) {
                    if (colorIconStatus === aspectStatus.present) {
                        _numColorIconPresent++;
                    } else {
                        _numColorPresentIconPresent++;
                    }
                }
                if (iconStatus === aspectStatus.amiss) _numColorPresentIconAmiss++;
            } else if (colorStatus === aspectStatus.amiss) {
                if (iconStatus === aspectStatus.correct) _numIconCorrectColorAmiss++;
                if (iconStatus === aspectStatus.present) _numIconPresentColorAmiss++;
                if (iconStatus === aspectStatus.amiss) _numAllAmiss++;
            }

            // Store the counters in the _infoPinStatusCounts object
            _infoPinStatusCounts['numFullyCorrect'] = _numFullyCorrect;
            _infoPinStatusCounts['numColorCorrectIconPresent'] = _numColorCorrectIconPresent;
            _infoPinStatusCounts['numColorCorrectIconAmiss'] = _numColorCorrectIconAmiss;
            _infoPinStatusCounts['numIconCorrectColorPresent'] = _numIconCorrectColorPresent;
            _infoPinStatusCounts['numColorIconPresent'] = _numColorIconPresent;
            _infoPinStatusCounts['numColorPresentIconPresent'] = _numColorPresentIconPresent;
            _infoPinStatusCounts['numColorPresentIconAmiss'] = _numColorPresentIconAmiss;
            _infoPinStatusCounts['numIconCorrectColorAmiss'] = _numIconCorrectColorAmiss;
            _infoPinStatusCounts['numIconPresentColorAmiss'] = _numIconPresentColorAmiss;
            _infoPinStatusCounts['numAllAmiss'] = _numAllAmiss;
        }

    } else if (pieceType === pieceTypes.color) {
        // Compute number of fully correct pins
        currentRowColors.forEach((color, index) => {
            if (color.hasSameHue(solutionColors[index])) _numFullyCorrect++;
        })
        
        // Compute number of correct colors
        // For each hue collect the number that it appears in the currentRowColors Array
        const rowHueCounts = Object.fromEntries(gamePalette.map(color => [color.hue,0]));
        currentRowColors.forEach(color => {
            rowHueCounts[color.hue]++;
        })
    
        // For each hue collect the number that it appears in the solutionColors Array
        const solutionHueCounts = Object.fromEntries(gamePalette.map(color => [color.hue,0]));
        solutionColors.forEach(solutionColor => {
            solutionHueCounts[solutionColor.hue]++;
        })
    
        // Always take the minimum of both numbers
        const correctHueCounts = Object.fromEntries(gamePalette.map(color => [color.hue,0]));
        gamePalette.forEach(baseColor => {
            correctHueCounts[baseColor.hue] = Math.min(rowHueCounts[baseColor.hue], solutionHueCounts[baseColor.hue]);
        })
    
        // Add upp the number of correctly guess colors
        _numCorrectAspect = Object.values(correctHueCounts).reduce((acc, next) => acc+next, 0);
    }

    // ### PART 2: Check Game State ###

    // Compute new game state and activeRowIndex
    let newGameState = state.game.gameState;
    let newActiveRowIndex = state.game.activeRowIndex + 1;

    // Start game once submitting the first row
    if (state.game.activeRowIndex === 1) newGameState = gameStates[1];

    // Check for victory condition
    if (_numFullyCorrect === state.gameSettings.numColumns) {
        newGameState = gameStates[2];
        newActiveRowIndex = -1;
        // Check for running out of rows -> loss
    } else if (state.game.activeRowIndex === state.gameSettings.numRows) {
        newGameState = gameStates[3];
        newActiveRowIndex = -1;
    }

    // ### PART 3: Update State ###
    
    set((state: gameState) => {
        // Update row state
        state.game.gameRows[rowIndex].infoPinStatusCounts = _infoPinStatusCounts;
        state.game.gameRows[rowIndex].numFullyCorrect = _numFullyCorrect;
        state.game.gameRows[rowIndex].numCorrectColor = _numCorrectAspect;

        // Update game state
        state.game.gameState = newGameState;
        state.game.activeRowIndex = newActiveRowIndex;
        state.game.solutionColorsDataString = solutionColorsDataString;
    }, false, 'guess')
}

export default guess;