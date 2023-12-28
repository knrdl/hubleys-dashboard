import { sysConfig } from './sysconfig'

type ReqInit = Omit<RequestInit, 'signal'> & {
  failfast?: boolean | undefined
}

export async function fetchTimeout(input: RequestInfo | URL, init?: ReqInit): Promise<Response> {
  const timeout = init?.failfast ? sysConfig.server_request_timeout.failfast : sysConfig.server_request_timeout.max
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), timeout)
  console.debug('fetch', input)
  const res = await fetch(input, { ...init, signal: abortController.signal })
  clearTimeout(timeoutId)
  return res
}
