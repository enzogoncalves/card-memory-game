import { NavLink } from "react-router-dom"

type StartGameModalProps = {
  setDifficulty: React.Dispatch<React.SetStateAction<string>>
  actualUsername: string | undefined
}

const StartGameModal = ({ setDifficulty, actualUsername }: StartGameModalProps) => {
  return <div className="p-4 mt-4 border-4 border-black dark:border-zinc-50 border-solid rounded-lg dark:text-text-color">
    <h2 className="text-center">{actualUsername}, select how hard you want to play</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 pt-4">
      <div className="difficulty">
        <NavLink to={'/easy'} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 button link" onClick={() => { setDifficulty('easy') }}>Easy</NavLink>
        <ul>
          <li>5 Minutes</li>
          <li>16 Cards</li>
        </ul>
      </div>
      <div className="difficulty">
        <NavLink to={'/medium'} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 button link" onClick={() => { setDifficulty('medium') }}>Medium</NavLink>
        <ul>
          <li>5 Minutes</li>
          <li>32 Cards</li>
        </ul>
      </div>
      <div className="difficulty">
        <NavLink to={'/hard'} className="bg-red-700 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 button link" onClick={() => { setDifficulty('hard') }}>Hard</NavLink>
        <ul>
          <li>5 Minutes</li>
          <li>64 Cards</li>
        </ul>
      </div>
    </div>
  </div>
}

export default StartGameModal
