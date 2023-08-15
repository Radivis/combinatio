import { MouseEventHandler } from 'react';
import useGameStore from '../../store/gameStore';
import Color from '../../util/Color';
import Colors from '../../util/Colors';
import ColorPin from '../ColorPin/ColorPin';
import './ColorSelector.css';

interface colorSelectorProps {
    onClose: MouseEventHandler;
}

const ColorSelector = (props: colorSelectorProps) => {
    const { onClose } = props;

    const {
        paletteColorsDataString
     } = useGameStore((state) => {
        const { paletteColorsDataString } = state.game;
        return {
            paletteColorsDataString
        }
    })

    const paletteColors = Colors.deserialize(paletteColorsDataString);

    return (
        <div className="color-selector">
            <button
                type='button'
                className="color-selector-close-button"
                onClick={onClose}
            >x</button>
            {paletteColors.map((color: Color) => {
                return (                
                    <ColorPin 
                        color = {color}
                    />
                )
            })}
        </div>
    )
}

export default ColorSelector;