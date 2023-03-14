import { Card, createCards, formatTime } from './App'
import { NavLink, Params, useNavigate, useParams } from 'react-router-dom'
import { VscDebugRestart } from "react-icons/vsc"
import CardsGrid from './CardsGrid'
import { GameScreenProps } from './App'
import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDatabase, onValue, ref } from 'firebase/database'
import { firebaseConfig } from './firebaseConfig'
import { GameSkeleton } from './PageSkeletons'

function shuffleCards(array: Card[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

const GameScreen = ({ cards, setCards, setFirstCard, firstCard, itsAWin, setItsAWin, timeLeft, setTimeLeft, timer, setStartTimer, playerHistory, setPlayerHistory, setActualUsername, setUserUid, userUid }: GameScreenProps) => {
  const { difficulty }: Readonly<Params<string>> = useParams()
  const [startGame, setStartGame] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const app = initializeApp(firebaseConfig)

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserUid(uid)

        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();

          setActualUsername(data.username)
          setPlayerHistory(new Map(data.difficulties))
          setStartGame(true)
        });

      } else {
        navigate('/')
      }
    });
  }, [])

  useEffect(() => {
    setTimeLeft(60 * 5)

    if (difficulty == 'easy') {
      setCards(shuffleCards(createCards(8).slice(0, (8 * 2))));
      setStartTimer(true);
    } else if (difficulty == 'medium') {
      setCards(shuffleCards(createCards(16).slice(0, (16 * 2))));
      setStartTimer(true);
    } else if (difficulty == 'hard') {
      setCards(shuffleCards(createCards(32).slice(0, (32 * 2))));
      setStartTimer(true);
    }
  }, [])

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
          <CardsGrid cards={cards} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} difficulty={difficulty} timeLeft={timeLeft} />
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
            <NavLink to={'/home'} onClick={() => backToHome()} className="px-4 py-2 bg-emerald-600 text-white button no-underline">Back to Home</NavLink>
          </div>
        </div>
        : <GameSkeleton difficulty={difficulty} />
      }
    </>

  )
}

export default GameScreen