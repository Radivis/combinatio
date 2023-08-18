import './Icon.css';
import useGameStore from "../../store/gameStore";
import useLongPress from '../../hooks/useLongPress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { longPressExtendedDuration } from '../../constants';

interface IconProps {
    iconName: string;
    isTransparent?: boolean,
    isDisabled?: boolean,
    isOpaque?: boolean,
    isHighlighted?: boolean,
    isOpacityToogleActive?: boolean,
    isDisabledToggleActive?: boolean,
    selectColumnIconOnLongpress?: number,
    opacityToogleCallback?: (iconName: string) => void,
}

const Icon = (props: IconProps) => {
    const {
        iconName,
        isOpacityToogleActive,
        isDisabledToggleActive,
        isTransparent,
        isDisabled,
        isHighlighted,
        selectColumnIconOnLongpress,
        opacityToogleCallback,
    } = props;

    const longPressDuration = longPressExtendedDuration;

    let {isOpaque} = props;
    if (isOpaque === undefined) isOpaque = false;

    const { setPossibleIcons, toggleDisableIcon } = useGameStore((state) => {
        const { setPossibleIcons, toggleDisableIcon } = state;
        return { setPossibleIcons, toggleDisableIcon };
    })

    let className = 'iconPin ';
    className += isTransparent ? 'transparent-icon ' : '';
    className += isOpaque ? 'opaque-icon ' : '';
    className += isDisabled ? 'disabled-icon ' : '';
    className += isHighlighted ? 'highlighted-icon ' : '';
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

    const onLongPress = (ev: any) => {
        if (selectColumnIconOnLongpress !== undefined) {
                setPossibleIcons([iconName], selectColumnIconOnLongpress);
        }
    }

    const { handlers } = useLongPress({
        onClickHandler: onClick,
        onLongPressHandler: onLongPress,
        longPressDuration,
    });

    // This case shouldn't happen, it's just for error handling
    // const style = iconName !== undefined ? {backgroundColor: color.hsl} : {};

    return (
        <div {...handlers}>
            <FontAwesomeIcon
                className={className}
                icon={iconName as IconName}
                size="lg"
            />
        </div>
    );
};

export default Icon;