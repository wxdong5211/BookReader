import fs from 'fs'

const isFile = (path: fs.PathLike): boolean => {
  return fs.lstatSync(path).isFile()
}

const isDir = (path: fs.PathLike): boolean => {
  return fs.lstatSync(path).isDirectory()
}

const readJsonFile = (path: fs.PathLike): any => {
  if(isFile(path)){
    const txt = fs.readFileSync(path)
    return JSON.parse(txt.toString())
  }
  return null
}

const readJsonDir = (path: fs.PathLike): Array<any> => {
  const dirs = fs.readdirSync(path)
  return isDir(path) ? dirs.map(d => readJsonFile(path+'/'+d)).filter(d => !!d) : []
}

const readSubDirs = (path: fs.PathLike): Array<string> => {
  const dirs = fs.readdirSync(path)
  return isDir(path) ? dirs.map(d => path+'/'+d).filter(d => isDir(d)) : []
}

const writeFile = (path: fs.PathLike, data: string): void => {
  fs.writeFileSync(path, data)
}

export default {readJsonFile, readJsonDir, readSubDirs, writeFile};
