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
import { range } from "../../util/range";

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
    if ((pieceType === pieceTypes.colorIcon || pieceType === pieceTypes.color) &&
        solutionColorsDataString === generateDefaultRowColorsDataString(numColumns)
    ) {
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

        ColorIcon appears (n times), color correct
        _numColorIconPresentColorCorrect: Black rim, center grey

        ColorIcon appears (n times), icon correct
        _numColorIconPresentIconCorrect: Center black, grey

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
        the key is the serialization of the aspect and the value its count

        Make an array of columnIndices to check
        Phase 1: Check for completely correct slots
        For each slot:
            Check colorIcon for correctness, and if true,
            Increment occurrence of colorIcon, color, and icon
            remove the column index from the columnIndices to check

        Phase 2: Check the slots that remain
        For each slot:
            Increment occurrence of colorIcon, color, and icon
            If the counter is higher than the number of solutionOccurrences, the respective
            aspect is amiss, otherwise it is present

            Check for equality of color and icon

            Compute colorStatus and iconStaus (correct | present | amiss) separately
            Increment the corresponding colorIconStatus counter
        */

        // Counts of the different status an evaluation pin can have
        _infoPinStatusCounts['numFullyCorrect'] = 0;
        _infoPinStatusCounts['numColorCorrectIconPresent'] = 0;
        _infoPinStatusCounts['numColorCorrectIconAmiss'] = 0;
        _infoPinStatusCounts['numIconCorrectColorPresent'] = 0;
        _infoPinStatusCounts['numColorIconPresent'] = 0;
        _infoPinStatusCounts['numColorIconPresentColorCorrect'] = 0;
        _infoPinStatusCounts['numColorIconPresentIconCorrect'] = 0;
        _infoPinStatusCounts['numColorPresentIconPresent'] = 0;
        _infoPinStatusCounts['numColorPresentIconAmiss'] = 0;
        _infoPinStatusCounts['numIconCorrectColorAmiss'] = 0;
        _infoPinStatusCounts['numIconPresentColorAmiss'] = 0;
        _infoPinStatusCounts['numAllAmiss'] = 0;

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
                .reduce((sum, currIconName) => sum + (currIconName === iconName ? 1 : 0), 0);

            // Initialize the count of the icon in this row with 0, increment it later!
            rowIconCounts[iconName] = 0;
        })

        // Store the slots that remain to be checked in an array of indicies
        let columnIndicesToCheck = range(numColumns);
        // Store the colorIcon status of each slot in an array
        const columnIndexColorIconStatusArray = columnIndicesToCheck
        .map((_columnIndex: number) => aspectStatus.amiss)
        // Store the color status of each slot in an array
        const columnIndexColorStatusArray = columnIndicesToCheck
        .map((_columnIndex: number) => aspectStatus.amiss)
        // Store the icon status of each slot in an array
        const columnIndexIconStatusArray = columnIndicesToCheck
        .map((_columnIndex: number) => aspectStatus.amiss)

        // Check each slot for total correctness
        for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
            const color = currentRowColors[columnIndex];
            const iconName = currentRowIconNames[columnIndex];
            const colorIcon = ColorIcon.fuse(color, iconName);
            if (colorIcon.equals(solutionColorIcons[columnIndex])) {
                _infoPinStatusCounts['numFullyCorrect']++;
                _numFullyCorrect++;
                columnIndexColorIconStatusArray[columnIndex] = aspectStatus.correct;
                rowColorIconCounts[colorIcon.serialize()]++;
                rowColorCounts[color.serialize()]++;
                rowIconCounts[iconName]++;
                columnIndicesToCheck = columnIndicesToCheck
                    .filter(_columnIndex => columnIndex !== _columnIndex);
            }
        }

        // Check colorIcon for each slot for presence
        columnIndicesToCheck.forEach((columnIndex: number) => {
            const color = currentRowColors[columnIndex];
            const iconName = currentRowIconNames[columnIndex];
            const colorIcon = ColorIcon.fuse(color, iconName);
            rowColorIconCounts[colorIcon.serialize()]++;
            if(rowColorIconCounts[colorIcon.serialize()] <= solutionColorIconCounts[colorIcon.serialize()]) {
                columnIndexColorIconStatusArray[columnIndex] = aspectStatus.present;
            }
        });

        let columnIndicesToCheckForColor = [...columnIndicesToCheck];

        // Check color for each slot for correctness
        columnIndicesToCheck.forEach((columnIndex: number) => {
            const color = currentRowColors[columnIndex];
            if(color.equals(solutionColors[columnIndex])) {
                columnIndexColorStatusArray[columnIndex] = aspectStatus.correct;
                rowColorCounts[color.serialize()]++;
                columnIndicesToCheckForColor = columnIndicesToCheckForColor
                    .filter(_columnIndex => columnIndex !== _columnIndex);
            }
        });

        // Check color for each remaining slot for presence
        columnIndicesToCheckForColor.forEach((columnIndex: number) => {
            const color = currentRowColors[columnIndex];
            rowColorCounts[color.serialize()]++;
            if (rowColorCounts[color.serialize()] <= solutionColorCounts[color.serialize()]) {
                columnIndexColorStatusArray[columnIndex] = aspectStatus.present;
            }
        });

        let columnIndicesToCheckForIcon = [...columnIndicesToCheck];

        // Check icon for each slot for correctness
        columnIndicesToCheck.forEach((columnIndex: number) => {
            const iconName = currentRowIconNames[columnIndex];
            // Check if icon is correct
            if (iconName === solutionIconNames[columnIndex]) {
                columnIndexIconStatusArray[columnIndex] = aspectStatus.correct;
                rowIconCounts[iconName]++;
                columnIndicesToCheckForIcon = columnIndicesToCheckForIcon
                    .filter(_columnIndex => columnIndex !== _columnIndex);
            }
        });

        // Check icon for each remaining slot for presence
        columnIndicesToCheckForIcon.forEach((columnIndex: number) => {
            const iconName = currentRowIconNames[columnIndex];
            rowIconCounts[iconName]++;
            if (rowIconCounts[iconName] <= solutionIconCounts[iconName]) {
                columnIndexIconStatusArray[columnIndex] = aspectStatus.present;
            }
        });

        // Compute the total pin status for each pin
        for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
            const colorIconStatus = columnIndexColorIconStatusArray[columnIndex];
            const colorStatus = columnIndexColorStatusArray[columnIndex];
            const iconStatus = columnIndexIconStatusArray[columnIndex];

            // Increment the corresponding evaluation pin counter
            if (colorStatus === aspectStatus.correct) {
                // Don't increment the numFullyCorrect status, because it has already been incremented!
                // if (iconStatus === aspectStatus.correct) _infoPinStatusCounts['numFullyCorrect']++;
                if (iconStatus === aspectStatus.present) {
                    if (colorIconStatus === aspectStatus.present) {
                        _infoPinStatusCounts['numColorIconPresentColorCorrect']++;
                    } else {
                        _infoPinStatusCounts['numColorCorrectIconPresent']++;
                    }   
                }
                if (iconStatus === aspectStatus.amiss) _infoPinStatusCounts['numColorCorrectIconAmiss']++;
            } else if (colorStatus === aspectStatus.present) {
                if (iconStatus === aspectStatus.correct) {
                    if (colorIconStatus === aspectStatus.present) {
                        _infoPinStatusCounts['numColorIconPresentIconCorrect']++;
                    } else {
                        _infoPinStatusCounts['numIconCorrectColorPresent']++;
                    }   
                }
                if (iconStatus === aspectStatus.present) {
                    if (colorIconStatus === aspectStatus.present) {
                        _infoPinStatusCounts['numColorIconPresent']++;
                    } else {
                        _infoPinStatusCounts['numColorPresentIconPresent']++;
                    }
                }
                if (iconStatus === aspectStatus.amiss) _infoPinStatusCounts['numColorPresentIconAmiss']++;
            } else if (colorStatus === aspectStatus.amiss) {
                if (iconStatus === aspectStatus.correct) _infoPinStatusCounts['numIconCorrectColorAmiss']++;
                if (iconStatus === aspectStatus.present) _infoPinStatusCounts['numIconPresentColorAmiss']++;
                if (iconStatus === aspectStatus.amiss) _infoPinStatusCounts['numAllAmiss']++;
            }
        }

        // <DEBUG>
        // console.log(_infoPinStatusCounts);
        // console.log('rowColorIconCounts', rowColorIconCounts);
        // console.log('rowColorCounts', rowColorCounts);
        // console.log('rowIconCounts', rowIconCounts);
        // console.log('solutionColorIconCounts', solutionColorIconCounts);
        // console.log('solutionColorCounts', solutionColorCounts);
        // console.log('solutionIconCounts', solutionIconCounts);
        // console.log('columnIndexColorIconStatusArray', columnIndexColorIconStatusArray);
        // console.log('columnIndexColorStatusArray', columnIndexColorStatusArray);
        // console.log('columnIndexIconStatusArray', columnIndexIconStatusArray);
        // </DEBUG>
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
    } else if (pieceType === pieceTypes.icon) {
        // Compute number of fully correct pins
        currentRowIconNames.forEach((iconName, iconIndex) => {
            if (iconName === solutionIconNames[iconIndex]) _numFullyCorrect++;
        })
        
        // Compute number of correct icons
        // For each iconName collect the number that it appears in the currentRowIconNames Array
        const rowIconNameCounts = Object.fromEntries(iconCollectionNames
            .map(iconName => [iconName,0]));
            currentRowIconNames.forEach(iconName => {
            rowIconNameCounts[iconName]++;
        })
    
        // For each iconName collect the number that it appears in the solutionIconNames Array
        const solutionIconNameCounts = Object.fromEntries(iconCollectionNames
            .map(iconName => [iconName,0]));
        solutionIconNames.forEach(solutionIconName => {
            solutionIconNameCounts[solutionIconName]++;
        })
    
        // Always take the minimum of both numbers
        const correctIconNameCounts = Object.fromEntries(iconCollectionNames
            .map(iconName => [iconName,0]));
            iconCollectionNames.forEach(iconName => {
            correctIconNameCounts[iconName] = Math.min(
                rowIconNameCounts[iconName],
                solutionIconNameCounts[iconName]
            );
        })
    
        // Add upp the number of correctly guess icons
        _numCorrectAspect = Object.values(correctIconNameCounts).reduce((acc, next) => acc+next, 0);
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