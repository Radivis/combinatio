import useUiStore from '../../store/uiStore';
import './Drag.css'

const Drag = (props: any) => {
    const { children, dragPayloadObject, isActive } = props;

    const { setIsLongPressSuppressed } = useUiStore(state => {
      const { setIsLongPressSuppressed } = state;
      return { setIsLongPressSuppressed }
    })

    const startDrag = (ev: any) => {
      if (isActive === true) {
        setIsLongPressSuppressed(true);
        ev.dataTransfer.setData("text/plain", JSON.stringify(dragPayloadObject));
      }
    }

    const endDrag = (ev: any) => {
      setIsLongPressSuppressed(false);
    }

    if(isActive) {
      return(
        <div className="drag" draggable onDragStart={startDrag} onDragEnd={endDrag}>
          {children}
        </div>);
    } else {
      return (<div className="no-drag">{children}</div>);
    }
}

export default Drag;