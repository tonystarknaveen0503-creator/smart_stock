import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { request } from '../services/api'

const BackendAuthContext = createContext(null)
const storageKey = 'smartstock-auth'

function BackendAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState('')
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const storedToken = window.localStorage.getItem(storageKey)

    if (!storedToken) {
      setAuthReady(true)
      return
    }

    request('/auth/me', {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((payload) => {
        setToken(storedToken)
        setCurrentUser(payload.user)
      })
      .catch(() => {
        window.localStorage.removeItem(storageKey)
      })
      .finally(() => {
        setAuthReady(true)
      })
  }, [])

  const persistAuth = (payload) => {
    window.localStorage.setItem(storageKey, payload.token)
    setToken(payload.token)
    setCurrentUser(payload.user)
  }

  const login = async (email, password) => {
    const payload = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    persistAuth(payload)
  }

  const signup = async (name, email, password) => {
    const payload = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    persistAuth(payload)
  }

  const requestPasswordReset = async (email) => {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  const logout = () => {
    window.localStorage.removeItem(storageKey)
    setCurrentUser(null)
    setToken('')
    return Promise.resolve()
  }

  const value = useMemo(
    () => ({
      authReady,
      currentUser,
      token,
      login,
      logout,
      requestPasswordReset,
      signup,
    }),
    [authReady, currentUser, token],
  )

  return (
    <BackendAuthContext.Provider value={value}>
      {children}
    </BackendAuthContext.Provider>
  )
}

function useBackendAuth() {
  return useContext(BackendAuthContext)
}

export { BackendAuthProvider, useBackendAuth }
