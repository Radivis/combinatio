import './Timer.css';

interface timerProps {
    seconds: number
}

const pad = (value: number): string => {
    return value < 10 ? '0'+value : value.toString();
}

const Timer = (props: timerProps) => {
    const { seconds } = props;

    const minuteCount = Math.floor(seconds / 60);
    const secondCount = seconds % 60;

    return <div className='timer'>
        Timer: <span className='time'>{`${pad(minuteCount)}:${pad(secondCount)}`}</span>
    </div>
}

export default Timer;