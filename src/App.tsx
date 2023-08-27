import {MouseEventHandler, useState} from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

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

	const [activePage, setActivePage] = useState<string>('game');
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const [discard, setDiscard] = useState<boolean>(false);

    const onMouseMove: MouseEventHandler = (ev) => {
        setMouseX(ev.clientX);
        setMouseY(ev.clientY);
        // console.log('x',ev.clientX);
        // console.log('y',ev.clientY);
    }

	const { isVisible, messageHeader, messageBody, setModal } = useGameStore((state) => {
		const { modal, setModal } = state;
		const { messageHeader, messageBody, isVisible } = modal;
		return { isVisible, messageHeader, messageBody, setModal };
	})

    const { isGlobalClickSuppressed, selection, discardSelection, } = useUiStore((state: uiStore) => {
        const { isGlobalClickSuppressed, selection, discardSelection, } = state;
        return { isGlobalClickSuppressed, selection, discardSelection, };
    });

	const onDismiss = () => setModal({
		messageHeader: '',
		messageBody: '',
		isVisible: false,
	})

    const onClick: MouseEventHandler = (ev) => {
        if (selection !== undefined && isGlobalClickSuppressed !== true) {
            discardSelection();
            setDiscard(true);
            setTimeout(() => {
                setDiscard(false);
            }, 500);
        }
    }

 	return (
		<div
            className="App"
            onClick={(ev) => onClick(ev)}
            onMouseMove={(ev) => onMouseMove(ev)}
        >
            <OverlayElementLayer
                x = {mouseX}
                y = {mouseY}
                discard = {discard}
            />
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
		</div>
  	);
}

export default App;
