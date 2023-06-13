import { useState, useEffect } from "react"

import './MinMaxControl.css';
import IntegerControl from "../IntegerControl/IntegerControl";

interface minMaxSliderProps {
    absoluteMin: number,
    absoluteMax: number,
    shouldReset: boolean,
    setMinCallback?: (min: number) => void,
    setMaxCallback?: (max: number) => void,
}

const MinMaxControl = (props: minMaxSliderProps) => {
    const { absoluteMin, absoluteMax, shouldReset, setMaxCallback, setMinCallback } = props;

    const [min, setMin] = useState(absoluteMin);
    const [max, setMax] = useState(absoluteMax);

    const setMinExternal = (min: number) => {
        if (setMinCallback !== undefined) setMinCallback(min);
        setMin(min);
    }

    const setMaxExternal = (max: number) => {
        if (setMaxCallback !== undefined) setMaxCallback(max);
        setMax(max);
    }

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
            setInteger={setMinExternal}
            isIncrementCodependent={true}
            isDecrementCodependent={false}
            codependentValue={max}
            setCodependentValue={setMaxExternal}
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
            setInteger={setMaxExternal}
            isIncrementCodependent={false}
            isDecrementCodependent={true}
            codependentValue={min}
            setCodependentValue={setMinExternal}
        />
    </div>
}

export default MinMaxControl;