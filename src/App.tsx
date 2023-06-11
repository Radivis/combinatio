import React, {useState} from 'react';

import Game from './components/Game/Game';
import Settings from './components/Settings/Settings';

import './App.css';

const App = () => {

	let [activePage, setActivePage] = useState<string>('game');

 	return (
		<div className="App">
	  		<header className="App-header">
				Combinatio
				<nav>
					<button onClick={() => {setActivePage('settings')}}>Settings</button>
					<button onClick={() => {setActivePage('game')}}>Game</button>
				</nav>
	  		</header>
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
