import { getAuth, signOut } from "firebase/auth";
import { useContext, useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import { GameContext } from '../../contexts/GameContext';


export function Header() {
	const { onSignOut } = useContext(GameContext)
	const navigate = useNavigate()

	const [theme, setTheme] = useState<string>(
		localStorage.getItem("theme") === "dark" ? "dark" : "light"
  )

	function logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
			onSignOut()
			navigate('/signin')
    }).catch((error) => {
      alert("Não foi posível te desconectar. Tente novamente.")
    });
  }

	useEffect(() => {
    const root = window.document.documentElement;

    const removeOldTheme = theme === "dark" ? "light" : "dark"

    root.classList.remove(removeOldTheme)
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

	return (
		<div className={`pb-5 grid grid-cols-header-default xsm:grid-cols-header md:grid-cols-header-md items-center gap-x-8 gap-y-4`}>
      {window.location.pathname !== '/signin' && window.location.pathname !== '/register'
        ? <a href="#" onClick={() => logOut()} className="no-underline hover:underline text-black dark:text-text-color text-lg flex items-center gap-2 row-start-2 xsm:row-start-1"><FiLogOut /><span className="inline xsm:hidden md:inline">Sair da Conta</span></a>
        : <></>
      }
      <h1 className="text-xl sm:text-3xl xsm:justify-self-center col-start-1 xsm:col-start-2 dark:text-text-color">Memory Card Game</h1>
      <Switch
        onChange={() => setTheme(prevTheme => prevTheme == "dark" ? "light" : "dark")}
        checked={theme == "dark"}
        checkedIcon={false}
        uncheckedIcon={false}
        height={20}
        width={60}
        handleDiameter={25}
        onHandleColor={"#c0c2cc"}
        onColor={"#525252"}
        offHandleColor={"#525252"}
        offColor={"#c0c2cc"}
        className="justify-self-end xsm:col-start-3 row-span-2 self-center xsm:row-span-1"
      />
    </div>
	)
}