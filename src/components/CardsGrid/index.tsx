import { useContext } from "react";
import EachCard from "../Card";
import { GameContext } from "../../contexts/GameContext";

const CardsGrid = () => {
	const { cards, difficulty } = useContext(GameContext)

  return <div>
    <div className={`grid 
    ${difficulty == "easy" ? "max-w-xl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4" : ""} 
    ${difficulty == "medium" ? "max-w-3xl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 md:grid-cols-8" : ""}
    ${difficulty == "hard" ? "max-w-4xlxl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 md:grid-cols-8" : ""} 
    gap-3 p-4 mx-auto border-4 border-black dark:border-zinc-50 border-solid rounded-lg`}>
      {
        cards.map(card => (
          <EachCard key={card.id} card={card} />
        ))
      }
    </div>
  </div>
}

export default CardsGrid;