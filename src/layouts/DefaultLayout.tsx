import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function DefaultLayout() {
	return (
		<main className="p-4 min-h-full dark:bg-neutral-800">
			<Header />
			<Outlet />
  	</main>
	)
}