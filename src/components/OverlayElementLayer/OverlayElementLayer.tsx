import './OverlayElementLayer.css';


interface overlayElementLayerProps {
    children: any
    x?: number
    y?: number
}

const OverlayElementLayer = (props: overlayElementLayerProps) => {
    const { children, x, y } = props;

    const style = {
        left: x + 'px',
        top: y + 'px',
    }

    return (
        <div
            className='overlay-element-layer-container'
            style={style}
        >
            {children}
        </div>
    )
};

export default OverlayElementLayer;