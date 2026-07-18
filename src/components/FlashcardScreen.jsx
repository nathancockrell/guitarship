import { useState, useEffect } from 'react'
import { useChordsForPack } from '../hooks/useChordpacks'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

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

function FlashcardScreen({ chordpackId, chordpackName, onBack }) {
  const { chords, loading } = useChordsForPack(chordpackId)
  const { user } = useAuth()

  const [shuffledChords, setShuffledChords] = useState([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  // Shuffle once, but only after chords have actually loaded
  useEffect(() => {
    if (chords.length > 0) {
      setShuffledChords(shuffle(chords))
    }
  }, [chords])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading chords...</p>
      </div>
    )
  }

  if (chords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">No chords in this pack yet.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
        >
          Back
        </button>
      </div>
    )
  }

  const currentChord = shuffledChords[index]

  const logReview = async (chordId) => {
    await supabase.from('review_logs').insert({
      user_id: user.id,
      chord_id: chordId,
    })
  }

  const handleTap = () => {
    if (!revealed) {
      setRevealed(true)
      logReview(currentChord.id) // log the review the moment the name is revealed
    } else {
      setIndex((prev) => (prev + 1) % shuffledChords.length)
      setRevealed(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-2 text-gray-800">Flashcards</h1>
      <p className="text-sm text-gray-500 mb-6">{chordpackName}</p>

      <div
        onClick={handleTap}
        className="relative w-72 sm:w-80 aspect-[3/4] bg-white rounded-xl shadow-md border-2 border-gray-300 flex items-center justify-center cursor-pointer select-none"
      >
        <p className="text-gray-400 text-sm">
          {revealed ? '' : 'Tap to reveal'}
        </p>

        {revealed && (
          <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
            <p className="text-white text-2xl font-semibold">{currentChord.name}</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {revealed ? 'Tap again for next chord' : 'Tap to reveal name'}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {index + 1} / {shuffledChords.length}
      </p>

      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
      >
        Back to Chordpacks
      </button>
    </div>
  )
}

export default FlashcardScreen