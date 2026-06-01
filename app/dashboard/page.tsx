'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
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
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">SnapaFeed</h1>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 font-semibold"
          >
            Log out
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome! 👋</h2>
          <p className="text-gray-500 mb-6">What would you like to do today?</p>
          <div className="grid grid-cols-1 gap-4">
            <button className="bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700">
              🔍 Search by Ingredients
            </button>
            <button className="bg-gray-100 text-gray-400 py-4 rounded-xl font-semibold cursor-not-allowed">
              📸 Scan Pantry (Premium)
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}