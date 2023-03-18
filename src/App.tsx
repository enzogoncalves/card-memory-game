import { useEffect, useState } from "react"
import { Routes, Route } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import { FaApple, FaFacebook, FaSnapchatGhost, FaTwitch, FaYoutube, FaBookmark, FaCheckCircle, FaGoogle, FaHtml5, FaJsSquare, FaLinkedin, FaOpera, FaSafari, FaStackOverflow, FaTelegram, FaWaze, FaXbox, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp, FaBurn, FaCat, FaCross, FaDollarSign, FaGlassMartiniAlt, FaPizzaSlice, FaPlane, FaRss, FaSkull, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { IconType } from "react-icons/lib"
import { v4 as uuid } from "uuid"
import Home from "./Home"
import GameScreen from "./GameScreen"
import SignIn from "./SignIn"
import Register from "./Register"

const firebaseConfig = {
  apiKey: "AIzaSyBLRLJGQukECYQJHj7uD5tHMAPMTk81D-4",
  authDomain: "card-memory-game-38410.firebaseapp.com",
  databaseURL: "https://card-memory-game-38410-default-rtdb.firebaseio.com",
  projectId: "card-memory-game-38410",
  storageBucket: "card-memory-game-38410.appspot.com",
  messagingSenderId: "193486301764",
  appId: "1:193486301764:web:9dfc58577f03752511aa11",
  measurementId: "G-ZWW4XR6LWH"
};

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

  return <main className="p-4 min-h-full dark:bg-neutral-800">
    <h1 className="pb-5 text-center dark:text-text-color">Card Memory Game</h1>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home setDifficulty={setDifficulty} playerHistory={playerHistory} actualUsername={actualUsername} setPlayerHistory={setPlayerHistory} setActualUsername={setActualUsername} setUserUid={setUserUid} />} />
      <Route path="/:difficulty" element={<GameScreen cards={cards} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} setItsAWin={setItsAWin} timeLeft={timeLeft} setTimeLeft={setTimeLeft} timer={timer} setStartTimer={setStartTimer} playerHistory={playerHistory} setPlayerHistory={setPlayerHistory} setActualUsername={setActualUsername} setUserUid={setUserUid} userUid={userUid} />} />
    </Routes>
  </main>
}

export default App
