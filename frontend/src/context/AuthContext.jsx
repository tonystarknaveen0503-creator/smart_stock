import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseEnabled } from '../services/firebase'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authReady, setAuthReady] = useState(!firebaseEnabled)

  useEffect(() => {
    if (!firebaseEnabled) {
      setAuthReady(true)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setAuthReady(true)
    })

    return unsubscribe
  }, [])

  const login = (email, password) => {
    if (!firebaseEnabled) {
      setCurrentUser({
        uid: 'demo-user',
        email,
        displayName: email.split('@')[0],
      })
      setAuthReady(true)
      return Promise.resolve()
    }

    return signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (name, email, password) => {
    if (!firebaseEnabled) {
      setCurrentUser({
        uid: 'demo-user',
        email,
        displayName: name,
      })
      setAuthReady(true)
      return
    }

    const credentials = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credentials.user, { displayName: name })
    await setDoc(doc(db, 'users', credentials.user.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
    })
  }

  const logout = () => {
    if (!firebaseEnabled) {
      setCurrentUser(null)
      return Promise.resolve()
    }

    return signOut(auth)
  }

  const value = useMemo(
    () => ({
      authReady,
      currentUser,
      firebaseEnabled,
      login,
      logout,
      signup,
    }),
    [authReady, currentUser, firebaseEnabled],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
