import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChordpacks, useChordsForPack } from '../hooks/useChordpacks'
import DotGrid from '../components/DotGrid'

function ChordLibraryPage() {
  const { chordpacks, loading: loadingPacks } = useChordpacks()
  const [selectedPack, setSelectedPack] = useState(null)
  const navigate = useNavigate()

  if (loadingPacks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading chordpacks...</p>
      </div>
    )
  }

  // Screen 1: choose a chordpack
  if (!selectedPack) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Chord Library</h1>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {chordpacks.length === 0 && (
            <p className="text-gray-500 text-sm text-center">No chordpacks yet.</p>
          )}

          {chordpacks.map((pack) => (
            <button
              key={pack.id}
              onClick={() => setSelectedPack(pack)}
              className="bg-indigo-600 text-white rounded-md py-3 px-4 text-sm font-medium text-left"
            >
              <div>{pack.name}</div>
              {pack.description && (
                <div className="text-xs text-indigo-200 mt-1">{pack.description}</div>
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

  // Screen 2: browse chords within the selected pack
  return <ChordPackBrowser pack={selectedPack} onBack={() => setSelectedPack(null)} />
}

function ChordPackBrowser({ pack, onBack }) {
  const { chords, loading } = useChordsForPack(pack.id)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold mt-6 mb-1 text-gray-800">{pack.name}</h1>
      <p className="text-sm text-gray-500 mb-6">{chords.length} chords</p>

      {loading ? (
        <p className="text-gray-500">Loading chords...</p>
      ) : chords.length === 0 ? (
        <p className="text-gray-500 text-sm">No chords in this pack yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {chords.map((chord) => (
            <div
              key={chord.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <p className="text-lg font-medium text-gray-800 mb-3">{chord.name}</p>
              <DotGrid
                dots={chord.voicing_data && chord.voicing_data.length > 0
                  ? chord.voicing_data
                  : Array(48).fill(false)}
                cellSize="w-6 h-6 sm:w-7 sm:h-7"
                readOnly
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-8 mb-4 px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
      >
        Back to Chordpacks
      </button>
    </div>
  )
}

export default ChordLibraryPage