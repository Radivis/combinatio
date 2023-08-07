import './Legend.css';
import '../InfoPins/InfoPins.css';
import useGameStore from '../../store/gameStore';
import { pieceTypes } from '../../constants';

const Legend = () => {

    const { pieceType } = useGameStore(state => {
        const { pieceType } = state.gameSettings;
        return {
            pieceType
        }
    })

    if (pieceType === pieceTypes.colorIcon) {
        return (
            <div className="legend">
                <h3>Legend</h3>
                <p className="legend-intro">
                    A color-icon is the combination of a color and an icon.<br/>
                    "Appearance" respects the multiplicity of a piece.<br/>
                    For example, if you place a color twice, <br/>
                    but the solution only contains one instance of that color, <br/>
                    only the first guess will be indicated as "appears"!
                </p>
                <div className="legend-list">
                    <div className="legend-list-item">
                        <div className="info-pin black" />
                        Color-icon is correct
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin black-grey" />
                        Color-icon appears, color is correct
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin grey-black" />
                        Color-icon appears, icon is correct
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin grey" />
                        Color-icon appears
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin black-white" />
                        Color is correct, icon appears
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin white-black" />
                        Icon is correct, color appears
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin black-rim" />
                        Color is correct, icon doesn't appear
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin black-core" />
                        Icon is correct, color doesn't appear
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin white" />
                        Color appears, and icon appears, but not color-icon
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin white-rim" />
                        Color appears, icon doesn't appear
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin white-core" />
                        Icon appears, color doesn't appear 
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin hole" />
                        Neither color nor icon appear
                    </div>
                </div>
            </div>
        );
    } else if (pieceType === pieceTypes.color) {
        return (
            <div className="legend">
                <h3>Legend</h3>
                <p className="legend-intro">
                    "Appearance" respects the multiplicity of a piece.<br/>
                    For example, if you place a color twice, <br/>
                    but the solution only contains one instance of that color, <br/>
                    only the first guess will be indicated as "appears"!
                </p>
                <div className="legend-list">
                    <div className="legend-list-item">
                        <div className="info-pin black" />
                        Color is correct
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin white" />
                        Color appears 
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin hole" />
                        Color doesn't appear
                    </div>
                </div>
            </div>
        );
    } else if (pieceType === pieceTypes.icon) {
        return (
            <div className="legend">
                <h3>Legend</h3>
                <p className="legend-intro">
                    "Appearance" respects the multiplicity of a piece.<br/>
                    For example, if you place an icon twice, <br/>
                    but the solution only contains one instance of that icon, <br/>
                    only the first guess will be indicated as "appears"!
                </p>
                <div className="legend-list">
                    <div className="legend-list-item">
                        <div className="info-pin black" />
                        Icon is correct
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin white" />
                        Icon appears 
                    </div>
                    <div className="legend-list-item">
                        <div className="info-pin hole" />
                        Icon doesn't appear
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="legend">
                <h3>Legend</h3>
                <p className="legend-intro">
                    If you see this your game mode is invalid!
                </p>
            </div>
        );
    }
}

export default Legend;