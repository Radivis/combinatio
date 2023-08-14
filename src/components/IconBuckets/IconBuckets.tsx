import useGameStore from "../../store/gameStore";
import Drag from "../Drag/Drag";
import Icon from "../Icon/Icon";
import MinMaxControl from "../MinMaxControl/MinMaxControl";

import './IconBuckets.css';

interface colorBucketsProps {
}

const IconBuckets = (props: colorBucketsProps) => {

    const {
        areIconAmountHintsActive,
        disabledIcons,
        iconCollectionNames,
        iconsMinMax,
        maxIdenticalIconsInSolution,
        numColumns,
        setIconMinMax,
    } = useGameStore((state) => {
        const { setIconMinMax } = state;
        const { maxIdenticalIconsInSolution, numColumns } = state.gameSettings;
        const { areIconAmountHintsActive } = state.displaySettings;
        const { iconCollectionNames } = state.game;
        // const { setColorMinMax } = state;
        const { disabledIcons, iconsMinMax } = state.hints;
        return {
            areIconAmountHintsActive,
            disabledIcons,
            iconCollectionNames,
            iconsMinMax,
            maxIdenticalIconsInSolution,
            numColumns,
            setIconMinMax,
        };
    })

    const minSum = iconsMinMax.reduce((acc: number, curr: [number, number]) => acc + curr[0], 0);
    const maxSum = iconsMinMax.reduce((acc: number, curr: [number, number]) => acc + curr[1], 0);

    let sumError = '';
    if (minSum > numColumns) sumError += 'Sum of minimum values exceeds number of slots!';
    if (maxSum < numColumns) sumError += 'Sum of maximum values below number of slots!';

    return <div className="icon-buckets">
        {areIconAmountHintsActive && <h3 className="icon-occurences-title">
            Icon Occurences
        </h3>}
        {sumError !== '' && (
            <p className="sum-error">{sumError}</p>
        )}
        {iconCollectionNames !== undefined && iconCollectionNames
            .map((iconName: string, iconIndex: number) => {
            return (
                <div key={iconName} className='icon-bucket'>
                    <Drag
                        key={`${iconName}-drag`}
                        isActive={true}
                        dragPayloadObject={{iconName}}>
                        <div className="icon-container">
                            <Icon
                                key={`${iconName}-icon`}
                                iconName={iconName}
                                isDisabledToggleActive={true}
                                isDisabled={disabledIcons !== undefined && disabledIcons.includes(iconName)}
                            />
                        </div>
                    </Drag>
                    {areIconAmountHintsActive ? <MinMaxControl
                        key={iconName + '-min-max-control'}
                        absoluteMin={0}
                        min={iconsMinMax[iconIndex][0]}
                        max={iconsMinMax[iconIndex][1]}
                        setMin={(min:number) => setIconMinMax({ iconIndex, min })}
                        setMax={(max:number) => setIconMinMax({ iconIndex, max })}
                        absoluteMax={maxIdenticalIconsInSolution}
                        emphasizeMin={minSum === numColumns}
                        emphasizeMax={maxSum === numColumns}
                        /> : null
                    }
                </div>
            )
        })}
    </div>
}

export default IconBuckets;