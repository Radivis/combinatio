import { MouseEventHandler } from 'react';
import useGameStore from '../../store/gameStore';
import './IconSelector.css';
import Icon from '../Icon/Icon';

interface colorSelectorProps {
    contextType: string;
    columnIndex: number;
    rowIndex: number;
    onClose: MouseEventHandler;
}

const IconSelector = (props: colorSelectorProps) => {
    const { contextType, columnIndex, rowIndex, onClose } = props;

    const {
        iconCollectionNames,
        placeIcon,
        placeTupleIcon,
     } = useGameStore((state) => {
        const { iconCollectionNames } = state.game;
        const { placeIcon, placeTupleIcon } = state;
        return {
            iconCollectionNames,
            placeIcon,
            placeTupleIcon,
        }
    })

    const onClick = (ev: any, iconIndex: number) => {
        if (contextType === 'game') {
            placeIcon({
                iconName: iconCollectionNames[iconIndex],
                row: rowIndex,
                column: columnIndex,
            })
        }
        if (contextType === 'combination-notes') {
            placeTupleIcon({
                iconName: iconCollectionNames[iconIndex],
                rowIndex,
                columnIndex,
            })
        }
        onClose(ev);
    }

    const onUnsetIcon = (ev: any) => {
        if (contextType === 'game') {
            placeIcon({
                iconName: '',
                row: rowIndex,
                column: columnIndex,
            })
        }
        if (contextType === 'combination-notes') {
            placeTupleIcon({
                iconName: '',
                rowIndex,
                columnIndex,
            })
        }
        onClose(ev);
    }

    return (
        <div className="icon-selector">
            <button
                type='button'
                className="icon-selector-close-button"
                onClick={onClose}
            >x</button>
            {iconCollectionNames.map((iconName: string, iconIndex: number) => {
                return (
                    <div onClick = {(ev) => onClick(ev, iconIndex)}>
                        <Icon 
                            iconName = {iconName} 
                        />
                    </div>                
                )
            })}
            <div onClick = {(ev) => onUnsetIcon(ev)}>
                <Icon 
                    iconName = {'fa-ban'}
                />
            </div>
        </div>
    )
}

export default IconSelector;