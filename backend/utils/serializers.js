function createMemoryId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getUserId(user) {
  return user?._id?.toString?.() || user?.id || ''
}

function sanitizeUser(user) {
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

function mapWatchlistItem(context, item) {
  const watchlistId = item._id?.toString?.() || item.id
  const rawUser = item.userId
  const memoryUser =
    rawUser && typeof rawUser === 'object' && rawUser.name
      ? rawUser
      : context.state.memoryStore.users.find((user) => user.id === rawUser)

  return {
    id: watchlistId,
    symbol: item.symbol,
    createdAt: item.createdAt,
    user: memoryUser || rawUser?._id || rawUser?.name
      ? {
          id: memoryUser?.id || rawUser?._id?.toString?.() || rawUser?.toString?.(),
          name: memoryUser?.name || rawUser?.name,
          email: memoryUser?.email || rawUser?.email,
        }
      : null,
  }
}

function toCsv(rows) {
  if (!rows.length) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const escapeCell = (value) => {
    const stringValue = String(value ?? '')
    return `"${stringValue.replaceAll('"', '""')}"`
  }

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(',')),
  ].join('\n')
}

export { createMemoryId, getUserId, mapWatchlistItem, sanitizeUser, toCsv }
