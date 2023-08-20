import { createRef, useEffect } from 'react';
import { uiStore } from '../../interfaces/types';
import useUiStore from '../../store/uiStore';
import './Drag.css'

const Drag = (props: any) => {
    const { children, dragPayloadObject, isActive } = props;

    const { setIsLongPressSuppressed } = useUiStore((state: uiStore) => {
        const { setIsLongPressSuppressed } = state;
        return { setIsLongPressSuppressed }
    })

    const startDrag = (ev: any) => {
        console.log('startDrag fired');
        // Supress the default behavior of the touchstart event of mobile devices that initiates scrolling
        if ('touches' in ev)  {
            console.log('suppressing default behavior of onTouchStart event handler');
            setIsLongPressSuppressed(true);
            ev.preventDefault();
            return;
        }

        if (isActive === true) {
            setIsLongPressSuppressed(true);
            ev.dataTransfer.setData("text/plain", JSON.stringify(dragPayloadObject));
            /* Try to prevent the background of the dragged element from being dragged with it,
            * but this doesn't work, because they control how the HTML element is converted into
            * a picture that is dragged along with the cursor!
            */
            ev.dataTransfer.setDragImage(ev.target, ev.target.offsetWidth / 2, ev.target.offsetHeight / 2);

            // prevent scrolling for touch devices
            ev.preventDefault();
        }
    }

    const endDrag = (ev: any) => {
      setIsLongPressSuppressed(false);
    }

    const listenerRef = createRef<any>();

    // React uses passive event listeners for touch events by default, so this approach needs to be used
    useEffect(() => {
        listenerRef.current.addEventListener('touchstart', startDrag, {passive: false});
        return () => {
            listenerRef.current.removeEventListener('touchstart', startDrag, {passive: false});
        }
    }, [])

    if(isActive) {
        return(
                <div
                    ref={listenerRef}
                    className="drag"
                    draggable
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