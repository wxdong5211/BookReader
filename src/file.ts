import fs from 'fs'

const readJsonFile = (path: fs.PathLike) => {
  const book = fs.readFileSync(path)
  return JSON.parse(book.toString())
}

const readJsonDir = (path: fs.PathLike) => {
  const dirs = fs.readdirSync(path)
  return dirs.map(d => readJsonFile(path+'/'+d))
}

const writeFile = (path: fs.PathLike, data: string) => {
  fs.writeFileSync(path, data)
}

export default {readJsonFile, readJsonDir, writeFile};
