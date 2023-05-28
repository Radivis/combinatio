import { useState, useEffect } from "react"

import './MinMaxControl.css';
import IntegerControl from "../IntegerControl/IntegerControl";

interface minMaxSliderProps {
    absoluteMin: number,
    absoluteMax: number,
    shouldReset: boolean,
}

const MinMaxControl = (props: minMaxSliderProps) => {
    const { absoluteMin, absoluteMax, shouldReset } = props;

    const [min, setMin] = useState(absoluteMin);
    const [max, setMax] = useState(absoluteMax);

    const classArray: string[] = [];
    for (let i = absoluteMin; i < min; i++) classArray.push('slider-block empty');
    for (let i = min; i <= max; i++) classArray.push('slider-block filled');
    for (let i = max + 1; i <= absoluteMax; i++) classArray.push('slider-block empty');

    useEffect(() => {
        if (shouldReset) {
            setMin(absoluteMin);
            setMax(absoluteMax);
        }
    }, [shouldReset, absoluteMin, absoluteMax]);

    return <div className='slider'>
        Min:<IntegerControl
            integer={min}
            minValue={absoluteMin}
            maxValue = {absoluteMax}
            setInteger={setMin}
            isIncrementCodependent={true}
            isDecrementCodependent={false}
            codependentValue={max}
            setCodependentValue={setMax}
        />
        <div className='value-display'>
            {classArray.map((className, index) => <div className={className} key={index}>
                {index}
            </div>
            )}
        </div>
        Max:<IntegerControl
            integer={max}
            minValue={absoluteMin}
            maxValue={absoluteMax}
            setInteger={setMax}
            isIncrementCodependent={false}
            isDecrementCodependent={true}
            codependentValue={min}
            setCodependentValue={setMin}
        />
    </div>
}

export default MinMaxControl;