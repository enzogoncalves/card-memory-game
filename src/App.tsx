import { BrowserRouter } from 'react-router-dom';
import { GameContextProvider } from "./contexts/GameContext";
import { Router } from "./Router";

function App() {
  return (
		<BrowserRouter>
			<GameContextProvider>
				<Router />
			</GameContextProvider>
		</BrowserRouter>
	)
}

export default App
