import fs from 'fs'

export async function readFile(filepath: string) {
  return fs.promises.readFile(filepath, { encoding: 'utf8' })
}

export async function readJsonFile<T>(filepath: string) {
  return JSON.parse(await fs.promises.readFile(filepath, { encoding: 'utf8' })) as T
}

export async function writeJsonFile(filepath: string, data: unknown) {
  return await fs.promises.writeFile(filepath, JSON.stringify(data, null, 4), { encoding: 'utf8' })
}

export async function writeFile(filepath: string, text: string) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filepath, text, { encoding: 'utf8' }, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function writeBinaryFile(filepath: string, data: Buffer) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filepath, data, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function readBinaryFile(filepath: string) {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(filepath, (err, file) => {
      if (err) reject(err)
      else resolve(file)
    })
  })
}

export async function isFile(filepath: string) {
  try {
    return (await fs.promises.stat(filepath)).isFile()
  } catch (e) {
    return false
  }
}

export async function isDir(filepath: string) {
  try {
    return (await fs.promises.stat(filepath)).isDirectory()
  } catch (e) {
    return false
  }
}

export async function deleteFile(filepath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(filepath, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}
