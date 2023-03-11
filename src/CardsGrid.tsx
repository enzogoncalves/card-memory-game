import { Card } from "./App";
import EachCard from "./Card";


type CardsGridProps = {
    cards: Card[]
    setCards: React.Dispatch<React.SetStateAction<Card[]>>,
    firstCard: Card | undefined
    setFirstCard: React.Dispatch<React.SetStateAction<Card | undefined>>
    itsAWin: boolean | undefined,
    playerHistory: { bestTime: number, lastTime: number, won: number, lost: number, id: number } | undefined,
    difficulty: string
  }

const CardsGrid = ({ cards, setCards, setFirstCard, firstCard, itsAWin, playerHistory, difficulty }: CardsGridProps) => {
    return <div>
        <div className="flex flex-wrap gap-2 p-4 border-4 border-black border-solid rounded-lg">
        {
          cards.map(card => (
            <EachCard key={card.id} card={card} setCards={setCards} setFirstCard={setFirstCard} firstCard={firstCard} itsAWin={itsAWin} />
          ))
        }
        </div>
        <div>
            {difficulty}{playerHistory?.bestTime}{playerHistory?.lastTime}{playerHistory?.won}{playerHistory?.lost}
        </div>
    </div>
}

export default CardsGrid;