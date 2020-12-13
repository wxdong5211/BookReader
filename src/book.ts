import * as request from './request'
import file from './file'
import * as api from './api'
import {encode} from './codec'

const sleep = (ms: number): Promise<void> => new Promise<void>((resolve,reject) => setTimeout(resolve, ms));

const readHtml = async(url: string) : Promise<string> => {
  // console.log('url',url)
  const option = request.parseUrl(url);
  const req = await request.request(option);
  // console.log('req',req)
  return req;
}

const parseCharLink = (tag: string, idx: number): api.Charcter => {
  const hrefStart = 'href="'
  let href = tag.substr(tag.indexOf(hrefStart) + hrefStart.length);
  href = href.substr(0, href.indexOf('"'))
  const title  = tag.replace(/<\/?[^>]*>/g,'')
  const charcter = {
    id : idx,
    url : href,
    title : title,
    create : new Date(),
    disOrder : idx,
    order : idx,
    state : api.CharcterState.Init
  }
  return charcter
}

const parseDir = (book:api.Book, req: string) : Array<api.Charcter> => {
  const dirHtml = req.match(/<a.*href=".*".*>.*<\/a>/gi)
  return dirHtml ? dirHtml.map(parseCharLink) : [];
}

const subDirHtml = (book:api.Book, req: string): string => {
  const start = book.block.dirStart;
  const end = book.block.dirEnd;
  req = req.substr(req.indexOf(start) + start.length);
  req = req.substr(0, req.indexOf(end));
  return req;
}

const readDir = async (book:api.Book) : Promise<Array<api.Charcter>>  => {
  let url = book.url;
  if(book.commonUrlParam){
    const paramIdx = url.indexOf('?');
    url += (paramIdx === -1 ? '?' : '&') + book.commonUrlParam;
  }
  const req = await readHtml(url);
  return parseDir(book, subDirHtml(book, req));
}

const readChar = (book:api.Book, char: api.Charcter) : Promise<string>  => {
  let url = char.url;
  if(!url.startsWith('http://') || !url.startsWith('https://')){
    if(url.startsWith('/')){
      const proIdx = book.url.indexOf('//');
      const pathIdx = book.url.indexOf('/', proIdx + 2);
      const domain = book.url.substr(0, pathIdx)
      url = domain + url;
    }else{
      const paramIdx = book.url.indexOf('?');
      const path = paramIdx === -1 ? book.url : book.url.substr(0, paramIdx);
      url = path + (path.endsWith('/') ? '':'/') + url;
    }
  }
  return readHtml(url);
}

const subCharHtml = (book:api.Book, req: string): string => {
  const start = book.block.charStart;
  const end = book.block.charEnd;
  req = req.substr(req.indexOf(start) + start.length);
  req = req.substr(0, req.indexOf(end));
  req = req.replace(/&nbsp;/g, ' ');
  req = req.replace(/<br \/>/g, '\n');
  return req;
}

const updateDirFunc = async (book:api.Book): Promise<Array<api.Charcter>> => {
  try {
    const chars = await readDir(book);
    writeBookChars(book, chars);
    return chars;
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
  return [];
}

const updateAll = async (book:api.Book) => {
  try {
    const chars = await updateDirFunc(book);
    await updateChars(book, chars, false);
    writeBookChars(book, chars);
  } catch (e) {
    console.log('problem with updateAll: ' + e.message);
  }
}

const updateChars = async (book:api.Book, chars: Array<api.Charcter>, force: boolean) => {
  try {
    for (let x in chars) {
      await sleep(100); //TODO interval by config
      await updateCharFunc(book, chars[x], force);
    }
  } catch (e) {
    console.log('problem with updateChars: ' + e.message);
  }
}

const updateCharFunc = async (book: api.Book, char: api.Charcter, force: boolean) => {
  if(!force && char.state === api.CharcterState.Done){
    return
  }
  try {
    console.log(new Date())
    console.log(char)
    const data = await readChar(book, char)
    const html = subCharHtml(book, data);
    let state = api.CharcterState.Done
    if(!html){
      state = api.CharcterState.Init
      console.log('data', data)
    }
    const charFull = Object.assign({data:html}, char, {create : new Date(), state: state});
    writeBookChar(book, charFull);
    char.state = state;
  } catch (e) {
    console.log('problem with request: ' + e.message);
    char.state = api.CharcterState.Error;
  }
}

const readCharsData = (book: api.Book): Array<api.Charcter> => {
  try {
    const data = file.readJsonFile(book.location + '/chars.json');
    return (data||{}).chars;
  } catch (e) {
    console.log('problem with readCharsData: ' + e.message);
  }
  return [];
}

const readCharFullData = (book: api.Book, id: number): api.CharcterFull | null => {
  try {
    return file.readJsonFile(book.location + '/chars/'+id+'.json');
  } catch (e) {
    console.log('problem with readCharFullData: ' + e.message);
  }
  return null;
}

const writeBookChars = (book: api.Book, chars:Array<api.Charcter>) => {
  writeJson(book.location + '/chars.json', {chars})
}

const writeBookChar = (book: api.Book, char:api.CharcterFull) => {
  writeJson(book.location + '/chars/'+char.id+'.json', char)
}

const writeBook = (path: string, book:api.Book) => {
  writeJson(path, book)
}

const writeJson = (path: string, data:any) => {
  file.writeFile(path, JSON.stringify(data, null, 2))
}

const writeTxt = (path: string, data:any) => {
  file.writeFile(path, data)
}

class BookImpl implements api.Book {
  name: string;
  url: string;
  location: string;
  method?: string | undefined;
  commonUrlParam?: string | undefined;
  encode?: string | undefined;
  interval?: number | undefined;
  block: api.Block;
  constructor(book: api.Book){
    this.name = book.name;
    this.url = book.url;
    this.location = book.location;
    this.method = book.method;
    this.commonUrlParam = book.commonUrlParam;
    this.encode = book.encode;
    this.interval = book.interval;
    this.block = book.block;
  }
  update(): string {
    updateAll(this);
    writeBook('data/test.json', this);
    return '123asd';
  }
  updateDir(): string {
    updateDirFunc(this);
    return '123asd';
  }
  updateChar(id: number): string {
    updateCharFunc(this, this.getChar(id), true);
    return '123asd';
  }
  async updateCharScope(from: number, until ?: number): Promise<string> {
    try {
      const charsAll = (this.getChars()||[]);
      const chars = charsAll.slice(from, until);
      await updateChars(this, chars, false);
      writeBookChars(this, charsAll);
    } catch (e) {
      console.log('problem with updateCharUntil: ' + e.message);
    }
    return '123asd';
  }
  exportChar(id: number): string {
    const charFull = readCharFullData(this, id);
    if(charFull === null){
      return '';
    }
    // const data = (charFull.data || '').replace(/\n/g, '<br/>\n');
    const data = charFull.data || '';
    const title = charFull.title || '';
    // return `<div><h3>${title}</h3><p>${data}</p></div>`;
    return `${title}\n${data}`;
  }
  exportCharScope(from: number, until ?: number): string {
    const chars = this.getCharsScope(from, until) || [];
    const head = `${this.name}\n`;
    return head + chars.map(c => this.exportChar(c.id)).join('\n');
  }
  exportTxtScope(from: number, until ?: number): string {
    const txt = this.exportCharScope(from, until);
    const file = `${this.name}.txt`;
    const encodeCfg = this.encode;
    if(encodeCfg){
      writeTxt(this.location + '/'+ file , encode(txt, encodeCfg));
    }else{
      writeTxt(this.location + '/'+ file , txt);
    }
    return 'asdsad';
  }
  getChars(): Array<api.Charcter>{
    return readCharsData(this);
  }
  getCharsLength(): number{
    return (this.getChars()||[]).length;
  }
  getChar(id: number): api.Charcter{
    return (this.getCharsScope(id, id + 1)||[])[0];
  }
  updateCharState(state: api.CharcterState, id: number): void{
    this.updateCharStateScope(state, id, id + 1)
  }
  updateCharStateScope(state: api.CharcterState, from: number, until ?: number): void{
    const chars = (this.getChars()||[]);
    const arr = chars.slice(from, until);
    let tag = false;
    for (let x in arr) {
      const id = arr[x].id
      const charFull = readCharFullData(this, id);
      if(charFull !== null){
        tag = true;
        charFull.state = state;
        writeBookChar(this, charFull);
        const char = chars[id];
        if(char){
          char.state = state;
        }
      }
    }
    if(tag){
      writeBookChars(this, chars)
    }
  }
  getCharsScope(from: number, until ?: number): Array<api.Charcter> {
    const chars = (this.getChars()||[])
    return chars.slice(from, until);
  }
}

export default BookImpl;
