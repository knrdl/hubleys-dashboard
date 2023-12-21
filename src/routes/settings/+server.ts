import { redirect } from '@sveltejs/kit'

export async function GET() {
  redirect(307, '/settings/background')
}
