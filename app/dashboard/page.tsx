'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

type Recipe = {
  id: string
  title: string
  image: string
  usedIngredientCount: number
  sourceUrl: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [ingredients, setIngredients] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSearch = async () => {
    if (!ingredients.trim()) return
    setLoading(true)
    setError('')
    setRecipes([])
    try {
      const response = await fetch('/api/recipes?ingredients=' + encodeURIComponent(ingredients))
      const data = await response.json()
      if (data.error) {
        setError('Failed to fetch recipes. Please try again.')
      } else {
        setRecipes(data)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const searchQuery = ingredients.split(',').join(' ').trim()

  if (!user) return null

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">SnapaFeed</h1>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-semibold">
            Log out
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Search by Ingredients</h2>
          <p className="text-gray-500 text-sm mb-4">Type ingredients you have, separated by commas</p>
          <input
            type="text"
            placeholder="e.g. eggs, flour, milk"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Recipes'}
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {recipes.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
                <img src={recipe.image} alt={recipe.title} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-700">{recipe.title}</h3>
                  <p className="text-sm text-gray-500">Uses {recipe.usedIngredientCount} of your ingredients</p>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 text-center">Recipe</a>
                  <a href={'https://www.youtube.com/results?search_query=' + encodeURIComponent(recipe.title + ' recipe')} target="_blank" rel="noopener noreferrer" className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 text-center">YouTube</a>
                </div>
              </div>
            ))}
          </div>
        )}
        {searchQuery && (
          <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Search More Recipe Sites</h2>
            <div className="grid grid-cols-1 gap-3">
              <a href={'https://www.allrecipes.com/search?q=' + encodeURIComponent(searchQuery)} target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 text-center">Search AllRecipes</a>
              <a href={'https://www.bbcgoodfood.com/search?q=' + encodeURIComponent(searchQuery)} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 text-center">Search BBC Good Food</a>
              <a href={'https://tasty.co/search?q=' + encodeURIComponent(searchQuery)} target="_blank" rel="noopener noreferrer" className="bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 text-center">Search Tasty</a>
              <a href={'https://www.youtube.com/results?search_query=' + encodeURIComponent(searchQuery + ' recipe')} target="_blank" rel="noopener noreferrer" className="bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 text-center">Search YouTube</a>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-400 mb-2">Scan Pantry</h2>
          <p className="text-gray-400 text-sm mb-4">Upgrade to Premium to scan your pantry with AI</p>
          <button className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed">
            Unlock Premium - $4.99/month
          </button>
        </div>
      </div>
    </main>
  )
}
