import { useNavigate } from 'react-router-dom'
import { useStats } from '../hooks/useStats'
import StatWidget from '../components/StatWidget'

function StatsPage() {
  const { stats, loading } = useStats()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Your Stats</h1>

      {loading ? (
        <p className="text-gray-500 mb-6">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
          <StatWidget
            label="Total Chords/Voicings"
            value={stats.totalChords}
            color="bg-indigo-500"
          />
          <StatWidget
            label="Total Reviewed"
            value={stats.totalReviewed}
            color="bg-green-500"
          />
          <StatWidget
            label="Reviewed Today"
            value={stats.reviewedToday}
            color="bg-orange-500"
          />
          <StatWidget
            label="Reviewed This Week"
            value={stats.reviewedThisWeek}
            color="bg-purple-500"
          />
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm"
      >
        Back to Home
      </button>
    </div>
  )
}

export default StatsPage