export default function Home() {
  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-600 mb-4">SnapaFeed</h1>
        <p className="text-xl text-gray-600 mb-8">Scan your pantry. Find your next meal.</p>
        <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700">
          Get Started
        </button>
      </div>
    </main>
  )
}