import { readFile, writeFile, stat } from 'node:fs/promises'

export async function readJsonFile<T>(filepath: string) {
  return JSON.parse(await readFile(filepath, { encoding: 'utf8' })) as T
}

export async function writeJsonFile(filepath: string, data: unknown) {
  return await writeFile(filepath, JSON.stringify(data, null, 4), { encoding: 'utf8' })
}

export async function isFile(filepath: string) {
  try {
    return (await stat(filepath)).isFile()
  } catch (e) {
    return false
  }
}

export async function isDir(filepath: string) {
  try {
    return (await stat(filepath)).isDirectory()
  } catch (e) {
    return false
  }
}
