import { uiStore } from "../../interfaces/types";
import useUiStore from "../../store/uiStore";



const DropTarget = (props: any) => {
    const { children, onItemDropped } = props;

    const { selection, setSelection, setIsGlobalClickSuppressed } = useUiStore((state: uiStore) => {
        const { selection, setSelection, setIsGlobalClickSuppressed } = state;
        return { selection, setSelection, setIsGlobalClickSuppressed } 
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

    // Suppress global clicks, so that the selection cannot be discarded by accident
    const onMouseEnter = (ev: any) => {
        setIsGlobalClickSuppressed(true);
    }

    const onMouseLeave = (ev: any) => {
        setIsGlobalClickSuppressed(false);
        console.log("leaving drop target");
    }
      
    return (
        <div
            onDragOver={dragOver}
            onDrop={drop}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </div>
    );
}

export default DropTarget;