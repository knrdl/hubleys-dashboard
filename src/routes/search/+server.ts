import { error, json } from '@sveltejs/kit'
import { getUserSearchEngines } from '$lib/server/authz'

export async function GET({ url, locals }) {
  const autocompleteUrl = url.searchParams.get('autocomplete_url')
  const searchTerm = url.searchParams.get('query')
  if (!autocompleteUrl || !searchTerm) {
    error(422)
  }

  const userSearchEngines = getUserSearchEngines(locals.user)
  if (!userSearchEngines.some(engine => engine.autocomplete_url && engine.autocomplete_url === autocompleteUrl)) {
    error(403, 'user not allowed to use specified search engine') // prevent SSRF
  }

  const autoCompUrl = new URL(autocompleteUrl)
  const params = autoCompUrl.searchParams
  params.set('q', searchTerm)

  const response = await fetch(autoCompUrl, {
    headers: {
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache'
    }
  })
  if (!response.ok || response.status === 204) error(504, 'search provider error: ' + (await response.text()))
  const resbody: any = (await response.json()) as unknown
  if (resbody.suggestions) {
    return json(resbody.suggestions.map((suggestion: { text: string }) => suggestion.text))
  } else if (Array.isArray(resbody) && resbody.length === 2 && resbody[0] === searchTerm) {
    return json(resbody[1])
  } else if (Array.isArray(resbody) && resbody.length > 0 && resbody[0].phrase) {
    return json(resbody.map(res => res.phrase))
  } else if (Array.isArray(resbody) && resbody.every(item => typeof item === 'string')) {
    return json(resbody)
  } else if (Array.isArray(resbody) && resbody.length === 4 && Array.isArray(resbody[1]) && resbody[1].every(item => typeof item === 'string')) {
    return json(resbody[1])
  } else {
    error(500, 'search provider response format not implemented')
  }
}
