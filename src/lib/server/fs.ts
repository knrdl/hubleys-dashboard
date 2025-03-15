import { readFile, writeFile, stat, access, constants, statfs } from 'node:fs/promises'

export async function readJsonFile<T>(filepath: string) {
  return JSON.parse(await readFile(filepath, { encoding: 'utf8' })) as T
}

export async function writeJsonFile(filepath: string, data: unknown) {
  return await writeFile(filepath, JSON.stringify(data, null, 4), { encoding: 'utf8' })
}

export async function isFile(filepath: string) {
  try {
    return (await stat(filepath)).isFile()
  } catch (_) {
    return false
  }
}

export async function isDir(filepath: string) {
  try {
    return (await stat(filepath)).isDirectory()
  } catch (_) {
    return false
  }
}

export async function canWrite(filepath: string) {
  try {
    await access(filepath, constants.R_OK | constants.W_OK)
    return true
  } catch (_) {
    return false
  }
}

export async function availableSpace(filepath: string) {
  try {
    const stats = await statfs(filepath)
    return stats.bavail * stats.bsize
  } catch (_) {
    return 0
  }
}
