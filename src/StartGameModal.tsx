import { Card, createCards, shuffleCards } from "./App"

type StartGameModalProps = {
  setCards: React.Dispatch<React.SetStateAction<Card[]>>
  setStartGame: React.Dispatch<React.SetStateAction<boolean>>
  setStartTimer: React.Dispatch<React.SetStateAction<boolean>>
  setDifficulty: React.Dispatch<React.SetStateAction<string>>
}

const StartGameModal = ({ setCards, setStartGame, setStartTimer, setDifficulty }: StartGameModalProps) => {
  return <div className="p-4 mt-4 border-4 border-black border-solid rounded-lg">
    <h2 className="text-center">Select how hard you want to play</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 pt-4">
      <div className="difficulty">
        <button className="bg-green-600 button" onClick={() => { setCards(shuffleCards(createCards(8).slice(0, (8 * 2)))); setStartGame(true); setStartTimer(true); setDifficulty('easy') }}>Easy</button>
        <ul>
          <li>5 Minutes</li>
          <li>16 Cards</li>
        </ul>
      </div>
      <div className="difficulty">
        <button className="bg-blue-600 button" onClick={() => { setCards(shuffleCards(createCards(16).slice(0, (16 * 2)))); setStartGame(true); setStartTimer(true); setDifficulty('medium') }}>Medium</button>
        <ul>
          <li>5 Minutes</li>
          <li>32 Cards</li>
        </ul>
      </div>
      <div className="difficulty">
        <button className="bg-red-600 button" onClick={() => { setCards(shuffleCards(createCards(32).slice(0, (32 * 2)))); setStartGame(true); setStartTimer(true); setDifficulty('hard') }}>Hard</button>
        <ul>
          <li>5 Minutes</li>
          <li>64 Cards</li>
        </ul>
      </div>
    </div>
  </div>
}

export default StartGameModal
