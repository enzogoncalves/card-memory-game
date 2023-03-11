import { Card } from "./App";
import EachCard from "./Card";


type CardsGridProps = {
  cards: Card[]
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  firstCard: Card | undefined
  setFirstCard: React.Dispatch<React.SetStateAction<Card | undefined>>
  itsAWin: boolean | undefined,
  difficulty: string | undefined
}

const CardsGrid = ({ cards, setCards, setFirstCard, firstCard, itsAWin, difficulty }: CardsGridProps) => {
  return <div>
    <div className={`grid 
    ${difficulty == "easy" ? "max-w-xl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4" : ""} 
    ${difficulty == "medium" ? "max-w-3xl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 md:grid-cols-8" : ""}
    ${difficulty == "hard" ? "max-w-4xlxl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 md:grid-cols-8" : ""} 
    gap-2 p-4 mx-auto border-4 border-black border-solid rounded-lg`}>
      {
        cards.map(card => (
          <EachCard key={card.id} card={card} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} />
        ))
      }
    </div>
  </div>
}

export default CardsGrid;