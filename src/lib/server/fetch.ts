import { sysConfig } from './sysconfig'

type ReqInit = Omit<RequestInit, 'signal'> & {
  failfast?: boolean | undefined
}

export async function fetchTimeout(input: RequestInfo | URL, init?: ReqInit): Promise<Response> {
  const timeout = init?.failfast ? sysConfig.server_request_timeout.failfast : sysConfig.server_request_timeout.max
  const abortController = new AbortController()
  const timeoutId = timeout ? setTimeout(() => abortController.abort(), timeout) : null
  console.debug('fetch', input)
  const res = await fetch(input, { ...init, signal: abortController.signal })
  if (timeoutId !== null) clearTimeout(timeoutId)
  return res
}
