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
    // Exactly 2 of the 3 aspects color, icon, and position correct
    let _numPartiallyCorrect = 0;
    // Either color or icon correct (color or icon appear in solution)
    let _numCorrectAspect = 0;

    if (pieceType === pieceTypes.colorIcon && solutionIconNames !== undefined) {
        const currentRowColorIcons: ColorIcons = ColorIcons.fuse(solutionColors, solutionIconNames);

        // Part 1.1: Compute number of fully correct pins
        currentRowColorIcons.forEach((colorIcon: ColorIcon, columnIndex: number) => {
            if (colorIcon.equals(solutionColorIcons[columnIndex])){
                _numFullyCorrect++;    
            }
        });

        // Part 1.2: Compute pins not fully correct with exactly 1 correct aspect plus correct colorIcons
        let _numPinsWithExactlyOneCorrectAspect = 0;
        currentRowColorIcons.forEach((colorIcon: ColorIcon, columnIndex: number) => {
            if (colorIcon.hasCommonAttribute(solutionColorIcons[columnIndex]) &&
                !colorIcon.equals(solutionColorIcons[columnIndex])
            ){
                _numPinsWithExactlyOneCorrectAspect++;    
            }
        });

        let _numCorrectColorIcons = 0;

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
            // For each colorIcon collect the number that it appears in the currentRowColorIcons Array
            const currentRowColorIconsCount = currentRowColorIcons.count(colorIcon);
            // For each colorIcon collect the number that it appears in the solutionColorIcons Array
            const solutionColorIconsCount = solutionColorIcons.count(colorIcon);
            // Always take the minimum of both numbers
            const correctColorIconsCount = Math.min(currentRowColorIconsCount, solutionColorIconsCount);
            _numCorrectColorIcons += correctColorIconsCount;
        });

        _numPartiallyCorrect = _numPinsWithExactlyOneCorrectAspect + _numCorrectColorIcons;

        // Part 1.3: Compute number of correct aspects
        // Problem: If there are 4 slots and there are 3 correct colors and 3 correct icons, but no
        // Correct colorIcon, how should that be displayed?

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
        state.game.gameRows[rowIndex].numFullyCorrect = _numFullyCorrect;
        state.game.gameRows[rowIndex].numCorrectColor = _numCorrectAspect;

        // Update game state
        state.game.gameState = newGameState;
        state.game.activeRowIndex = newActiveRowIndex;
        state.game.solutionColorsDataString = solutionColorsDataString;
    }, false, 'guess')
}

export default guess;