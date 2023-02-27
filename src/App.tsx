import { useEffect, useState } from "react"
import { FaApple, FaFacebook, FaSnapchatGhost, FaTwitch, FaYoutube, FaBookmark, FaCheckCircle, FaGoogle, FaHtml5, FaJsSquare, FaLinkedin, FaOpera, FaSafari, FaStackOverflow, FaTelegram, FaWaze, FaXbox, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp, FaBurn, FaCat, FaCross, FaDollarSign, FaGlassMartiniAlt, FaPizzaSlice, FaPlane, FaRss, FaSkull, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { GiCardJoker } from "react-icons/gi"
import { IconType } from "react-icons/lib"
import { v4 as uuid } from "uuid"

let icons = [FaApple, FaFacebook, FaSnapchatGhost, FaTwitch, FaYoutube, FaBookmark, FaCheckCircle, FaGoogle, FaHtml5, FaJsSquare, FaLinkedin, FaOpera, FaSafari, FaStackOverflow, FaTelegram, FaWaze, FaXbox, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp, FaBurn, FaCat, FaCross, FaDollarSign, FaGlassMartiniAlt, FaPizzaSlice, FaPlane, FaRss, FaSkull, FaThumbsUp, FaThumbsDown]

icons = shuffleIcons(icons)

type Card = {
  id: string
  visible: boolean
  active: boolean
  discoveredPair: boolean
  icon: IconType
}

type CardProps = {
  card: Card
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  firstCard: Card | undefined
  setFirstCard: React.Dispatch<React.SetStateAction<Card | undefined>>
  itsAWin: boolean | undefined
}

type PlayerHistory = {
  difficulties: {
    easy: {
      bestTime: number,
      lastTime: number,
      won: number,
      lost: number
    },
    medium: {
      bestTime: number,
      lastTime: number,
      won: number,
      lost: number
    },
    hard: {
      bestTime: number,
      lastTime: number,
      won: number,
      lost: number
    },
  }
}

type StartGameModalProps = {
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
  setStartGame: React.Dispatch<React.SetStateAction<boolean>>
  setStartTimer: React.Dispatch<React.SetStateAction<boolean>>
}


function createCards(numberOfPairs: number) {

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

function shuffleCards(array: Card[]) {
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
  const [gameDuration, setGameDuration] = useState<number>(5)
  const [startGame, setStartGame] = useState<boolean>(false)
  const [startTimer, setStartTimer] = useState<boolean>(false)
  const [itsAWin, setItsAWin] = useState<boolean | undefined>(undefined)
  const [playerHistory, setPlayerHistory] = useState<undefined | PlayerHistory>()

  let timer: any;

  function updateTimer() {
    timer = !timer && setInterval(() => {
      setGameDuration(prevValue => prevValue - 1)
    }, 1000)
  }

  useEffect(() => {
    if (gameDuration == 0) {
      clearInterval(timer)
      setStartTimer(false)
      setItsAWin(false)
      setCards(prevCards => prevCards.map(card => { return { ...card, visible: true, active: false } }))
    }

    if (startTimer) {
      updateTimer()
    }

    return () => clearInterval(timer)
  }, [startTimer, gameDuration])

  useEffect(() => {
    const win = cards.every((card) => card.visible == true && !card.active) && gameDuration > 0

    if (win) {
      clearInterval(timer)
      setItsAWin(true)
      setStartTimer(false)
    }
  }, [cards, gameDuration])

  return <>
    <h1>Card Memory Game</h1>
    {startGame
      ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: "1rem" }}>
        {
          cards.map(card => (
            <Card key={card.id} card={card} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} />
          ))
        }
        <span>
          {gameDuration}
        </span>
      </div>
      : <>
        <StartGameModal setCards={setCards} setStartGame={setStartGame} setStartTimer={setStartTimer} />
      </>
    }

  </>
}

const Card = ({ card, setCards, firstCard, setFirstCard, itsAWin }: CardProps) => {
  const handleCardClick = () => {
    if (!firstCard) {
      setFirstCard(card)
      setCards(prevCards => prevCards.map(eachCard => {
        if (card.id == eachCard.id) return { ...eachCard, visible: true, active: false }
        return eachCard
      }))
    } else {
      if (firstCard.icon == card.icon && firstCard.id != card.id) {
        setCards(prevCards => prevCards.map(eachCard => {
          if (card.id == eachCard.id || firstCard.id == eachCard.id) return { ...eachCard, visible: true, active: false, discoveredPair: true }
          return eachCard
        }))

        setFirstCard(undefined)
      }

      if (firstCard.icon != card.icon) {
        setCards(prevCards => prevCards.map(eachCard => {
          if (card.id == eachCard.id) return { ...eachCard, visible: true, active: false }
          return { ...eachCard, active: false }
        }))

        setTimeout(() => {
          setCards(prevCards => prevCards.map(eachCard => {
            if (eachCard.discoveredPair) return eachCard
            return { ...eachCard, visible: false, active: true, }
          }))

          setFirstCard(undefined)
        }, 1000)
      }
    }
  }

  return <button style={{ padding: ".5rem", cursor: "pointer" }} className={`${card.active ? "" : "icon-inactive"} ${itsAWin === false ? "icon-has-lost" : ""}`} onClick={() => handleCardClick()}>
    {
      card.visible
        ? <card.icon className='icon' />
        : <GiCardJoker className="icon" />
    }
  </button>
}

const StartGameModal = ({ setCards, setStartGame, setStartTimer }: StartGameModalProps) => {
  return <div>
    <h2>Select how hard you want to play</h2>
    <div>
      <button onClick={() => { setCards(shuffleCards(createCards(8).slice(0, (8 * 2)))); setStartGame(true); setStartTimer(true) }}>Easy</button>
      <ul>
        <li>Duration: 5 minutes</li>
        <li>Nº of Cards: 16</li>
      </ul>
    </div>
    <div>
      <button onClick={() => { setCards(shuffleCards(createCards(16).slice(0, (16 * 2)))); setStartGame(true); setStartTimer(true) }}>Medium</button>
      <ul>
        <li>Duration: 5 minutes</li>
        <li>Nº of Cards: 32</li>
      </ul>
    </div>
    <div>
      <button onClick={() => { setCards(shuffleCards(createCards(32).slice(0, (32 * 2)))); setStartGame(true); setStartTimer(true) }}>Hard</button>
      <ul>
        <li>Duration: 5 minutes</li>
        <li>Nº of Cards: 64</li>
      </ul>
    </div>
  </div>
}

export default App
