import request from './request'
import file from './file'

interface Block {
  dirStart: string,
  dirEnd: string,
  charStart: string,
  charEnd: string,
}

interface BookConfig {
  encode? : string,
  interval? : number,
  block: Block
}

interface Site extends BookConfig {
  host : string,
  protocol? : string
}

interface Book extends BookConfig {
  url : string,
  method? : string
}

enum CharcterState {
  Init = 0,
  Done = 1,
  Error = 2,
}

interface Charcter {
  url : string,
  title : string,
  create : Date,
  disOrder? : number,
  order : number,
  state : CharcterState
}

const sleep = (ms: number): Promise<void> => new Promise<void>((resolve,reject) => setTimeout(resolve, ms));

const readHtml = async(url: string) : Promise<string> => {
  const option = request.parseUrl(url);
  let req = await request.request(option);
  return req;
}

const readChar = (char:Charcter) : Promise<string>  => {
  return readHtml(char.url);
}

const subDirHtml = (book:Book, req: string): string => {
  const start = book.block.dirStart;
  const end = book.block.dirEnd;
  req = req.substr(req.indexOf(start) + start.length);
  req = req.substr(0, req.indexOf(end));
  return req;
}

const subCharHtml = (book:Book, req: string): string => {
  const start = book.block.charStart;
  const end = book.block.charEnd;
  req = req.substr(req.indexOf(start) + start.length);
  req = req.substr(0, req.indexOf(end));
  return req;
}

const parseCharLink = (tag: string, idx: number): Charcter => {
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
    state : CharcterState.Init
  }
  return charcter
}

const parseDir = (book:Book, req: string) : Array<Charcter> => {
  const dirHtml = req.match(/<a.*href=".*".*>.*<\/a>/gi)
  return dirHtml ? dirHtml.map(parseCharLink) : [];
}

const readDir = async (book:Book) : Promise<Array<Charcter>>  => {
  let req = await readHtml(book.url);
  return parseDir(book, subDirHtml(book, req));
}

const updateDir = async (book:Book) => {
  try {
    const chars = await readDir(book);
    writeChars('data/books/chars.json', chars);
    for (let x in chars) {
      await sleep(100)
      console.log(new Date())
      console.log(chars[x])
      const data = await readChar(chars[x])
      writeCharData('data/books/chars/'+x+'.json', subCharHtml(book, data));
    }
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
}

const writeChars = (path: string, chars:Array<Charcter>) => {
  writeJson(path, {chars})
}

const writeChar = (path: string, char:Charcter) => {
  writeJson(path, char)
}

const writeCharData = (path: string, data:string) => {
  writeJson(path, {data})
}

const writeBook = (path: string, book:Book) => {
  writeJson(path, book)
}

const writeJson = (path: string, data:any) => {
  file.writeFile(path, JSON.stringify(data, null, 2))
}

const init = () => {
  return {
    "sites": file.readJsonDir('data/sites'),
    "books": file.readJsonDir('data/books')
  }
}

const test = () => {
  const book = init()
  console.log(book)
  updateDir(book.books[0]);
  writeBook('data/test.json', book.books[0])
};

test();
