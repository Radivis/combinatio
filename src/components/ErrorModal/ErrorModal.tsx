import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import './ErrorModal.css';

interface errorModalProps {
    messageHeader: string,
    messageBody: string,
    onDismiss: Function,
}

const ErrorModal = (props: errorModalProps) => {

    const { messageHeader, messageBody, onDismiss } = props;

    const onClickHandler = () => {
        onDismiss();
    }

    return (
        <div className="background-shadow">
            <div className="modal">
                <FontAwesomeIcon icon={faTriangleExclamation} size="2xl" style={{color: "#ff3000"}}/>
                <span className="title">{messageHeader}</span>
                    <p>{messageBody}</p>
                <button className="button" onClick={onClickHandler}>Dismiss</button>
            </div>
        </div>
    );

    
};

export default ErrorModal;