import { colorsDataString } from '../../interfaces/types';
import Colors from '../../util/Colors';
import Color from '../../util/Color';
import ColorPin from '../ColorPin/ColorPin';

import './SlotHintColorColumn.css';
import useGameStore from '../../store/gameStore';
import Drag from '../Drag/Drag';

interface slotHintColumnProps {
    baseColorsDataString: colorsDataString
    columnIndex: number,
}

const SlotHintColorColumn = (props: slotHintColumnProps) => {
    const { baseColorsDataString, columnIndex } = props;

    const {
        colorsMinMax,
        disabledColorsDataString,
        paletteColorsDataString,
        possibleSlotColorsDataString,
        possibleSlotColorsDataStrings,
        setColorMinMax,
        setPossibleColors,
    } = useGameStore((state) => {
        const { colorsMinMax, disabledColorsDataString, possibleSlotColorsDataStrings } = state.hints;
        const possibleSlotColorsDataString = state.hints.possibleSlotColorsDataStrings[columnIndex];
        const { paletteColorsDataString } = state.game;
        const { setPossibleColors, setColorMinMax } = state;
        return {
            colorsMinMax,
            disabledColorsDataString,
            paletteColorsDataString,
            possibleSlotColorsDataString,
            possibleSlotColorsDataStrings,
            setColorMinMax,
            setPossibleColors,
        };
    });

    let possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);
    const baseColors = Colors.deserialize(baseColorsDataString);
    const disabledColors = Colors.deserialize(disabledColorsDataString);

    // compute number of slots in which this color is theoretically possible,
    // disregarding the limitation given by maxIdenticalColorsInSolution
    const computeNumColorPossible = (color: Color): number => {
        let numColorPossible = 0;
        possibleSlotColorsDataStrings.forEach((_possibleSlotColorsDataString: colorsDataString) => {
            const _possibleSlotColors = Colors.deserialize(_possibleSlotColorsDataString);
            if (_possibleSlotColors.has(color)) numColorPossible++;
        })
        return numColorPossible;
    }

    const opacityToogleCallback = (color: Color | string) => {
        if (typeof color !== 'string')  {
            // compute number of slots in which this color is possible
            const numColorPossible = computeNumColorPossible(color);
    
            // get index of color in colorsPalette
            const paletteColors = Colors.deserialize(paletteColorsDataString);
            const colorIndex = paletteColors.indexOfColor(color);
    
            if (possibleSlotColors.has(color)) {
                // Color was possible, must now be removed from possible colors
                possibleSlotColors.remove(color);
                // Decrement max of this color, if max in sync
                if (colorsMinMax[colorIndex][1] === numColorPossible) {
                    setColorMinMax({colorIndex, max: numColorPossible - 1});
                }
            } else {
                // Color was impossible, must now be added to possible colors
                possibleSlotColors.add(color);
                // Don't increment max of this color, because max might have been reduced on purpose!
                // const newMax = Math.min(numColorPossible + 1, maxIdenticalColorsInSolution);
                // setColorMinMax({colorIndex, max: newMax});
            }
            setPossibleColors(possibleSlotColors, columnIndex);
        }
    }

    const isHighlighted = (color: Color): boolean => {
        return possibleSlotColors.length === 1 && possibleSlotColors.has(color);
    }

    const className = `slot-hint-column${possibleSlotColors.length === 0 ? ' no-selection-error' : ''}`.trim();

    return (
        <div className={className}>
            {baseColors.map((color: Color) => {
                return (
                    <Drag
                    key={color.hue - 720}
                    isActive={true}
                    dragPayloadObject={{
                        hue: color.hue,
                        saturation: color.saturation,
                        lightness: color.lightness,
                    }}>
                        <ColorPin
                            key={color.hue}
                            color={color}
                            isDisabled={disabledColors.has(color)}
                            isOpaque={!possibleSlotColors.has(color)}
                            isOpacityToogleActive={true}
                            isHighlighted={isHighlighted(color)}
                            opacityToogleCallback={opacityToogleCallback}
                        />
                    </Drag>
                );
            })}
        </div>
    );
};

export default SlotHintColorColumn;