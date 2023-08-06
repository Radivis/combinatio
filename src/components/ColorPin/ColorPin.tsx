import Color from "../../util/Color";

import './ColorPin.css';
import useGameStore from "../../store/gameStore";
import Icon from "../Icon/Icon";

interface ColorPinProps {
    color: Color;
    colorIndex?: number;
    iconName?: string;
    isDisabled?: boolean,
    isOpaque?: boolean,
    isHighlighted?: boolean,
    isOpacityToogleActive?: boolean,
    isDisabledToggleActive?: boolean,
    opacityToogleCallback?: (piece: Color | string) => void,
}

const ColorPin = (props: ColorPinProps) => {
    const {
        color,
        iconName,
        isOpacityToogleActive,
        isDisabledToggleActive,
        isDisabled,
        isHighlighted,
        opacityToogleCallback,
    } = props;

    let {isOpaque} = props;
    if (isOpaque === undefined) isOpaque = false;

    const { toggleDisableColor, toggleDisableIcon } = useGameStore((state) => {
        const { toggleDisableColor, toggleDisableIcon } = state;
        return { toggleDisableColor, toggleDisableIcon };
    })

    let className = 'colorPin ';
    className += isOpaque ? 'opaque ' : '';
    className += isDisabled ? 'disabled ' : '';
    className += isHighlighted ? 'highlighted ' : '';
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
    }

    // This case shouldn't happen, it's just for error handling
    const style = color !== undefined ? {backgroundColor: color.hsl} : {};

    return (
        <div className={className} style={style} onClick={onClick}>
            {iconName !== undefined && iconName !== '' &&
                <Icon
                    iconName={iconName}
                    isTransparent={true}
                />
            }
        </div>
    );
};

export default ColorPin;