
import { useContext } from "react";
import StartGameModal from '../../StartGameModal';
import { HomeSkeleton } from "../../components/Skeletons";
import { GameContext } from "../../contexts/GameContext";

export const Home = () => {
	const { setDifficulty, playerHistory, actualUsername, formatTime, userLoaded } = useContext(GameContext)

  return (<>
    {userLoaded
      ? <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        <StartGameModal setDifficulty={setDifficulty} actualUsername={actualUsername} />
        <div className="dark:text-text-color p-4 border-4 border-black dark:border-zinc-50 border-solid rounded-lg">
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
      : <HomeSkeleton />
    }
  </>)
}