import React, {useState} from 'react';

import Game from './components/Game/Game';
import Settings from './components/Settings/Settings';

import './App.css';
import AppHeader from './components/AppHeader/AppHeader';

const App = () => {

	let [activePage, setActivePage] = useState<string>('game');

 	return (
		<div className="App">
			<AppHeader 
				setActivePage={setActivePage}
			/>
			<main>
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
