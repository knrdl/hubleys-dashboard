import {error, json} from "@sveltejs/kit";
import {getUserSearchEngines} from "$lib/server/authz";

export async function GET({url, locals, fetch}) {
    const autocompleteUrl = url.searchParams.get('autocomplete_url')
    const searchTerm = url.searchParams.get('query')
    if (!autocompleteUrl || !searchTerm) {
        throw error(422)
    }

    const userSearchEngines = await getUserSearchEngines(locals.user)
    if (!userSearchEngines.some(engine => engine.autocomplete_url && engine.autocomplete_url === autocompleteUrl)) {
        throw error(403, 'user not allowed to use specified search engine')
    }

    const autoCompUrl = new URL(autocompleteUrl)
    const params = autoCompUrl.searchParams
    params.set('q', searchTerm)

    const response = await fetch(autocompleteUrl + '?' + autoCompUrl.searchParams.toString())
    if (!response.ok)
        throw error(504, 'search provider error: ' + (await response.text()))
    const resbody = await response.json()
    if (resbody.suggestions) {
        return json(resbody.suggestions.map(suggestion => suggestion.text))
    } else {
        throw error(500, 'search provider response format not implemented')
    }
}
