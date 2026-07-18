function StatWidget({ label, value, color = 'bg-blue-500' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
      <div className={`w-3 h-3 rounded-full ${color} mb-2`} />
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1 text-center">{label}</p>
    </div>
  )
}

export default StatWidget