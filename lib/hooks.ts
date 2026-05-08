'use client'

import { useState, useCallback, useEffect } from 'react'

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  token?: string
}

interface UseApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      const token = options.token || localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (options.method === 'GET' || !options.method) {
      fetchData()
    }
  }, [url])

  return { data, loading, error, refetch: fetchData }
}

export async function apiCall<T>(
  url: string,
  options: UseApiOptions & { body?: any }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = options.token || localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    ...(options.body && { body: JSON.stringify(options.body) }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
