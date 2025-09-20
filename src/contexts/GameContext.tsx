import { createContext, ReactNode, useCallback } from "react"
import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { firebaseConfig } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IconType } from "react-icons";

type PlayerHistory = Map<string, { bestTime: number, lastTime: number, won: number, lost: number, id: number }>

export interface Card {
  id: string
  visible: boolean
  active: boolean
  discoveredPair: boolean
  icon: IconType
}

interface GameContextType {
	setDifficulty: React.Dispatch<React.SetStateAction<'easy' | 'medium' | 'hard'>>
	actualUsername: string | undefined
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
  setActualUsername: React.Dispatch<React.SetStateAction<string>>
  setUserUid: React.Dispatch<React.SetStateAction<string | undefined>>
  setPlayerHistory: React.Dispatch<React.SetStateAction<PlayerHistory>>
  userUid: string | undefined
	timer: any
	formatTime: (time: number | undefined) => string | undefined
	userLoaded: boolean
	difficulty: 'easy' | 'medium' | 'hard'
	onSignOut: () => void
}

export const GameContext = createContext({} as GameContextType)

interface GameContextProviderProps {
	children: ReactNode
}

function updateDbPlayerHistory(uid: string | undefined, username: string | undefined, newPlayerHistory: PlayerHistory) {
  const db = getDatabase();

  const userData = {
    username: username,
    difficulties: [...new Map(newPlayerHistory)]
  };

  return update(ref(db, `/users/${uid}/`), userData)
}

export function GameContextProvider({ children }: GameContextProviderProps) {
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
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [actualUsername, setActualUsername] = useState<string>('')
  const [userUid, setUserUid] = useState<string>()

	let timer: any;

	// ------------------- firebase ------------------------
	const [userLoaded, setUserLoaded] = useState<boolean>(false)
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
          setUserLoaded(true)
        }, (error) => {
          
        });
      } else {
        navigate('/signin')
      }
    });
  }, [])

	function onSignOut() {
		setFirstCard(undefined)
    setTimeLeft(300)
    setItsAWin(undefined)
    setStartTimer(false)
		setUserLoaded(false)
		setCards([])
		clearInterval(timer)
		setActualUsername('')
	}
	// ------------------- firebase ------------------------


	const formatTime = useCallback(
		(time: number | undefined) => {
			if (time == undefined) return;
		
			const minutes = Math.floor(time / 60);
			const seconds = time % 60;
		
			return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
		}
		, [setTimeLeft, ]
	)
		
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

	return (
		<GameContext.Provider value={{
			setDifficulty: setDifficulty,
			playerHistory: playerHistory,
			actualUsername: actualUsername,
			setPlayerHistory: setPlayerHistory,
			setActualUsername: setActualUsername,
			setUserUid: setUserUid,
			cards: cards,
			setCards: setCards,
			setFirstCard: setFirstCard,
			firstCard: firstCard,
			itsAWin: itsAWin,
			setItsAWin: setItsAWin,
			timeLeft: timeLeft,
			setTimeLeft: setTimeLeft,
			setStartTimer: setStartTimer,
			userUid: userUid,
			timer: timer,
			formatTime: formatTime,
			userLoaded: userLoaded,
			difficulty: difficulty,
			onSignOut: onSignOut
		}}>
			{children}
		</GameContext.Provider>
	)
}