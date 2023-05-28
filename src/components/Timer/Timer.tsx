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

    return <div>
        Timer: {`${pad(minuteCount)}:${pad(secondCount)}`}
    </div>
}

export default Timer;