const DEFAULT_API_BASE_URL = '/api'
const LOCAL_API_BASE_URL = 'http://localhost:4000/api'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

function getApiBaseUrls() {
  const baseUrls = [API_BASE_URL]

  if (typeof window === 'undefined') {
    return baseUrls
  }

  const usesRelativeApiPath = !API_BASE_URL.startsWith('http')
  const isAlreadyOnApiPort = window.location.port === '4000'

  if (usesRelativeApiPath && !isAlreadyOnApiPort) {
    baseUrls.push(LOCAL_API_BASE_URL)
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

function shouldRetryWithNextBaseUrl(response, remainingBaseUrls) {
  if (remainingBaseUrls <= 0) {
    return false
  }

  return response.status === 404 || response.status >= 500
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

    if (shouldRetryWithNextBaseUrl(response, baseUrls.length - index - 1)) {
      continue
    }

    break
  }

  if (!response) {
    throw new Error(
      lastNetworkError?.message ||
        'Unable to reach the Smart Stock API. Start the backend server with "npm run server" or "npm run dev:full".',
    )
  }

  const fallbackMessage =
    response.status >= 500
      ? 'Smart Stock API is unavailable. Start the backend server with "npm run server" or "npm run dev:full".'
      : 'Request failed.'

  throw new Error(payload.message || fallbackMessage)
}

export { API_BASE_URL, request }
