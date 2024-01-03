import { error, json, type RequestHandler } from '@sveltejs/kit'
import { statfs, access } from 'fs/promises'
import fs from 'fs'

export const GET: RequestHandler = async () => {
  try {
    await access('/data', fs.constants.W_OK)
  } catch (e) {
    error(500, 'data directory is not writable')
  }

  const stats = await statfs('/data')
  if (stats.bavail * stats.bsize < 25 * 1024 ** 2) error(500, 'less than 25 MiB storage available')

  return json('ok')
}
