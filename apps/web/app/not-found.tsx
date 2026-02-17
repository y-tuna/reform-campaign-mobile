export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-text-secondary mb-6">페이지를 찾을 수 없습니다.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  )
}