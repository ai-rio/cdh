export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tailwind Test</h1>
        <p className="text-gray-600 mb-6">
          If you can see this styled properly, Tailwind CSS is working!
        </p>
        <div className="flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Primary Button
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors">
            Secondary Button
          </button>
        </div>
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800 text-sm">
            ✅ Tailwind CSS is loaded and working correctly!
          </p>
        </div>
      </div>
    </div>
  );
}
