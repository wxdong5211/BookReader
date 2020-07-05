import fs from 'fs'

const isFile = (path: fs.PathLike): boolean => {
  return fs.lstatSync(path).isFile()
}

const isDir = (path: fs.PathLike): boolean => {
  return fs.lstatSync(path).isDirectory()
}

const mkDir = (path: fs.PathLike): void => {
  fs.mkdirSync(path)
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

const writeFile = (path: fs.PathLike, data: any): void => {
  fs.writeFileSync(path, data)
}

export default {isFile, isDir, mkDir, readJsonFile, readJsonDir, readSubDirs, writeFile};
