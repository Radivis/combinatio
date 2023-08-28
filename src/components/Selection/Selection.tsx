import { pieceTypes } from "../../constants";
import { gameState, uiState } from "../../interfaces/types";
import useGameStore from "../../store/gameStore";
import useUiStore from "../../store/uiStore";
import Color from "../../util/Color";
import ColorIcon from "../../util/ColorIcon";
import ColorPin from "../ColorPin/ColorPin";
import Icon from "../Icon/Icon";

import './Selection.css';

const Selection = () => {
    const { selection } = useUiStore((state: uiState) => {
        const { selection } = state;
        return { selection } 
    })

    const { pieceType } = useGameStore((state: gameState) => {
        const { pieceType } = state.gameSettings;
        return { pieceType };
    })

    let selectionClassToRender = null;
    let selectionDataToRender: ColorIcon | Color | string | null = null;

    if (selection !== undefined) {
        if('hue' in selection && typeof selection['hue'] === 'number'
            && 'saturation' in selection && typeof selection['saturation'] === 'number'
            && 'lightness' in selection && typeof selection['lightness'] === 'number'
        ) {
            const { hue, saturation, lightness } = selection;
            if ('iconName' in selection && typeof selection['iconName'] === 'string') {
                const { iconName } = selection;
                selectionClassToRender = 'ColorIcon';
                selectionDataToRender = new ColorIcon(hue, saturation, lightness, iconName);
            } else {
                selectionClassToRender = 'Color';
                selectionDataToRender = new Color(hue, saturation, lightness);
            }
        } else {
            if ('iconName' in selection && typeof selection['iconName'] === 'string') {
                const { iconName } = selection; 
                selectionClassToRender = 'Icon';
                selectionDataToRender = iconName;
            }
        }
    }
    
    return (
        <div className="selection-container">
            {selectionDataToRender !== null &&
            <>
                <span className="selection-text">Selected Piece:</span>
                <div className="selection-box">
                {selectionClassToRender === 'ColorIcon' && selectionDataToRender instanceof ColorIcon ? (
                    <ColorPin
                        color = {selectionDataToRender.color}
                        iconName = {selectionDataToRender.iconName}
                        areIconsTransparent = {pieceType !== pieceTypes.icon}
                    />
                ) : selectionClassToRender === 'Color' && selectionDataToRender instanceof Color ? (
                    <ColorPin
                    color = {selectionDataToRender}
                />
                ) : selectionClassToRender === 'Icon' && typeof selectionDataToRender === 'string' ? (
                    <Icon 
                        iconName={selectionDataToRender}
                    />
                ) : null}
                </div>
            </>
            }
        </div>
    );
}

export default Selection;