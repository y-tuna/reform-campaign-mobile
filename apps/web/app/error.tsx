'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
        <p className="text-text-secondary mb-6">예상치 못한 오류가 발생했습니다.</p>
        <button 
          onClick={() => reset()}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}