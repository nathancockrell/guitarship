import { useState } from 'react'

const ROWS = 8
const COLS = 6

function shuffle(array) {
  const result = [...array]
  let currentIndex = result.length

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]]
  }

  return result
}

function FlashcardScreen({ profiles, onBack }) {
  const profileNames = Object.keys(profiles)

  // Lazy initializer: shuffle() only runs once, on the first render
  const [shuffledProfiles] = useState(() => shuffle(profileNames))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  if (profileNames.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">No profiles to show.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
        >
          Back
        </button>
      </div>
    )
  }

  const currentName = shuffledProfiles[index]
  const currentDots = profiles[currentName] || []

  const handleTap = () => {
    if (!revealed) {
      setRevealed(true)
    } else {
      setIndex((prev) => (prev + 1) % shuffledProfiles.length)
      setRevealed(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-6 text-gray-800">Flashcards</h1>

      <div
        onClick={handleTap}
        className="relative w-72 sm:w-80 aspect-[3/4] bg-white rounded-xl shadow-md border-2 border-gray-300 flex items-center justify-center cursor-pointer select-none"
      >
        <div
          className="grid gap-1 p-4"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {currentDots.map((isFilled, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-sm border border-gray-300 ${
                isFilled ? 'bg-blue-500 border-blue-500' : 'bg-white'
              }`}
            />
          ))}
        </div>

        {revealed && (
          <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
            <p className="text-white text-2xl font-semibold">{currentName}</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {revealed ? 'Tap again for next profile' : 'Tap to reveal name'}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {index + 1} / {shuffledProfiles.length}
      </p>

      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
      >
        Back to Grid
      </button>
    </div>
  )
}

export default FlashcardScreen