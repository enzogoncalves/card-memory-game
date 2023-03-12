import { Params } from "react-router-dom"

const HomeSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse mt-4">
      <div className="p-4 border-4 border-black border-solid rounded-lg">
        <div className="h-8 w-96 max-w-full mx-auto bg-slate-600"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 pt-4">
          {
            [1, 2, 3].map((value, index) => (
              <div className="difficulty" key={index}>
                <div className="h-12 w-full max-w-full bg-slate-600"></div>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="h-4 w-24 max-w-full bg-slate-600"></div>
                  <div className="h-4 w-24 max-w-full bg-slate-600"></div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="p-4 border-4 border-black border-solid rounded-lg">
        <div className="h-8 w-72 max-w-full mx-auto bg-slate-600"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 pt-4">
          {
            [1, 2, 3].map((value, index) => (
              <div className="difficulty" key={index}>
                <div className="h-6 w-32 max-w-full mx-auto bg-slate-600"></div>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="h-4 w-40 max-w-full bg-slate-600"></div>
                  <div className="h-4 w-40 max-w-full bg-slate-600"></div>
                  <div className="h-4 w-24 max-w-full bg-slate-600"></div>
                  <div className="h-4 w-24 max-w-full bg-slate-600"></div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const GameSkeleton = ({ difficulty }: Readonly<Params<string>>) => {
  const numberOfCards = [];

  if (difficulty == "easy") {
    for (let i = 1; i <= 16; i++) {
      numberOfCards.push(i)
    }
  } else if (difficulty == "medium") {
    for (let i = 1; i <= 32; i++) {
      numberOfCards.push(i)
    }
  } else if (difficulty == "hard") {
    for (let i = 1; i <= 64; i++) {
      numberOfCards.push(i)
    }
  }

  return (
    <div className='mt-4 animate-pulse'>
      <div>
        <div className={`grid 
        ${difficulty == "easy" ? "max-w-xl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4" : ""} 
        ${difficulty == "medium" ? "max-w-3xl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 md:grid-cols-8" : ""}
        ${difficulty == "hard" ? "max-w-4xlxl grid-cols-2 2xsm:grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 md:grid-cols-8" : ""} 
        gap-2 p-4 mx-auto border-4 border-black border-solid rounded-lg`}>
          {
            numberOfCards.map((value) => (
              <div key={value} className="w-full h-16 sm:h-[72px] bg-slate-600"></div>
            ))
          }
        </div>
      </div>
      <div className={`${difficulty == "easy" ? "max-w-3xl" : difficulty == "medium" ? "max-w-3xl" : "max-w-4xl"} mx-auto pt-2 flex flex-col lg:flex-row items-center justify-between gap-4`}>
        <div className="inline-block w-[75px] py-2 px-3 border-[1px] border-solid border-black">
          <div className="h-4 w-full bg-slate-600"></div>
        </div>
        <div className="w-6 h-6 bg-slate-600"></div>
        <div className="flex flex-col sm:flex-row justify-between gap-5 md:gap-7 py-2 px-3">
          {
            [1, 2, 3, 4, 5].map((value, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <div className="w-20 h-4 bg-slate-900"></div>
                <div className="w-14 h-4 bg-slate-600"></div>
              </div>
            ))
          }
        </div>
        <div className="h-8 w-32 bg-slate-600"></div>
      </div>
    </div>
  )
}

export { HomeSkeleton, GameSkeleton }