export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export function getAuthToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('pawfinder_token')
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('pawfinder_token', token)
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem('pawfinder_token')
}

export async function backendRequest(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${backendUrl}${path}`, {
      credentials: 'include',
      ...options,
      headers,
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Backend request failed')
    }

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please make sure the backend is running on ' + backendUrl)
    }
    throw error
  }
}
