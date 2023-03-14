import { Card } from './App'

type CardProps = {
  card: Card
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  firstCard: Card | undefined
  setFirstCard: React.Dispatch<React.SetStateAction<Card | undefined>>
  itsAWin: boolean | undefined,
  timeLeft: number
}

const EachCard = ({ card, setCards, firstCard, setFirstCard, itsAWin, timeLeft }: CardProps) => {
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

        if (timeLeft > 1.5) {
          setTimeout(() => {
            setCards(prevCards => prevCards.map(eachCard => {
              if (eachCard.discoveredPair) return eachCard
              return { ...eachCard, visible: false, active: true, }
            }))

            setFirstCard(undefined)
          }, 1500)
        }
      }
    }
  }

  return <button className={`${card.active ? "" : "icon-inactive"} ${itsAWin === false ? "icon-has-lost" : ""} ${card.visible ? "" : "icon-button-inactive"} p-2 cursor-pointer border-none dark:bg-slate-700`} onClick={() => handleCardClick()}>
    {
      card.visible
        ? <card.icon className={`icon ${card.discoveredPair ? 'dark:!text-zinc-50' : ''}`} />
        : <div className={`icon`} />
    }
  </button>
}

export default EachCard