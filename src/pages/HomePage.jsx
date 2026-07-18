import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function HomePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-2 text-gray-800">
        Welcome, {user?.user_metadata?.username || user?.email}
      </h1>
      <p className="text-gray-500 mb-6">Choose where to go:</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/flashcards')}
          className="bg-purple-600 text-white rounded-md py-2 text-sm font-medium"
        >
          Flashcards
        </button>
        <button
          onClick={() => navigate('/stats')}
          className="bg-green-600 text-white rounded-md py-2 text-sm font-medium"
        >
          Stats
        </button>
        <button
          onClick={() => navigate('/library')}
          className="bg-indigo-600 text-white rounded-md py-2 text-sm font-medium"
        >
          Chord Library
        </button>
        <button
          onClick={() => navigate('/builder')}
          className="bg-orange-600 text-white rounded-md py-2 text-sm font-medium"
        >
          Chord Builder
        </button>

        <button
          onClick={signOut}
          className="mt-4 bg-gray-800 text-white rounded-md py-2 text-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default HomePage