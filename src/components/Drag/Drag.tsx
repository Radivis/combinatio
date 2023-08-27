import { uiStore } from '../../interfaces/types';
import useUiStore from '../../store/uiStore';
import './Drag.css'

const Drag = (props: any) => {
    const { children, dragPayloadObject, isActive } = props;

    const { setIsClickSuppressed, setIsLongPressSuppressed, setSelection } = useUiStore((state: uiStore) => {
        const { setIsClickSuppressed, setIsLongPressSuppressed, setSelection } = state;
        return { setIsClickSuppressed, setIsLongPressSuppressed, setSelection }
    })

    const onClick = (ev: any) => {
        if (isActive === true) {
            setSelection(dragPayloadObject);
            // setIsClickSuppressed(true);
            // setTimeout(() => setIsClickSuppressed(false), 500);
        }
    }

    const startDrag = (ev: any) => {
        if (isActive === true) {
            setIsLongPressSuppressed(true);
            ev.dataTransfer.setData("text/plain", JSON.stringify(dragPayloadObject));
            /* Try to prevent the background of the dragged element from being dragged with it,
            * but this doesn't work, because they control how the HTML element is converted into
            * a picture that is dragged along with the cursor!
            */
            ev.dataTransfer.setDragImage(ev.target, ev.target.offsetWidth / 2, ev.target.offsetHeight / 2);
        }
    }

    const endDrag = (ev: any) => {
      setIsLongPressSuppressed(false);
    }

    if(isActive) {
        return(
            <div
                className="drag"
                draggable
                onClick={onClick}
                onDragStart={startDrag}
                onDragEnd={endDrag}
            >
                {children}
            </div>
        );
    } else {
          return (<div className="no-drag">{children}</div>);
    }
}

export default Drag;