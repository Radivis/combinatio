import useGameStore from "../../store/gameStore";
import Drag from "../Drag/Drag";
import Icon from "../Icon/Icon";
import MinMaxControl from "../MinMaxControl/MinMaxControl";

import './IconBuckets.css';

interface colorBucketsProps {
}

const IconBuckets = (props: colorBucketsProps) => {

    const {
        // areColorAmountHintsActive,
        disabledIcons,
        iconCollectionNames,
        maxIdenticalIconsInSolution,
        numColumns,
    } = useGameStore((state) => {
        const { maxIdenticalIconsInSolution, numColumns } = state.gameSettings;
        const { iconCollectionNames }= state.game;
        // const { setColorMinMax } = state;
        const { disabledIcons } = state.hints;
        return {
            // areColorAmountHintsActive,
            disabledIcons,
            iconCollectionNames,
            maxIdenticalIconsInSolution,
            numColumns,
        };
    })

    return <div className="icon-buckets">
        {/* {areColorAmountHintsActive && <h3 className="color-occurences-title">
            Color Occurences
        </h3>} */}
        {iconCollectionNames !== undefined && iconCollectionNames
            .map((iconName: string, iconIndex: number) => {
            return (
                <div key={iconName} className='color-bucket'>
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
                    {/* {areColorAmountHintsActive ? <MinMaxControl
                        key={iconName.hue + 720}
                        absoluteMin={0}
                        min={colorsMinMax[colorIndex][0]}
                        max={colorsMinMax[colorIndex][1]}
                        setMin={(min:number) => setColorMinMax({ colorIndex, min })}
                        setMax={(max:number) => setColorMinMax({ colorIndex, max })}
                        absoluteMax={maxIdenticalColorsInSolution}
                        /> : null
                    } */}
                </div>
            )
        })}
    </div>
}

export default IconBuckets;