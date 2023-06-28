import { colorsDataString } from '../../interfaces/types';
import Colors from '../../util/Colors';
import Color from '../../util/Color';
import ColorPin from '../ColorPin/ColorPin';

import './SlotHintColumn.css';
import useGameStore from '../../store/gameStore';

interface slotHintColumnProps {
    baseColorsDataString: colorsDataString
    columnIndex: number,
    shouldReset: boolean
}

const SlotHintColumn = (props: slotHintColumnProps) => {
    const { baseColorsDataString, columnIndex, shouldReset } = props;

    const {
        colorsMinMax,
        disabledColorsDataString,
        paletteColorsDataString,
        possibleSlotColorsDataString,
        possibleSlotColorsDataStrings,
        setColorMinMax,
        setPossibleColors,
    } = useGameStore((state) => {
        const possibleSlotColorsDataStrings = state.hints.possibleSlotColorsDataStrings;
        const possibleSlotColorsDataString = state.hints.possibleSlotColorsDataStrings[columnIndex];
        const disabledColorsDataString = state.hints.disabledColorsDataString;
        const { paletteColorsDataString } = state.game;
        const { colorsMinMax } = state.hints;
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

    const opacityToogleCallback = (color: Color) => {
        // compute number of slots in which this color is possible
        let numColorPossible = 0;
        possibleSlotColorsDataStrings.forEach((_possibleSlotColorsDataString: colorsDataString) => {
            const _possibleSlotColors = Colors.deserialize(_possibleSlotColorsDataString);
            if (_possibleSlotColors.has(color)) numColorPossible++;
        })
        // get index of color in colorsPalette
        const paletteColors = Colors.deserialize(paletteColorsDataString);
        const colorIndex = paletteColors.indexOfColor(color);

        if (possibleSlotColors.has(color)) {
            // Color was possible, must now be removed from possible colors
            possibleSlotColors.remove(color);
            // Decrement max of this color, if max in sync
            setColorMinMax({colorIndex, max: numColorPossible - 1});
        } else {
            // Color was impossible, must now be added to possible colors
            possibleSlotColors.add(color);
            // Indecement max of this color
            setColorMinMax({colorIndex, max: numColorPossible + 1});
        }
        setPossibleColors(possibleSlotColors, columnIndex);
    }

    return (
        <div className='slot-hint-column'>
            {baseColors.map((color: Color) => {
                return (
                    <ColorPin
                        key={color.hue}
                        color={color}
                        isDisabled={disabledColors.has(color)}
                        isOpaque={!possibleSlotColors.has(color)}
                        isOpacityToogleActive={true}
                        opacityToogleCallback={opacityToogleCallback}
                        shouldReset={shouldReset}
                    />
                );
            })}
        </div>
    );
};

export default SlotHintColumn;