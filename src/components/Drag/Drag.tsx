import './Drag.css'

const Drag = (props: any) => {
    const { children, dragPayloadObject, isActive } = props;

    const startDrag = (ev: any) => {
      if (isActive === true) {
        ev.dataTransfer.setData("text/plain", JSON.stringify(dragPayloadObject));
      }
    }

    if(isActive) {
      return(
        <div className="drag" draggable onDragStart={startDrag}>
          {children}
        </div>);
    } else {
      return (<div className="no-drag">{children}</div>);
    }
}

export default Drag;