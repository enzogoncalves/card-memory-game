import { useEffect, useState } from "react"
import { FaApple, FaFacebook, FaSnapchatGhost, FaTwitch, FaYoutube, FaBookmark, FaCheckCircle, FaGoogle, FaHtml5, FaJsSquare, FaLinkedin, FaOpera, FaSafari, FaStackOverflow, FaTelegram, FaWaze, FaXbox, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp, FaBurn, FaCat, FaCross, FaDollarSign, FaGlassMartiniAlt, FaPizzaSlice, FaPlane, FaRss, FaSkull, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { IconType } from "react-icons/lib"
import { v4 as uuid } from "uuid"
import StartGameModal from "./StartGameModal"
import EachCard from "./Card"


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
    cards.push({ id: uuid(), visible: true, active: true, icon: icons[iconsCount], discoveredPair: false })
    cards.push({ id: uuid(), visible: true, active: true, icon: icons[iconsCount], discoveredPair: false })

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

const App = () => {
  const [cards, setCards] = useState<Card[]>(shuffleCards(createCards(8).slice(0, (8 * 2))))
  const [firstCard, setFirstCard] = useState<Card>()
  const [timeLeft, setTimeLeft] = useState<number>(60 * 5)
  const [startGame, setStartGame] = useState<boolean>(false)
  const [startTimer, setStartTimer] = useState<boolean>(false)
  const [itsAWin, setItsAWin] = useState<boolean | undefined>(undefined)
  const [playerHistory, setPlayerHistory] = useState<PlayerHistory>(new Map([
    ['easy', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 1 }],
    ['medium', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 2 }],
    ['hard', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 3 }]
  ]))
  const [difficulty, setDifficulty] = useState<string>('easy')
  const [windowWidth, setWindowWidth] = useState<number>(0)

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
        bestTime: bestTime,
        lastTime: 300 - timeLeft,
        won: gameWon ? Number(prevHistory.get(difficulty)?.won) + 1 : Number(prevHistory.get(difficulty)?.won),
        lost: gameWon ? Number(prevHistory.get(difficulty)?.lost) : Number(prevHistory.get(difficulty)?.lost) + 1,
        id: Number(prevHistory.get(difficulty)?.id)
      })

    setPlayerHistory(prevHistory)
    console.log(prevHistory)
  }

  useEffect(() => {
    if (timeLeft == 0) {
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
      console.log('ganhou')
      clearInterval(timer)
      setItsAWin(true)
      setStartTimer(false)
      updateUserHistory(true)
    }

  }, [cards, timeLeft])

  useEffect(() => {
    console.log('alterou 1')
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

  return <div className="p-4">
    <h1 className="text-center">Card Memory Game</h1>
    {startGame
      ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: "1rem" }}>
        {
          cards.map(card => (
            <EachCard key={card.id} card={card} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} />
          ))
        }
        <span>
          {timeLeft}
        </span>
        <button onClick={() => backToHome()}>Voltar para a página inicial</button>
      </div>
      : <StartGameModal setCards={setCards} setStartGame={setStartGame} setStartTimer={setStartTimer} setDifficulty={setDifficulty} />
    }
    <div className="p-4 mt-4 border-4 border-black border-solid rounded-lg">
      <h2 className="text-center">Player History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 pt-4">
        {
          [...playerHistory].map((value) => (
            <div key={playerHistory.get(value[0])?.id} className="difficulty">
              <h4 className="uppercase text-center">{value[0]}</h4>
              <ul>
                <li>Best Time: {playerHistory.get(value[0])?.bestTime}</li>
                <li>Last Time: {playerHistory.get(value[0])?.lastTime}</li>
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

export default App
