import './MinMaxControl.css';
import IntegerControl from "../IntegerControl/IntegerControl";

interface minMaxSliderProps {
    absoluteMin: number,
    absoluteMax: number,
    emphasizeMin?: boolean,
    emphasizeMax?: boolean,
    min: number,
    max: number,
    setMin: (min: number) => void,
    setMax: (max: number) => void,
}

const MinMaxControl = (props: minMaxSliderProps) => {
    const {
        absoluteMin,
        absoluteMax,
        emphasizeMin,
        emphasizeMax,
        min,
        max,
        setMax,
        setMin } = props;

    const classArray: string[] = [];
    for (let i = absoluteMin; i < min; i++) classArray.push('slider-block empty');
    for (let i = min; i <= max; i++) classArray.push('slider-block filled');
    for (let i = max + 1; i <= absoluteMax; i++) classArray.push('slider-block empty');

    const minClass = emphasizeMin ? 'text-emphasis' : '';
    const maxClass = emphasizeMax ? 'text-emphasis' : '';

    return <div className='slider'>
        <span className={minClass}>
            Min:
        </span>
        <IntegerControl
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
        <span className={maxClass}>
            Max:
        </span>
        <IntegerControl
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