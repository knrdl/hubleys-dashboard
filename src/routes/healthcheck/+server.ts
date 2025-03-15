import { error, json, type RequestHandler } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { canWrite, availableSpace, isDir } from '$lib/server/fs'

export const GET: RequestHandler = async () => {
  if (!(await isDir(env.LOGOS_DIR!))) error(500, 'logos directory does not exist')

  if (!(await canWrite(env.USERS_DIR!))) error(500, 'users data directory is not writable')

  if ((await availableSpace(env.USERS_DIR!)) < 25 * 1024 ** 2) error(500, 'less than 25 MiB storage available for user data')

  return json('ok')
}
