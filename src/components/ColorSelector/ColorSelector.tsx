import { MouseEventHandler } from 'react';
import useGameStore from '../../store/gameStore';
import Color from '../../util/Color';
import Colors from '../../util/Colors';
import ColorPin from '../ColorPin/ColorPin';
import './ColorSelector.css';

interface colorSelectorProps {
    columnIndex: number;
    rowIndex: number;
    onClose: MouseEventHandler;
}

const ColorSelector = (props: colorSelectorProps) => {
    const { columnIndex, rowIndex, onClose } = props;

    const {
        paletteColorsDataString,
        placeColor,
     } = useGameStore((state) => {
        const { paletteColorsDataString } = state.game;
        const { placeColor } = state;
        return {
            paletteColorsDataString,
            placeColor,
        }
    })

    const paletteColors = Colors.deserialize(paletteColorsDataString);

    const onClick = (colorIndex: number) => {
        placeColor({
            color: paletteColors[colorIndex],
            row: rowIndex,
            column: columnIndex,
        })
    }

    return (
        <div className="color-selector">
            <button
                type='button'
                className="color-selector-close-button"
                onClick={onClose}
            >x</button>
            {paletteColors.map((color: Color, colorIndex: number) => {
                return (
                    <div onClick = {() => onClick(colorIndex)}>
                        <ColorPin 
                            color = {color} 
                        />
                    </div>                
                )
            })}
        </div>
    )
}

export default ColorSelector;