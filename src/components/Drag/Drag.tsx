import { uiStore } from '../../interfaces/types';
import useUiStore from '../../store/uiStore';
import './Drag.css'

const Drag = (props: any) => {
    const { children, dragPayloadObject, isActive } = props;

    const {
        isLongPressInProgress,
        selection,
        setIsGlobalClickSuppressed,
        setIsLongPressSuppressed,
        setSelection,
    } = useUiStore((state: uiStore) => {
        const {
            isLongPressInProgress,
            selection,
            setIsGlobalClickSuppressed,
            setIsLongPressSuppressed,
            setSelection,
        } = state;
        return {
            isLongPressInProgress,
            selection,
            setIsGlobalClickSuppressed,
            setIsLongPressSuppressed,
            setSelection,
        }
    })

    const onClick = (ev: any) => {
        if (isActive === true && !isLongPressInProgress) {
            if (selection === undefined) {
                setSelection(dragPayloadObject);
            } else {
                if (
                    'hue' in selection
                    && !('hue' in dragPayloadObject)
                    && 'iconName' in dragPayloadObject
                ) {
                    // payload is a simple icon, add it to the current selection or replace its icon
                    setSelection({ ...selection, iconName: dragPayloadObject.iconName })
                } else if (
                    'iconName' in selection
                    && !('iconName' in dragPayloadObject)
                    && 'hue' in dragPayloadObject
                ) {
                    // payload is a simple color, add it to the current selection or replace its color
                    setSelection({
                        ...selection,
                        hue: dragPayloadObject.hue,
                        saturation: dragPayloadObject.saturation,
                        lightness: dragPayloadObject.lightness,
                    })
                } else {
                    setSelection(dragPayloadObject);
                }
            }
        }
    }

    // Suppress global clicks, so that the selection cannot be discarded by accident
    const onMouseEnter = (ev: any) => {
        setIsGlobalClickSuppressed(true);
    }

    const onMouseLeave = (ev: any) => {
        setIsGlobalClickSuppressed(false);
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
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
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