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

    return <div className="icon-buckets">
        {areIconAmountHintsActive && <h3 className="icon-occurences-title">
            Icon Occurences
        </h3>}
        {iconCollectionNames !== undefined && iconCollectionNames
            .map((iconName: string, iconIndex: number) => {
            return (
                <div key={iconName} className='icon-bucket'>
                    <Drag
                        key={`${iconName}-drag`}
                        isActive={disabledIcons !== undefined && !disabledIcons.includes(iconName)}
                        dragPayloadObject={{iconName}}>
                        <Icon
                            key={`${iconName}-icon`}
                            iconName={iconName}
                            isDisabledToggleActive={true}
                            isDisabled={disabledIcons !== undefined && disabledIcons.includes(iconName)}
                        />
                    </Drag>
                    {areIconAmountHintsActive ? <MinMaxControl
                        key={iconName + '-min-max-control'}
                        absoluteMin={0}
                        min={iconsMinMax[iconIndex][0]}
                        max={iconsMinMax[iconIndex][1]}
                        setMin={(min:number) => setIconMinMax({ iconIndex, min })}
                        setMax={(max:number) => setIconMinMax({ iconIndex, max })}
                        absoluteMax={maxIdenticalIconsInSolution}
                        /> : null
                    }
                </div>
            )
        })}
    </div>
}

export default IconBuckets;