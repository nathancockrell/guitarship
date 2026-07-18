import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChordpacks } from '../hooks/useChordpacks.js'
import FlashcardScreen from '../components/FlashcardScreen'

function FlashcardsPage() {
  const { chordpacks, loading } = useChordpacks()
  const [selectedPack, setSelectedPack] = useState(null)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading chordpacks...</p>
      </div>
    )
  }

  if (selectedPack) {
    return (
      <FlashcardScreen
        chordpackId={selectedPack.id}
        chordpackName={selectedPack.name}
        onBack={() => setSelectedPack(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Choose a Chordpack</h1>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {chordpacks.length === 0 && (
          <p className="text-gray-500 text-sm text-center">No chordpacks yet.</p>
        )}

        {chordpacks.map((pack) => (
          <button
            key={pack.id}
            onClick={() => setSelectedPack(pack)}
            className="bg-purple-600 text-white rounded-md py-3 px-4 text-sm font-medium text-left"
          >
            <div>{pack.name}</div>
            {pack.description && (
              <div className="text-xs text-purple-200 mt-1">{pack.description}</div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
      >
        Back to Home
      </button>
    </div>
  )
}

export default FlashcardsPage