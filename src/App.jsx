import { useState, useEffect } from 'react'
import FlashcardScreen from './FlashcardScreen'
import './index.css'

const ROWS = 8
const COLS = 6
const TOTAL_CELLS = ROWS * COLS
const STORAGE_KEY = 'dotGridProfiles'

function App() {
  const [screen, setScreen] = useState('grid') // 'grid' or 'flashcards'
  const [profiles, setProfiles] = useState({})
  const [currentProfile, setCurrentProfile] = useState('')
  const [newProfileName, setNewProfileName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setProfiles(parsed)
      const names = Object.keys(parsed)
      if (names.length > 0) setCurrentProfile(names[0])
    } else {
      const defaultProfiles = { Default: Array(TOTAL_CELLS).fill(false) }
      setProfiles(defaultProfiles)
      setCurrentProfile('Default')
    }
  }, [])

  useEffect(() => {
    if (Object.keys(profiles).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    }
  }, [profiles])

  const dots = profiles[currentProfile] || Array(TOTAL_CELLS).fill(false)

  const toggleDot = (index) => {
    setProfiles((prev) => {
      const updatedDots = [...(prev[currentProfile] || Array(TOTAL_CELLS).fill(false))]
      updatedDots[index] = !updatedDots[index]
      return { ...prev, [currentProfile]: updatedDots }
    })
  }

  const clearGrid = () => {
    setProfiles((prev) => ({
      ...prev,
      [currentProfile]: Array(TOTAL_CELLS).fill(false),
    }))
  }

  const createProfile = () => {
    const name = newProfileName.trim()
    if (!name || profiles[name]) return
    setProfiles((prev) => ({
      ...prev,
      [name]: Array(TOTAL_CELLS).fill(false),
    }))
    setCurrentProfile(name)
    setNewProfileName('')
  }

  const deleteProfile = () => {
    if (!currentProfile) return
    const remaining = { ...profiles }
    delete remaining[currentProfile]
    setProfiles(remaining)
    const names = Object.keys(remaining)
    setCurrentProfile(names.length > 0 ? names[0] : '')
  }

  if (screen === 'flashcards') {
    return <FlashcardScreen profiles={profiles} onBack={() => setScreen('grid')} />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Chord Builder</h1>

      {/* Profile switcher */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        

        <input
          type="text"
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
          placeholder="New Chord Name"
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        />
        <button
          onClick={createProfile}
          className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm"
        >
          Add
        </button>
      <p className="text-xl font-semibold mb-4 text-gray-800">Current chord</p>

        <select
          value={currentProfile}
          onChange={(e) => setCurrentProfile(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          {Object.keys(profiles).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={deleteProfile}
          className="px-3 py-1 rounded-md bg-red-500 text-white text-sm"
        >
          Delete
        </button>
      </div>

      {/* Grid */}
      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {dots.map((isFilled, index) => (
          <button
            key={index}
            onClick={() => toggleDot(index)}
            className={`
              w-10 h-10 sm:w-12 sm:h-12
              rounded-md border-2 border-gray-300
              flex items-center justify-center
              active:scale-95 transition-transform
              ${isFilled ? 'bg-blue-500 border-blue-500' : 'bg-white'}
            `}
            aria-label={`Cell ${index + 1}`}
          >
            {isFilled && (
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={clearGrid}
          className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
        >
          Clear All
        </button>
        <button
          onClick={() => setScreen('flashcards')}
          className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm"
        >
          Flashcard View
        </button>
      </div>
    </div>
  )
}

export default App