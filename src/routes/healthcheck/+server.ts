import { error, json, type RequestHandler } from '@sveltejs/kit'
import { statfs, access } from 'fs/promises'
import fs from 'fs'
import { DATA_DIR } from '$lib/server/config'

export const GET: RequestHandler = async () => {
  try {
    await access(DATA_DIR, fs.constants.W_OK)
  } catch (_) {
    error(500, 'data directory is not writable')
  }

  const stats = await statfs(DATA_DIR)
  if (stats.bavail * stats.bsize < 25 * 1024 ** 2) error(500, 'less than 25 MiB storage available')

  return json('ok')
}
