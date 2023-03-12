import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime, HomeProps } from './App'
import StartGameModal from './StartGameModal'
import { firebaseConfig } from './firebaseConfig'
import { HomeSkeleton } from "./PageSkeletons";

const Home = ({ setDifficulty, playerHistory, setPlayerHistory, actualUsername, setActualUsername, setUserUid }: HomeProps) => {
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
        });

      } else {
        navigate('/')
      }
    });
  }, [])

  return (<>
    {userLoaded
      ? <div className="flex flex-col gap-4">
        <StartGameModal setDifficulty={setDifficulty} actualUsername={actualUsername} />
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
      : <HomeSkeleton />
    }
  </>)
}

export default Home