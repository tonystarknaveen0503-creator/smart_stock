import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseEnabled } from './firebase'

const demoWatchlistStore = new Map()

function subscribeToWatchlist(userId, onUpdate) {
  if (!firebaseEnabled) {
    const items = demoWatchlistStore.get(userId) || []
    onUpdate(items)
    return () => undefined
  }

  const watchlistQuery = query(
    collection(db, 'users', userId, 'watchlist'),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(watchlistQuery, (snapshot) => {
    onUpdate(
      snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })),
    )
  })
}

async function addWatchlistSymbol(userId, symbol) {
  if (!firebaseEnabled) {
    const currentItems = demoWatchlistStore.get(userId) || []
    const createdItem = { id: `${symbol}-${Date.now()}`, symbol }
    demoWatchlistStore.set(userId, [createdItem, ...currentItems])
    return createdItem
  }

  return addDoc(collection(db, 'users', userId, 'watchlist'), {
    symbol,
    createdAt: serverTimestamp(),
  })
}

export { addWatchlistSymbol, subscribeToWatchlist }
