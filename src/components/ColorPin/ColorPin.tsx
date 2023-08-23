import Color from "../../util/Color";

import './ColorPin.css';
import useGameStore from "../../store/gameStore";
import Icon from "../Icon/Icon";
import useLongPress from "../../hooks/useLongPress";
import { useState } from "react";
import ColorSelector from "../ColorSelector/ColorSelector";
import IconSelector from "../IconSelector/IconSelector";
import Colors from "../../util/Colors";
import { longPressDefaultDuration, longPressExtendedDuration } from "../../constants";

interface ColorPinProps {
    color: Color;
    contextType?: string;
    colorIndex?: number;
    columnIndex?: number;
    rowIndex?: number;
    areIconsTransparent?: boolean;
    canRenderColorSelector?: boolean;
    canRenderIconSelector?: boolean;
    selectColumnColorOnLongpress?: number;
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
        selectColumnColorOnLongpress,
        isOpacityToogleActive,
        isDisabledToggleActive,
        isDisabled,
        isHighlighted,
        opacityToogleCallback,
    } = props;

    const longPressDuration = selectColumnColorOnLongpress !== undefined
        ? longPressExtendedDuration
        : longPressDefaultDuration;

    const [isRenderingColorSelector, setIsRenderingColorSelector] = useState<boolean>(false);
    const [isRenderingIconSelector, setIsRenderingIconSelector] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    let {isOpaque} = props;
    if (isOpaque === undefined) isOpaque = false;

    const { setPossibleColors, toggleDisableColor, toggleDisableIcon } = useGameStore((state) => {
        const { setPossibleColors, toggleDisableColor, toggleDisableIcon } = state;
        return { setPossibleColors, toggleDisableColor, toggleDisableIcon };
    })

    let className = 'colorPin ';
    className += isOpaque ? 'opaque-color ' : '';
    className += isDisabled ? 'disabled-color ' : '';
    className += isHighlighted ? 'highlighted-color ' : '';
    className += isSelected ? 'pick-up ' : '';
    className.trim();

    const onClick = (ev: any) => {
        setIsSelected(true);
        setTimeout(() => { setIsSelected(false);}, 1000);
        if (!isDisabled && isOpacityToogleActive && opacityToogleCallback !== undefined) {
            if (iconName !== undefined) {
                opacityToogleCallback(iconName);
            } else {
                opacityToogleCallback(color);
            }
        }
        setIsRenderingColorSelector(false);
        setIsRenderingIconSelector(false);
    }

    const onLongPress = () => {
        // enable color or icon in any case by long press, if it is disabled
        if (isDisabled) {
            if (iconName !== undefined) {
                toggleDisableIcon(iconName);
            } else {
                toggleDisableColor(color);
            }
            return;
        }
        else {
            if (isDisabledToggleActive) {
                toggleDisableColor(color);
            }
        }
        if (canRenderColorSelector === true) {
            setIsRenderingColorSelector(true);
        }
        if (canRenderIconSelector === true) {
            setIsRenderingIconSelector(true);
        }
        if (selectColumnColorOnLongpress !== undefined) {
            setPossibleColors(new Colors([color]), selectColumnColorOnLongpress);
        }
    }

    const { handlers } = useLongPress({
        onClickHandler: onClick,
        onLongPressHandler: onLongPress,
        longPressDuration,
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