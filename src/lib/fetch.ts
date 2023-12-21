type ReqInit = Omit<RequestInit, 'signal'> & {
  /** timeout in milliseconds, default: 30sec */
  timeout?: number
}

export async function fetchTimeout(input: RequestInfo | URL, init?: ReqInit): Promise<Response> {
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), init?.timeout || 30_000)
  const res = await fetch(input, { ...init, signal: abortController.signal })
  clearTimeout(timeoutId)
  return res
}
