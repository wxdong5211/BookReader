import fs from 'fs'

const readJsonFile = (path: fs.PathLike): any => {
  const stat = fs.lstatSync(path)
  if(stat.isFile()){
    const book = fs.readFileSync(path)
    return JSON.parse(book.toString())
  }
  return null
}

const readJsonDir = (path: fs.PathLike): Array<any> => {
  const dirs = fs.readdirSync(path)
  return dirs.map(d => readJsonFile(path+'/'+d)).filter(d => !!d)
}

const writeFile = (path: fs.PathLike, data: string): void => {
  fs.writeFileSync(path, data)
}

export default {readJsonFile, readJsonDir, writeFile};
