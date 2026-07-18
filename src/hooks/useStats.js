import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalChords: 0,
    totalReviewed: 0,
    reviewedToday: 0,
    reviewedThisWeek: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      setLoading(true)

      // Total chords/voicings that exist in the system
      const { count: totalChords } = await supabase
        .from('chords')
        .select('*', { count: 'exact', head: true })

      // Total times this user has reviewed any chord
      const { count: totalReviewed } = await supabase
        .from('review_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Start of today (midnight, local time)
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      const { count: reviewedToday } = await supabase
        .from('review_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('reviewed_at', startOfToday.toISOString())

      // Start of this week (Sunday at midnight)
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      const { count: reviewedThisWeek } = await supabase
        .from('review_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('reviewed_at', startOfWeek.toISOString())

      setStats({
        totalChords: totalChords ?? 0,
        totalReviewed: totalReviewed ?? 0,
        reviewedToday: reviewedToday ?? 0,
        reviewedThisWeek: reviewedThisWeek ?? 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [user])

  return { stats, loading }
}