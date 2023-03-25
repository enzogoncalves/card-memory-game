import { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { FaApple, FaFacebook, FaSnapchatGhost, FaTwitch, FaYoutube, FaBookmark, FaCheckCircle, FaGoogle, FaHtml5, FaJsSquare, FaLinkedin, FaOpera, FaSafari, FaStackOverflow, FaTelegram, FaWaze, FaXbox, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp, FaBurn, FaCat, FaCross, FaDollarSign, FaGlassMartiniAlt, FaPizzaSlice, FaPlane, FaRss, FaSkull, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { IconType } from "react-icons/lib"
import { FiLogOut } from 'react-icons/fi'
import { v4 as uuid } from "uuid"
import Home from "./Home"
import GameScreen from "./GameScreen"
import SignIn from "./SignIn"
import Register from "./Register"
import Switch from 'react-switch'
import { firebaseConfig } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);

let icons = [FaApple, FaFacebook, FaSnapchatGhost, FaTwitch, FaYoutube, FaBookmark, FaCheckCircle, FaGoogle, FaHtml5, FaJsSquare, FaLinkedin, FaOpera, FaSafari, FaStackOverflow, FaTelegram, FaWaze, FaXbox, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp, FaBurn, FaCat, FaCross, FaDollarSign, FaGlassMartiniAlt, FaPizzaSlice, FaPlane, FaRss, FaSkull, FaThumbsUp, FaThumbsDown]

icons = shuffleIcons(icons)

export type Card = {
  id: string
  visible: boolean
  active: boolean
  discoveredPair: boolean
  icon: IconType
}

export type PlayerHistory = Map<string, { bestTime: number, lastTime: number, won: number, lost: number, id: number }>

export type HomeProps = {
  setDifficulty: React.Dispatch<React.SetStateAction<string>>
  playerHistory: PlayerHistory
  actualUsername: string | undefined
  setPlayerHistory: React.Dispatch<React.SetStateAction<PlayerHistory>>
  setActualUsername: React.Dispatch<React.SetStateAction<string | undefined>>
  setUserUid: React.Dispatch<React.SetStateAction<string | undefined>>
}

export type GameScreenProps = {
  cards: Card[]
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
  setStartTimer: React.Dispatch<React.SetStateAction<boolean>>
  playerHistory: PlayerHistory
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
  firstCard: Card | undefined
  itsAWin: boolean | undefined
  setItsAWin: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setFirstCard: React.Dispatch<React.SetStateAction<Card | undefined>>
  timeLeft: number
  timer: any
  setActualUsername: React.Dispatch<React.SetStateAction<string | undefined>>
  setUserUid: React.Dispatch<React.SetStateAction<string | undefined>>
  setPlayerHistory: React.Dispatch<React.SetStateAction<PlayerHistory>>
  userUid: string | undefined
}


export function createCards(numberOfPairs: number) {

  let numberOfPairsLeft = numberOfPairs;

  let cards: Card[] = [];
  let iconsCount = 0;

  while (numberOfPairsLeft > 0) {
    cards.push({ id: uuid(), visible: false, active: true, icon: icons[iconsCount], discoveredPair: false })
    cards.push({ id: uuid(), visible: false, active: true, icon: icons[iconsCount], discoveredPair: false })

    iconsCount++
    numberOfPairsLeft--
  }

  return cards;
}

function shuffleIcons(array: IconType[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

export function formatTime(time: number | undefined) {
  if (time == undefined) return;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
}

function updateDbPlayerHistory(uid: string | undefined, username: string | undefined, newPlayerHistory: PlayerHistory) {
  const db = getDatabase();

  const userData = {
    username: username,
    difficulties: [...new Map(newPlayerHistory)]
  };

  return update(ref(db, `/users/${uid}/`), userData)
}

const App = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [firstCard, setFirstCard] = useState<Card>()
  const [timeLeft, setTimeLeft] = useState<number>(300)
  const [startTimer, setStartTimer] = useState<boolean>(false)
  const [itsAWin, setItsAWin] = useState<boolean | undefined>(undefined)
  const [playerHistory, setPlayerHistory] = useState<PlayerHistory>(new Map([
    ['easy', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 1 }],
    ['medium', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 2 }],
    ['hard', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 3 }]
  ]))
  const [difficulty, setDifficulty] = useState<string>('easy')
  const [actualUsername, setActualUsername] = useState<string>()
  const [userUid, setUserUid] = useState<string>()
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  )


  const navigate = useNavigate()

  let timer: any;

  function updateTimer() {
    timer = !timer && setInterval(() => {
      setTimeLeft(prevValue => prevValue - 1)
    }, 1000)
  }

  function updateUserHistory(gameWon: boolean) {
    const prevHistory = playerHistory;
    let bestTime = 0;

    if (Number(prevHistory.get(difficulty)?.bestTime) == 0) bestTime = 300 - timeLeft;
    else if (Number(prevHistory.get(difficulty)?.bestTime) < 300 - timeLeft) bestTime = Number(prevHistory.get(difficulty)?.bestTime)
    else bestTime = 300 - timeLeft

    prevHistory.set(difficulty,
      {
        bestTime: gameWon ? bestTime : Number(prevHistory.get(difficulty)?.bestTime),
        lastTime: gameWon ? 300 - timeLeft : Number(prevHistory.get(difficulty)?.lastTime),
        won: gameWon ? Number(prevHistory.get(difficulty)?.won) + 1 : Number(prevHistory.get(difficulty)?.won),
        lost: gameWon ? Number(prevHistory.get(difficulty)?.lost) : Number(prevHistory.get(difficulty)?.lost) + 1,
        id: Number(prevHistory.get(difficulty)?.id)
      })

    setPlayerHistory(prevHistory)
    updateDbPlayerHistory(userUid, actualUsername, prevHistory)
  }

  useEffect(() => {
    const root = window.document.documentElement;

    const removeOldTheme = theme === "dark" ? "light" : "dark"

    root.classList.remove(removeOldTheme)
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (timeLeft == 0 && startTimer) {
      clearInterval(timer)
      setStartTimer(false)
      setItsAWin(false)
      setCards(prevCards => prevCards.map(card => { return { ...card, visible: true, active: false } }))
      updateUserHistory(false)
    }

    if (startTimer) {
      updateTimer()
    }

    return () => clearInterval(timer)
  }, [startTimer, timeLeft])

  useEffect(() => {
    if (cards.length == 0) return;

    const win = cards.every((card) => card.visible == true && !card.active) && timeLeft > 0

    if (win) {
      clearInterval(timer)
      setItsAWin(true)
      setStartTimer(false)
      updateUserHistory(true)
      alert("Congratulations! You Won!")
    }

  }, [cards, timeLeft])


  function logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate('/')
    }).catch((error) => {
      alert("Não foi posível te desconectar. Tente novamente.")
    });
  }

  console.log(import.meta.env)

  return <main className="p-4 min-h-full dark:bg-neutral-800">
    <div className={`pb-5 grid grid-cols-header-default xsm:grid-cols-header md:grid-cols-header-md items-center gap-x-8 gap-y-4`}>
      {window.location.pathname !== '/' && window.location.pathname !== '/register'
        ? <a href="#" onClick={() => logOut()} className="no-underline hover:underline text-black dark:text-text-color text-lg flex items-center gap-2 row-start-2 xsm:row-start-1"><FiLogOut /><span className="inline xsm:hidden md:inline">Sair da Conta</span></a>
        : <></>
      }
      <h1 className="text-xl sm:text-3xl xsm:justify-self-center col-start-1 xsm:col-start-2 dark:text-text-color">Card Memory Game</h1>
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
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home setDifficulty={setDifficulty} playerHistory={playerHistory} actualUsername={actualUsername} setPlayerHistory={setPlayerHistory} setActualUsername={setActualUsername} setUserUid={setUserUid} />} />
      <Route path="/:difficulty" element={<GameScreen cards={cards} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} setItsAWin={setItsAWin} timeLeft={timeLeft} setTimeLeft={setTimeLeft} timer={timer} setStartTimer={setStartTimer} playerHistory={playerHistory} setPlayerHistory={setPlayerHistory} setActualUsername={setActualUsername} setUserUid={setUserUid} userUid={userUid} />} />
    </Routes>
  </main>
}

export default App
