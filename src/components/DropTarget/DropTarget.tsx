import { uiStore } from "../../interfaces/types";
import useUiStore from "../../store/uiStore";



const DropTarget = (props: any) => {
    const { children, onItemDropped } = props;

    const { selection, setSelection } = useUiStore((state: uiStore) => {
        const { selection, setSelection } = state;
        return { selection, setSelection } 
    })

    const dragOver = (ev: any) => {
        ev.preventDefault();
    }
      
    const drop = (ev: any, index?: number) => {
        const droppedDataObject = JSON.parse(ev.dataTransfer.getData("text/plain"));

        if (droppedDataObject) {
            onItemDropped(droppedDataObject, index);
        }
    }

    const onClick = (ev: any, index?:number) => {
        if (selection !== undefined) {
            onItemDropped(selection, index);
            setSelection(undefined);
        }
    }
      
    return (
        <div onDragOver={dragOver} onDrop={drop} onClick={onClick}>
            {children}
        </div>
    );
}

export default DropTarget;