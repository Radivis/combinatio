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
            setSelection(undefined);
        }
        console.log(ev.clientX);
        console.log(ev.clientY);
    }

 	return (
		<div className="App" onClick={(ev) => onClick(ev)}>
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
