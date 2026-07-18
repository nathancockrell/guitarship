import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChordpacks } from '../hooks/useChordpacks'
import { supabase } from '../supabaseClient'
import DotGrid, { TOTAL_CELLS } from '../components/DotGrid'

function ChordBuilderPage() {
  const { chordpacks, loading } = useChordpacks()
  const navigate = useNavigate()

  const [selectedPackId, setSelectedPackId] = useState('')
  const [chordName, setChordName] = useState('')
  const [dots, setDots] = useState(Array(TOTAL_CELLS).fill(false))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const toggleDot = (index) => {
    setDots((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const clearGrid = () => {
    setDots(Array(TOTAL_CELLS).fill(false))
  }

  const handleSave = async () => {
    setMessage('')

    if (!selectedPackId) {
      setMessage('Please select a chordpack first.')
      return
    }
    if (!chordName.trim()) {
      setMessage('Please enter a chord name.')
      return
    }

    setSaving(true)

    const { error } = await supabase.from('chords').insert({
      chordpack_id: selectedPackId,
      name: chordName.trim(),
      voicing_data: dots,
    })

    setSaving(false)

    if (error) {
      setMessage(`Error saving: ${error.message}`)
    } else {
      setMessage(`"${chordName.trim()}" saved successfully!`)
      setChordName('')
      clearGrid()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading chordpacks...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Chord Builder</h1>

      {/* Chordpack + name inputs */}
      <div className="flex flex-col gap-3 w-full max-w-xs mb-6">
        <select
          value={selectedPackId}
          onChange={(e) => setSelectedPackId(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select a chordpack...</option>
          {chordpacks.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={chordName}
          onChange={(e) => setChordName(e.target.value)}
          placeholder="Chord name (e.g. C Major)"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      {/* Grid */}
      <DotGrid dots={dots} onToggle={toggleDot} />

      {message && (
        <p className="mt-4 text-sm text-center text-gray-700 max-w-xs">{message}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={clearGrid}
          className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
        >
          Clear Grid
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-md bg-orange-600 text-white text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Chord'}
        </button>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-4 px-4 py-2 rounded-md bg-gray-400 text-white text-sm"
      >
        Back to Home
      </button>
    </div>
  )
}

export default ChordBuilderPage