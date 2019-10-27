import request from './request'
import file from './file'
import * as api from './api'

const sleep = (ms: number): Promise<void> => new Promise<void>((resolve,reject) => setTimeout(resolve, ms));

const readHtml = async(url: string) : Promise<string> => {
  const option = request.parseUrl(url);
  const req = await request.request(option);
  return req;
}

const parseCharLink = (tag: string, idx: number): api.Charcter => {
  const hrefStart = 'href="'
  let href = tag.substr(tag.indexOf(hrefStart) + hrefStart.length);
  href = href.substr(0, href.indexOf('"'))
  const title  = tag.replace(/<\/?[^>]*>/g,'')
  const charcter = {
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
  const req = await readHtml(book.url);
  return parseDir(book, subDirHtml(book, req));
}

const readChar = (book:api.Book, char: api.Charcter) : Promise<string>  => {
  let url = char.url;
  if(!url.startsWith('http://') || !url.startsWith('https://')){
    url = book.url + (book.url.endsWith('/') ? '':'/') + url;
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
    writeChars(book.location + '/chars.json', chars);
    return chars;
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
  return [];
}

const updateAll = async (book:api.Book) => {
  try {
    const chars = await updateDirFunc(book);
    for (let x in chars) {
      await sleep(100);
      await updateCharFunc(book, chars[x], x);
    }
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
}

const updateCharFunc = async (book: api.Book, char: api.Charcter, id: string) => {
  try {
    console.log(new Date())
    console.log(char)
    const data = await readChar(book, char)
    writeCharData(book.location + '/chars/'+id+'.json', subCharHtml(book, data));
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
}

const readCharsData = (book: api.Book): Array<api.Charcter> => {
  try {
    const data = file.readJsonFile(book.location + '/chars.json');
    return (data||{}).chars;
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
  return [];
}

const writeChars = (path: string, chars:Array<api.Charcter>) => {
  writeJson(path, {chars})
}

const writeChar = (path: string, char:api.Charcter) => {
  writeJson(path, char)
}

const writeCharData = (path: string, data:string) => {
  writeJson(path, {data})
}

const writeBook = (path: string, book:api.Book) => {
  writeJson(path, book)
}

const writeJson = (path: string, data:any) => {
  file.writeFile(path, JSON.stringify(data, null, 2))
}

class BookImpl implements api.Book {
  url: string;
  location: string;
  method?: string | undefined;
  encode?: string | undefined;
  interval?: number | undefined;
  block: api.Block;
  constructor(book: api.Book){
    this.url = book.url;
    this.location = book.location;
    this.method = book.method;
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
    updateCharFunc(this, this.getChar(id), id+'');
    return '123asd';
  }
  getChars(): Array<api.Charcter>{
    return readCharsData(this);
  }
  getChar(id: number): api.Charcter{
    return (this.getChars()||[])[id];
  }
}

export default BookImpl;
