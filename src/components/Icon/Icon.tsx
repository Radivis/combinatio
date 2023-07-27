import './Icon.css';
import useGameStore from "../../store/gameStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';

interface IconProps {
    iconName: string;
    isDisabled?: boolean,
    isOpaque?: boolean,
    isHighlighted?: boolean,
    isOpacityToogleActive?: boolean,
    isDisabledToggleActive?: boolean,
    opacityToogleCallback?: (iconName: string) => void,
}

const Icon = (props: IconProps) => {
    const {
        iconName,
        isOpacityToogleActive,
        isDisabledToggleActive,
        isDisabled,
        isHighlighted,
        opacityToogleCallback,
    } = props;

    let {isOpaque} = props;
    if (isOpaque === undefined) isOpaque = false;

    const { toggleDisableIcon } = useGameStore((state) => {
        const { toggleDisableIcon } = state;
        return { toggleDisableIcon };
    })

    let className = 'iconPin ';
    className += isOpaque ? 'opaque ' : '';
    className += isDisabled ? 'disabled ' : '';
    className += isHighlighted ? 'highlighted ' : '';
    className.trim();

    const onClick = (ev: any) => {
        // enable icon in any case by clicking, if it is disabled
        if (isDisabled) toggleDisableIcon(iconName);
        else {
            if (isDisabledToggleActive) {
                toggleDisableIcon(iconName);
            } else if (isOpacityToogleActive && opacityToogleCallback !== undefined) {
                opacityToogleCallback(iconName);
            }
        }
    }

    // This case shouldn't happen, it's just for error handling
    // const style = iconName !== undefined ? {backgroundColor: color.hsl} : {};

    return (
        <FontAwesomeIcon
            className={className}
            icon={iconName as IconName}
            onClick={onClick}
        />
    );
};

export default Icon;