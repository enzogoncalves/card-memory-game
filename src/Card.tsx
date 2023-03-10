import { GiCardJoker } from "react-icons/gi"
import { Card } from './App'

type CardProps = {
  card: Card
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  firstCard: Card | undefined
  setFirstCard: React.Dispatch<React.SetStateAction<Card | undefined>>
  itsAWin: boolean | undefined
}

const EachCard = ({ card, setCards, firstCard, setFirstCard, itsAWin }: CardProps) => {
  const handleCardClick = () => {
    if (!firstCard) {
      setFirstCard(card)
      setCards(prevCards => prevCards.map(eachCard => {
        if (card.id == eachCard.id) return { ...eachCard, visible: true, active: false }
        return eachCard
      }))
    } else {
      if (firstCard.icon == card.icon && firstCard.id != card.id) {
        setCards(prevCards => prevCards.map(eachCard => {
          if (card.id == eachCard.id || firstCard.id == eachCard.id) return { ...eachCard, visible: true, active: false, discoveredPair: true }
          return eachCard
        }))

        setFirstCard(undefined)
      }

      if (firstCard.icon != card.icon) {
        setCards(prevCards => prevCards.map(eachCard => {
          if (card.id == eachCard.id) return { ...eachCard, visible: true, active: false }
          return { ...eachCard, active: false }
        }))

        setTimeout(() => {
          setCards(prevCards => prevCards.map(eachCard => {
            if (eachCard.discoveredPair) return eachCard
            return { ...eachCard, visible: false, active: true, }
          }))

          setFirstCard(undefined)
        }, 1000)
      }
    }
  }

  return <button style={{ padding: ".5rem", cursor: "pointer" }} className={`${card.active ? "" : "icon-inactive"} ${itsAWin === false ? "icon-has-lost" : ""}`} onClick={() => handleCardClick()}>
    {
      card.visible
        ? <card.icon className='icon' />
        : <GiCardJoker className="icon" />
    }
  </button>
}

export default EachCard