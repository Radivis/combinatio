import {useState} from 'react';

import Game from './components/Game/Game';
import Settings from './components/Settings/Settings';

import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import useGameStore from './store/gameStore';
import ErrorModal from './components/ErrorModal/ErrorModal';

const App = () => {

	let [activePage, setActivePage] = useState<string>('game');

	const { isVisible, messageHeader, messageBody, setModal } = useGameStore((state) => {
		const { modal, setModal } = state;
		const { messageHeader, messageBody, isVisible } = modal;
		return { isVisible, messageHeader, messageBody, setModal };
	})

	const onDismiss = () => setModal({
		messageHeader: '',
		messageBody: '',
		isVisible: false,
	})

 	return (
		<div className="App">
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
					<Game />
				}
			</main>
		</div>
  	);
}

export default App;
