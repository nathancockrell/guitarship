import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useChordpacks() {
  const [chordpacks, setChordpacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChordpacks = async () => {
      const { data, error } = await supabase.from('chordpacks').select('*')
      if (!error) setChordpacks(data)
      setLoading(false)
    }
    fetchChordpacks()
  }, [])

  return { chordpacks, loading }
}

export function useChordsForPack(chordpackId) {
  const [chords, setChords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chordpackId) return

    const fetchChords = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('chords')
        .select('*')
        .eq('chordpack_id', chordpackId)
      if (!error) setChords(data)
      setLoading(false)
    }
    fetchChords()
  }, [chordpackId])

  return { chords, loading }
}