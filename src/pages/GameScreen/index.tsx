import { useContext, useEffect, useState } from 'react'
import { IconType } from 'react-icons/lib'
import { VscDebugRestart } from "react-icons/vsc"
import { NavLink, Params, useParams } from 'react-router-dom'
import { v4 as uuid } from "uuid"
import CardsGrid from '../../components/CardsGrid'
import { GameSkeleton } from '../../components/Skeletons'
import { Card, GameContext } from '../../contexts/GameContext'
import { react_icons } from "../../lib/icons"


function shuffleIcons(array: IconType[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

const icons = shuffleIcons(react_icons)

function shuffleCards(array: Card[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
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

const GameScreen = () => {
	const { cards, setCards, setFirstCard, firstCard, itsAWin, setItsAWin, timeLeft, setTimeLeft, timer, setStartTimer, playerHistory, formatTime, userLoaded }
 = useContext(GameContext)
  const { difficulty }: Readonly<Params<string>> = useParams()
  const [startGame, setStartGame] = useState<boolean>(false)

	useEffect(() => {
		if(userLoaded) setStartGame(true)
	}, [userLoaded])

  useEffect(() => {
		if(!startGame) return;

    setTimeLeft(60 * 5)

    if (difficulty == 'easy') {
      setCards(shuffleCards(createCards(8).slice(0, (8 * 2))));
    } else if (difficulty == 'medium') {
      setCards(shuffleCards(createCards(16).slice(0, (16 * 2))));
    } else if (difficulty == 'hard') {
      setCards(shuffleCards(createCards(32).slice(0, (32 * 2))));
    }
		
		setStartTimer(true);
  }, [startGame])

  function backToHome() {
    setCards([])
    setItsAWin(undefined)
    setStartTimer(false)
    setFirstCard(undefined)
    clearInterval(timer)
    setStartGame(false)
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

  return (
    <>
      {startGame
        ? <div className='py-4'>
          <CardsGrid />
          <div className={`${difficulty == "easy" ? "max-w-3xl" : difficulty == "medium" ? "max-w-3xl" : "max-w-4xl"} mx-auto pt-2 flex flex-col lg:flex-row items-center justify-between gap-4 dark:text-text-color`}>
            <span className="inline-block w-[75px] text-center py-2 px-3 border-[1px] border-solid border-black dark:border-zinc-50">{formatTime(timeLeft)}</span>
            {!itsAWin
              ? <button title="Restart Game" className="bg-transparent border-none cursor-pointer text-black dark:text-zinc-50" onClick={() => restartGame()}><VscDebugRestart className="w-7 h-7" /></button>
              : <button title="Play Again" className="text-text-color bg-amber-600 hover:bg-amber-700 text-base button" onClick={() => restartGame()}>Play Again</button>
            }
            <div className="flex flex-col 2xsm:flex-row justify-between gap-5 md:gap-7 py-2 px-3">
              <div>
                <p className="font-bold pb-1">Difficulty</p>
                <span className="inline-block uppercase">{difficulty}</span>
              </div>
              <div>
                <p className="font-bold pb-1">Best Time</p>
                <span className="inline-block">{formatTime(playerHistory.get(String(difficulty))?.bestTime)}</span>
              </div>
              <div>
                <p className="font-bold pb-1">Last Time</p>
                <span className="inline-block">{formatTime(playerHistory.get(String(difficulty))?.lastTime)}</span>
              </div>
              <div>
                <p className="font-bold pb-1">Won</p>
                <span className="inline-block">{playerHistory.get(String(difficulty))?.won}</span>
              </div>
              <div>
                <p className="font-bold pb-1">Lost</p>
                <span className="inline-block">{playerHistory.get(String(difficulty))?.lost}</span>
              </div>
            </div>
            <NavLink to={'/'} onClick={() => backToHome()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white button no-underline">Back to Home</NavLink>
          </div>
        </div>
        : <GameSkeleton difficulty={difficulty} />
      }
    </>

  )
}

export default GameScreen