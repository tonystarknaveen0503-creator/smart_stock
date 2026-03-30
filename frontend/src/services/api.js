const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

function getApiBaseUrls() {
  const baseUrls = [API_BASE_URL]

  if (typeof window === 'undefined') {
    return baseUrls
  }

  const isProduction = window.location.hostname !== 'localhost'
  const usesRelativePath = API_BASE_URL.startsWith('/')

  if (isProduction && usesRelativePath) {
    return baseUrls
  }

  if (!isProduction) {
    baseUrls.push('http://localhost:4000/api')
  }

  return [...new Set(baseUrls)]
}

async function parsePayload(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => ({}))
  }

  const text = await response.text().catch(() => '')
  return text ? { message: text } : {}
}

async function request(path, options = {}) {
  const baseUrls = getApiBaseUrls()
  let response
  let payload = {}
  let lastNetworkError = null

  for (let index = 0; index < baseUrls.length; index += 1) {
    const baseUrl = baseUrls[index]

    try {
      response = await fetch(`${baseUrl}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      })
    } catch (error) {
      lastNetworkError = error

      if (index < baseUrls.length - 1) {
        continue
      }

      throw new Error(
        'Unable to reach the Smart Stock API. Start the backend server with "npm run server" or "npm run dev:full".',
      )
    }

    payload = await parsePayload(response)

    if (response.ok) {
      return payload
    }

    if (response.status === 404 || response.status >= 500) {
      if (index < baseUrls.length - 1) {
        continue
      }
    }

    break
  }

  if (!response) {
    throw new Error(
      lastNetworkError?.message ||
        'Unable to reach the Smart Stock API. Start the backend server with "npm run server" or "npm run dev:full".',
    )
  }

  throw new Error(payload.message || `Request failed with status ${response.status}`)
}

export { API_BASE_URL, request }
