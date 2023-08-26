import {MouseEventHandler, useState} from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Selection from './components/Selection/Selection';

import {
	faAsterisk,
    faBan,
    faBatteryHalf,
    faBolt,
    faBrain,
    faCannabis,
    faCarSide,
    faCat,
    faCircle,
    faCircleDot,
    faClover,
    faCow,
    faCrown,
    faCubes,
    faDiamond,
    faDog,
    faDove,
    faDroplet,
    faEgg,
    faFishFins,
    faGear,
    faGuitar,
    faHeart,
    faHelicopter,
    faHourglassHalf,
    faHorse,
    faKitMedical,
    faLightbulb,
    faMotorcycle,
    faPersonBiking,
    faPersonWalking,
    faPlaneUp,
    faScissors,
    faSkull,
    faSpaghettiMonsterFlying,
    faSquare,
    faShield,
    faStar,
    faToiletPaper,
    faTree,
    faTrophy,
    faWheelchairMove,
} from '@fortawesome/free-solid-svg-icons';

import Game from './components/Game/Game';
import Settings from './components/Settings/Settings';

import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import useGameStore from './store/gameStore';
import ErrorModal from './components/ErrorModal/ErrorModal';
import VersionHistory from './components/VersionHistory/VersionHistory';
import useUiStore from './store/uiStore';
import { uiStore } from './interfaces/types';
import ColorPin from './components/ColorPin/ColorPin';
import Color from './util/Color';
import OverlayElementLayer from './components/OverlayElementLayer/OverlayElementLayer';
import Icon from './components/Icon/Icon';

library.add(
	fas,
	faAsterisk,
    faBatteryHalf,
    faBan,
    faBolt,
    faBrain,
    faCannabis,
    faCarSide,
    faCat,
    faCircle,
    faCircleDot,
    faClover,
    faCow,
    faCrown,
    faCubes,
    faDiamond,
    faDog,
    faDove,
    faDroplet,
    faEgg,
    faFishFins,
    faGear,
    faGuitar,
    faHeart,
    faHelicopter,
    faHourglassHalf,
    faHorse,
    faKitMedical,
    faLightbulb,
    faMotorcycle,
    faPersonBiking,
    faPersonWalking,
    faPlaneUp,
    faScissors,
    faSkull,
    faSpaghettiMonsterFlying,
    faSquare,
    faShield,
    faStar,
    faToiletPaper,
    faTree,
    faTrophy,
    faWheelchairMove,
)

const App = () => {

	let [activePage, setActivePage] = useState<string>('game');
    let [mouseX, setMouseX] = useState<number>(0);
    let [mouseY, setMouseY] = useState<number>(0);
    let [discard, setDiscard] = useState<boolean>(false);

	const { isVisible, messageHeader, messageBody, setModal } = useGameStore((state) => {
		const { modal, setModal } = state;
		const { messageHeader, messageBody, isVisible } = modal;
		return { isVisible, messageHeader, messageBody, setModal };
	})

    const { selection, setSelection } = useUiStore((state: uiStore) => {
        const { selection, setSelection } = state;
        return { selection, setSelection };
    });

	const onDismiss = () => setModal({
		messageHeader: '',
		messageBody: '',
		isVisible: false,
	})

    const onClick: MouseEventHandler = (ev) => {
        if (selection !== undefined) {
            setDiscard(true);
            setTimeout(() => {
                setSelection(undefined);
                setDiscard(false);
            }, 500);
        }
    }

    const onMouseMove: MouseEventHandler = (ev) => {
        setMouseX(ev.clientX);
        setMouseY(ev.clientY);
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
                drop={discard}
            />
        }
    }

 	return (
		<div
            className="App"
            onClick={(ev) => onClick(ev)}
            onMouseMove={(ev) => onMouseMove(ev)}
        >
            <OverlayElementLayer
                x={mouseX}
                y={mouseY}
            >
                {overlayElement}
            </OverlayElementLayer>
			<AppHeader 
				setActivePage={setActivePage}
			/>
			<main>
				{isVisible && <ErrorModal 
					messageHeader={messageHeader}
					messageBody={messageBody}
					onDismiss={onDismiss}
				/>}
				{activePage === 'settings' ?
					<Settings
						setActivePage={setActivePage}
					/>
				:
                activePage === 'version-history' ?
                    <VersionHistory />
                :
					<Game />
				}
			</main>
            <Selection />
		</div>
  	);
}

export default App;
