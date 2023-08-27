import Color from '../../util/Color';
import ColorPin from '../ColorPin/ColorPin';
import './OverlayElementLayer.css';
import useUiStore from '../../store/uiStore';
import Icon from '../Icon/Icon';
import { uiStore } from '../../interfaces/types';


interface overlayElementLayerProps {
    x: number;
    y: number;
    discard: boolean;
}

const OverlayElementLayer = (props: overlayElementLayerProps) => {
    const {x, y, discard} = props;

    const { selection } = useUiStore((state: uiStore) => {
        const { selection } = state;
        return { selection };
    });

    const style = {
        left: x + 'px',
        top: y + 'px',
    }

    let overlayElement = null;
    if (selection !== undefined) {
        const hasColor = 'hue' in selection && typeof selection['hue'] === 'number'
            && 'saturation' in selection && typeof selection['saturation'] === 'number'
            && 'lightness' in selection && typeof selection['lightness'] === 'number';
        const hasIcon = 'iconName' in selection && typeof selection['iconName'] === 'string';
        if (hasColor) {
            const hue: number = selection['hue'] as number;
            const saturation: number = selection['saturation'] as number;
            const lightness: number = selection['lightness'] as number;
            const color = new Color(hue, saturation, lightness)
            const iconName = hasIcon ? selection['iconName'] as string : undefined
            overlayElement = <ColorPin
                color={color}
                iconName={iconName}
                discard={discard}
            />
        } else if (hasIcon) {
            overlayElement = <Icon
                iconName={selection['iconName'] as string}
                discard={discard}
            />
        }
    }

    return (
        <div
            className='overlay-element-layer-container'
        >
            <div
                className='overlay-element-container'
                style={style}>
                {overlayElement}
            </div>
        </div>
    )
};

export default OverlayElementLayer;