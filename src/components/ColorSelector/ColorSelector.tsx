import useGameStore from '../../store/gameStore';
import ColorBuckets from '../ColorBuckets/ColorBuckets';
import './ColorSelector.css';

const ColorSelector = () => {

    const {
        maxIdenticalColorsInSolution,
        numColumns,
        paletteColorsDataString
     } = useGameStore((state) => {
        const { maxIdenticalColorsInSolution, numColumns } = state.gameSettings;
        const { paletteColorsDataString } = state.game;
        return {
            maxIdenticalColorsInSolution,
            numColumns,
            paletteColorsDataString
        }
    })

    return (
        <div>
            <ColorBuckets
                numColumns={numColumns}
                maxIdenticalColorsInSolution={maxIdenticalColorsInSolution}
                baseColorsDataString={paletteColorsDataString}
                areColorAmountHintsActive={false}
            />
        </div>
    )
}

export default ColorSelector;