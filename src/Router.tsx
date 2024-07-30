import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import { Home } from "./pages/Home";
import GameScreen from "./pages/GameScreen";
import { DefaultLayout } from "./layouts/DefaultLayout";

export function Router() {
	return (
		<Routes>
			<Route path="/" element={<DefaultLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/register" element={<Register />} />
				<Route path="/game/:difficulty" element={<GameScreen />} />
			</Route>
    </Routes>
	)
}