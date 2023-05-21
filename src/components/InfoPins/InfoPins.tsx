import './InfoPins.css';


interface infoPinsProps {
    onSubmitRow: () => void;
    isActiveRow: boolean;
};

const InfoPins = (props: infoPinsProps) => {
    const { onSubmitRow, isActiveRow } = props;

    return (
        <div>
            {
                (isActiveRow === true) ? (
                    <button className="submit-button" type="button" onClick={onSubmitRow}>
                        ?
                    </button>
                ) : (
                    <div className="info-pins">
                        <div className='info-pin'></div>
                        <div className='info-pin'></div>
                        <div className='info-pin'></div>
                        <div className='info-pin'></div>
                    </div>
                )
            }
        </div>
    );
}

export default InfoPins;