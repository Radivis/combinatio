const Drag = (props: any) => {
    const { children, dragPayloadObject } = props;

    const startDrag = (ev: any) => {
        ev.dataTransfer.setData("text/plain", JSON.stringify(dragPayloadObject));
    }

    return(
        <div draggable onDragStart={startDrag}>
          {children}
        </div>);
}

export default Drag;