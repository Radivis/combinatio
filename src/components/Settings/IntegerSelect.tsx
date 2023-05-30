import { ChangeEventHandler } from "react";
import { range } from "../../util/range";

import './IntegerSelect.css';

interface integerSelectProps {
    min: number;
    max: number;
    name: string;
    defaultValue: number;
    onChange: ChangeEventHandler;
}

const IntegerSelect = (props: integerSelectProps) => {
    const { min, max, defaultValue, onChange } = props;
    const optionRange = range(max+1, min);

    return (
        <select className='integer-select' onChange = {onChange} value={defaultValue}>
            {optionRange.map((integer: number) => <option
                key={integer}
                value={integer}
            >
                {integer}
                </option>)}
        </select>
    )
}

export default IntegerSelect;