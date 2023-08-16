import Color from "../../util/Color";

import './ColorPin.css';
import useGameStore from "../../store/gameStore";
import Icon from "../Icon/Icon";
import useLongPress from "../../hooks/useLongPress";
import { useState } from "react";
import ColorSelector from "../ColorSelector/ColorSelector";
import IconSelector from "../IconSelector/IconSelector";

interface ColorPinProps {
    color: Color;
    contextType?: string;
    colorIndex?: number;
    columnIndex?: number;
    rowIndex?: number;
    areIconsTransparent?: boolean;
    canRenderColorSelector?: boolean;
    canRenderIconSelector?: boolean;
    iconName?: string;
    isDisabled?: boolean,
    isOpaque?: boolean,
    isHighlighted?: boolean,
    isOpacityToogleActive?: boolean,
    isDisabledToggleActive?: boolean,
    isRenderingColorSelector?: boolean,
    opacityToogleCallback?: (piece: Color | string) => void,
}

const ColorPin = (props: ColorPinProps) => {
    const {
        color,
        contextType,
        iconName,
        columnIndex,
        rowIndex,
        areIconsTransparent,
        canRenderColorSelector,
        canRenderIconSelector,
        isOpacityToogleActive,
        isDisabledToggleActive,
        isDisabled,
        isHighlighted,
        opacityToogleCallback,
    } = props;

    const [isRenderingColorSelector, setIsRenderingColorSelector] = useState<boolean>(false);
    const [isRenderingIconSelector, setIsRenderingIconSelector] = useState<boolean>(false);

    let {isOpaque} = props;
    if (isOpaque === undefined) isOpaque = false;

    const { toggleDisableColor, toggleDisableIcon } = useGameStore((state) => {
        const { toggleDisableColor, toggleDisableIcon } = state;
        return { toggleDisableColor, toggleDisableIcon };
    })

    let className = 'colorPin ';
    className += isOpaque ? 'opaque-color ' : '';
    className += isDisabled ? 'disabled-color ' : '';
    className += isHighlighted ? 'highlighted-color ' : '';
    className.trim();

    const onClick = (ev: any) => {
        // enable color or icon in any case by clicking, if it is disabled
        if (isDisabled) {
            if (iconName !== undefined) {
                toggleDisableIcon(iconName);
            } else {
                toggleDisableColor(color);
            }
        }
        else {
            if (isDisabledToggleActive) {
                toggleDisableColor(color);
            } else if (isOpacityToogleActive && opacityToogleCallback !== undefined) {
                if (iconName !== undefined) {
                    opacityToogleCallback(iconName);
                } else {
                    opacityToogleCallback(color);
                }
            }
        }
        setIsRenderingColorSelector(false);
        setIsRenderingIconSelector(false);
    }

    const onLongPress = (ev: any) => {
        if (canRenderColorSelector === true) {
            setIsRenderingColorSelector(true);
        }
        if (canRenderIconSelector === true) {
            setIsRenderingIconSelector(true);
        }
    }

    const { handlers } = useLongPress({
        onClickHandler: onClick,
        onLongPressHandler: onLongPress,
    });

    // This case shouldn't happen, it's just for error handling
    const style = color !== undefined ? {backgroundColor: color.hsl} : {};

    return (
        <div className="color-pin-container">
            {isRenderingIconSelector && (
                <IconSelector
                    contextType={contextType!}
                    columnIndex={columnIndex!}
                    rowIndex={rowIndex!}
                    onClose={() => setIsRenderingIconSelector(false)}
                />
            )}
            {isRenderingColorSelector && (
                <ColorSelector
                    contextType={contextType!}
                    columnIndex={columnIndex!}
                    rowIndex={rowIndex!}
                    onClose={() => setIsRenderingColorSelector(false)}
                />
            )}
            <div
                className={className}
                style={style}
                {...handlers}
            >
                {iconName !== undefined && iconName !== '' &&
                    <Icon
                        iconName={iconName}
                        isTransparent={areIconsTransparent}
                    />
                }
            </div>
        </div>
    );
};

export default ColorPin;