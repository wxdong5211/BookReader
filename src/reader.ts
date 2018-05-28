import request from './request'
import file from './file'
import * as api from './api'

const sleep = (ms: number): Promise<void> => new Promise<void>((resolve,reject) => setTimeout(resolve, ms));

const readHtml = async(url: string) : Promise<string> => {
  const option = request.parseUrl(url);
  let req = await request.request(option);
  return req;
}

const readChar = (char: api.Charcter) : Promise<string>  => {
  return readHtml(char.url);
}

const subDirHtml = (book:api.Book, req: string): string => {
  const start = book.block.dirStart;
  const end = book.block.dirEnd;
  req = req.substr(req.indexOf(start) + start.length);
  req = req.substr(0, req.indexOf(end));
  return req;
}

const subCharHtml = (book:api.Book, req: string): string => {
  const start = book.block.charStart;
  const end = book.block.charEnd;
  req = req.substr(req.indexOf(start) + start.length);
  req = req.substr(0, req.indexOf(end));
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

const readDir = async (book:api.Book) : Promise<Array<api.Charcter>>  => {
  let req = await readHtml(book.url);
  return parseDir(book, subDirHtml(book, req));
}

const updateDir = async (book:api.Book) => {
  try {
    const chars = await readDir(book);
    writeChars(book.location + '/chars.json', chars);
    for (let x in chars) {
      await sleep(100)
      console.log(new Date())
      console.log(chars[x])
      const data = await readChar(chars[x])
      writeCharData(book.location + '/chars/'+x+'.json', subCharHtml(book, data));
    }
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
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

const readBooks = (dirs: Array<string>): Array<api.Book> => {
  return dirs.map(readBook)
}

const readBook = (dir: string): api.Book => {
  const book = file.readJsonFile(dir + '/book.json') as api.Book
  book.location = dir
  return book;
}

const init = () => {
  return {
    "sites": file.readJsonDir('data/sites'),
    "books": readBooks(file.readSubDirs('data/books'))
  }
}

const storge = init()

console.log(storge)

class ReaderImpl implements api.Reader {
  all(): api.Book[] {
    return storge.books;
  }
  list(param: object): api.Book[] {
    return storge.books;
  }
  get(id: string): api.Book {
    return storge.books[0];
  }
  update(book: string | api.Book): string {
    if(typeof book === 'string'){
      book = this.get(book)
    }
    updateDir(book);
    writeBook('data/test.json', book)
    return '123'
  }
  add(book: api.Book): string {
    throw new Error("Method not implemented.");
  }
  del(book: string | api.Book): string {
    throw new Error("Method not implemented.");
  }
  updateAll(): string {
    storge.books.map(this.update)
    return '123'
  }
}

export default ReaderImpl;
