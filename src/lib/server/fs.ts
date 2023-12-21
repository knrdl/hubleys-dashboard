import fs from 'fs'

export async function readFile(filepath: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, file) => {
      if (err) reject(err)
      else resolve(file)
    })
  })
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

export async function listFilesInFolder(filepath: string) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(filepath, { withFileTypes: true }, (err, dirents) => {
      if (err) reject(err)
      else resolve(dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name))
    })
  })
}

export async function deleteFile(filepath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(filepath, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}
