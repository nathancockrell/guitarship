const ROWS = 8
const COLS = 6

function DotGrid({ dots, onToggle, cellSize = 'w-10 h-10 sm:w-12 sm:h-12', readOnly = false }) {
  return (
    <div
      className="grid gap-2 sm:gap-3"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
    >
      {dots.map((isFilled, index) => (
        <button
          key={index}
          onClick={readOnly ? undefined : () => onToggle(index)}
          disabled={readOnly}
          className={`
            ${cellSize}
            rounded-md border-2 border-gray-300
            flex items-center justify-center
            ${readOnly ? '' : 'active:scale-95 transition-transform'}
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
  )
}

export const TOTAL_CELLS = ROWS * COLS
export default DotGrid