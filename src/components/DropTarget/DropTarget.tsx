


const DropTarget = (props: any) => {
    const { children, onItemDropped } = props;

    const dragOver = (ev: any) => {
        ev.preventDefault();
    }
      
    const drop = (ev: any, index?: number) =>  {
        const droppedDataObject = JSON.parse(ev.dataTransfer.getData("text/plain"));

        if (droppedDataObject) {
            onItemDropped(droppedDataObject, index);
        }
    }
      
    return (
        <div onDragOver={dragOver} onDrop={drop}>
            {children}
        </div>
    );
}

export default DropTarget;