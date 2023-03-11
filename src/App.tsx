import { useEffect, useState } from "react"
import { FaApple, FaFacebook, FaSnapchatGhost, FaTwitch, FaYoutube, FaBookmark, FaCheckCircle, FaGoogle, FaHtml5, FaJsSquare, FaLinkedin, FaOpera, FaSafari, FaStackOverflow, FaTelegram, FaWaze, FaXbox, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp, FaBurn, FaCat, FaCross, FaDollarSign, FaGlassMartiniAlt, FaPizzaSlice, FaPlane, FaRss, FaSkull, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { IconType } from "react-icons/lib"
import { VscDebugRestart } from "react-icons/vsc"
import { v4 as uuid } from "uuid"
import StartGameModal from "./StartGameModal"
import CardsGrid from "./CardsGrid"

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

export function shuffleCards(array: Card[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

function shuffleIcons(array: IconType[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

function formatTime(time: number | undefined) {
  if (time == undefined) return;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
}

const App = () => {
  const [cards, setCards] = useState<Card[]>(shuffleCards(createCards(8).slice(0, (8 * 2))))
  const [firstCard, setFirstCard] = useState<Card>()
  const [timeLeft, setTimeLeft] = useState<number>(300)
  const [startGame, setStartGame] = useState<boolean>(false)
  const [startTimer, setStartTimer] = useState<boolean>(false)
  const [itsAWin, setItsAWin] = useState<boolean | undefined>(undefined)
  const [playerHistory, setPlayerHistory] = useState<PlayerHistory>(new Map([
    ['easy', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 1 }],
    ['medium', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 2 }],
    ['hard', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 3 }]
  ]))
  const [difficulty, setDifficulty] = useState<string>('easy')

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
  }

  useEffect(() => {

    if (timeLeft == 0 && startTimer) {
      console.log('a')
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
    const win = cards.every((card) => card.visible == true && !card.active) && timeLeft > 0

    if (win) {
      clearInterval(timer)
      setItsAWin(true)
      setStartTimer(false)
      updateUserHistory(true)
      alert("Congratulations! You Won!")
    }

  }, [cards, timeLeft])

  useEffect(() => {
  }, [playerHistory])

  function backToHome() {
    setCards(shuffleCards(createCards(8).slice(0, (8 * 2))))
    setItsAWin(undefined)
    setStartGame(false)
    setStartTimer(false)
    setFirstCard(undefined)
    setTimeLeft(300)
    clearInterval(timer)
  }

  function restartGame() {
    if (difficulty == "easy") setCards(shuffleCards(createCards(8).slice(0, (8 * 2))))
    else if (difficulty == "medium") setCards(shuffleCards(createCards(16).slice(0, (16 * 2))))
    else if (difficulty == "hard") setCards(shuffleCards(createCards(32).slice(0, (32 * 2))))
    setFirstCard(undefined)
    setTimeLeft(300)
    setItsAWin(undefined)
    setStartTimer(true)
  }

  return <main className="p-4">
    <h1 className="text-center">Card Memory Game</h1>
    <div className="mt-4">
      {startGame
        ?
        <div>
          <CardsGrid cards={cards} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} difficulty={difficulty} />
          <div className={`${difficulty == "easy" ? "max-w-2xl" : difficulty == "medium" ? "max-w-3xl" : "max-w-4xl"} mx-auto pt-2 flex flex-col lg:flex-row items-center justify-between gap-4`}>
            <span className="inline-block w-[75px] text-center py-2 px-3 border-[1px] border-solid border-black">{formatTime(timeLeft)}</span>
            {!itsAWin
              ? <button title="Restart Game" className="bg-transparent border-none cursor-pointer" onClick={() => restartGame()}><VscDebugRestart className="w-7 h-7" /></button>
              : <button title="Play Again" className="bg-amber-500 text-base button" onClick={() => restartGame()}>Play Again</button>}
            <div className="flex flex-col 2xsm:flex-row justify-between gap-5 md:gap-7 py-2 px-3">
              <div><p className="font-bold pb-1">Difficulty</p><span className="inline-block uppercase">{difficulty}</span></div>
              <div><p className="font-bold pb-1">Best Time</p><span className="inline-block">{formatTime(playerHistory.get(difficulty)?.bestTime)}</span></div>
              <div><p className="font-bold pb-1">Last Time</p><span className="inline-block">{formatTime(playerHistory.get(difficulty)?.lastTime)}</span></div>
              <div><p className="font-bold pb-1">Won</p><span className="inline-block">{playerHistory.get(difficulty)?.won}</span></div>
              <div><p className="font-bold pb-1">Lost</p><span className="inline-block">{playerHistory.get(difficulty)?.lost}</span></div>
            </div>
            <button onClick={() => backToHome()} className="px-4 py-2 bg-emerald-600 text-white button">Back to Home</button>
          </div>
        </div>
        : <div className="flex flex-col gap-4">
          <StartGameModal setCards={setCards} setStartGame={setStartGame} setStartTimer={setStartTimer} setDifficulty={setDifficulty} />
          <div className="p-4 border-4 border-black border-solid rounded-lg">
            <h2 className="text-center">Player History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 pt-4">
              {
                [...playerHistory].map((value) => (
                  <div key={playerHistory.get(value[0])?.id} className="difficulty">
                    <h4 className="uppercase text-center">{value[0]}</h4>
                    <ul>
                      <li>Best Time: {formatTime(playerHistory.get(value[0])?.bestTime)}</li>
                      <li>Last Time: {formatTime(playerHistory.get(value[0])?.lastTime)}</li>
                      <li>Won: {playerHistory.get(value[0])?.won}</li>
                      <li>Lost: {playerHistory.get(value[0])?.lost}</li>
                    </ul>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      }
    </div>
  </main>
}

export default App
