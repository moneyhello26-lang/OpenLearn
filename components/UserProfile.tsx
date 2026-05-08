'use client'

import { useState, useEffect } from 'react'
import { useApi, apiCall } from '@/lib/hooks'

interface User {
  name?: string
  avatar?: string
  bio?: string
  email?: string
}

export function UserProfile() {
  const { data: user, loading, error, refetch } = useApi<User>('/api/users/me')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', avatar: '', bio: '' })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiCall('/api/users/me', {
        method: 'PUT',
        body: formData,
      })
      setIsEditing(false)
      refetch()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {!isEditing ? (
        <div>
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-full mb-4"
            />
          )}
          <div className="mb-4">
            <p className="text-gray-600">Name</p>
            <p className="text-lg font-semibold">{user?.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Email</p>
            <p className="text-lg">{user?.email}</p>
          </div>
          {user?.bio && (
            <div className="mb-4">
              <p className="text-gray-600">Bio</p>
              <p className="text-lg">{user.bio}</p>
            </div>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Avatar URL</label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
