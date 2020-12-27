import fs from 'fs'
import ph from 'path'


const isFile = (path: fs.PathLike): boolean => {
  return fs.existsSync(path) && fs.lstatSync(path).isFile()
}

const isDir = (path: fs.PathLike): boolean => {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory()
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
  const parent = ph.dirname(path.toString())
  if(!isDir(parent)){
    mkDir(parent)
  }
  fs.writeFileSync(path, data)
}

const writeJson = (path: string, data:any) => {
  writeFile(path, JSON.stringify(data, null, 2))
}

const del = (path: fs.PathLike): void => {
  if(!fs.existsSync(path)){
    return 
  }
  if(isDir(path)){
    fs.readdirSync(path).forEach(i => del(path + '/' + i))
    fs.rmdirSync(path)
    return
  }
  fs.unlinkSync(path)
}

export default {isFile, isDir, mkDir, readJsonFile, readJsonDir, readSubDirs, writeFile, writeJson, del};
