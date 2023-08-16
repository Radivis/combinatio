import { MouseEventHandler } from 'react';
import useGameStore from '../../store/gameStore';
import Color from '../../util/Color';
import Colors from '../../util/Colors';
import ColorPin from '../ColorPin/ColorPin';
import './ColorSelector.css';
import { holeColor } from '../../constants';

interface colorSelectorProps {
    contextType: string;
    columnIndex: number;
    rowIndex: number;
    onClose: MouseEventHandler;
}

const ColorSelector = (props: colorSelectorProps) => {
    const { contextType, columnIndex, rowIndex, onClose } = props;

    const {
        paletteColorsDataString,
        placeColor,
        placeTupleColor,
     } = useGameStore((state) => {
        const { paletteColorsDataString } = state.game;
        const { placeColor, placeTupleColor } = state;
        return {
            paletteColorsDataString,
            placeColor,
            placeTupleColor,
        }
    })

    const paletteColors = Colors.deserialize(paletteColorsDataString);

    const onClick = (ev: any, colorIndex: number) => {
        if (contextType === 'game') {
            placeColor({
                color: paletteColors[colorIndex],
                row: rowIndex,
                column: columnIndex,
            })
        }
        if (contextType === 'combination-notes') {
            placeTupleColor({
                color: paletteColors[colorIndex],
                rowIndex,
                columnIndex,
            })
        }
        onClose(ev);
    }

    const onUnsetColor = (ev: any) => {
        if (contextType === 'game') {
            placeColor({
                color: holeColor,
                row: rowIndex,
                column: columnIndex,
            })
        }
        if (contextType === 'combination-notes') {
            placeTupleColor({
                color: holeColor,
                rowIndex,
                columnIndex,
            })
        }
        onClose(ev);
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
                    <div onClick = {(ev) => onClick(ev, colorIndex)}>
                        <ColorPin 
                            color = {color} 
                        />
                    </div>                
                )
            })}
            <div onClick = {(ev) => onUnsetColor(ev)}>
                <ColorPin 
                    color = {holeColor}
                />
            </div>
        </div>
    )
}

export default ColorSelector;