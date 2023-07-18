import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import './IntegerControl.css';

interface integerControlProps {
    integer: number;
    setInteger: Function;
    minValue: number;
    maxValue: number;
    isIncrementCodependent: boolean;
    isDecrementCodependent: boolean;
    codependentValue: number;
    setCodependentValue: Function;
}

const IntegerControl = (props: integerControlProps) => {
    const {
        integer,
        setInteger,
        minValue,
        maxValue,
        isIncrementCodependent,
        isDecrementCodependent,
        codependentValue,
        setCodependentValue } = props;

    const onDecrement = () => {
        if (integer > minValue) {
            setInteger(integer - 1);
            if (isDecrementCodependent && integer === codependentValue) setCodependentValue(codependentValue - 1);
        }
    }

    const onIncrement = () => {
        if (integer < maxValue) {
            setInteger(integer + 1);
            if (isIncrementCodependent && integer === codependentValue) setCodependentValue(codependentValue + 1);
        }
    }

    return <div className='integer-control'>
        <button className='crement-button' onClick={onDecrement}>
            <FontAwesomeIcon icon={faMinus} />
        </button>
        {integer}
        <button className='crement-button' onClick={onIncrement}>
            <FontAwesomeIcon icon={faPlus} />
        </button>
    </div>
}

export default IntegerControl;