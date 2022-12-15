import fs from "fs";

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
        fs.writeFile(filepath, text, {encoding: 'utf8'}, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}

export async function existsFile(filepath: string) {
    try {
        return (await fs.promises.stat(filepath)).isFile()
    } catch (e) {
        return false
    }
}

export async function listFilesInFolder(filepath: string) {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(filepath, {withFileTypes: true}, (err, dirents) => {
            if (err) reject(err)
            else resolve(dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name))
        })
    })
}
