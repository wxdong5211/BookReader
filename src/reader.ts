import * as request from './request'
import file from './file'
import * as api from './api'
import Book from './book'

const bookDir = 'data/books'

const readBooks = (dirs: Array<string>): Array<api.Book> => {
  return dirs.map(readBook).sort( (a,b) => a.id - b.id)
}

const readBook = (dir: string): api.Book => {
  const book = file.readJsonFile(dir + '/book.json') as api.Book
  book.location = dir
  return new Book(book);
}

const maxBookId = (): number => {
  const books = storge.books
  if(books){
    return books[books.length - 1].id
  }
  return 0;
}

const init = () => {
  return {
    "sites": file.readJsonFile('data/sites/site.json') as Array<any>,
    "books": readBooks(file.readSubDirs(bookDir))
  };
}

const parseCharLink = (tag: string, idx: number): api.BookData|null => {
  const hrefStart = 'href="'
  const hrefIdx = tag.indexOf(hrefStart);
  if(hrefIdx === -1){
    return null;
  }
  let href = tag.substr(hrefIdx + hrefStart.length);
  href = href.substr(0, href.indexOf('"'))
  const title  = tag.replace(/<\/?[^>]*>/g,'')
  const charcter = {
    id : idx,
    url : href,
    name : title
  }
  return charcter
}

const searchSite = async (name: string, site: any): Promise<api.BookData[]> => {
  const search = site.search
  const domain = site.protocol + '//' + site.host
  const path = domain + search.path
  const html = await request.readHtml(path + encodeURI(name))
  let str = html
  str = str.substring(str.indexOf(search.listStart))
  str = str.substring(0, str.indexOf(search.listEnd))
  const links = str.match(/<a([\s\S]*?)<\/a>/gi) || []
  const datas = links.map(parseCharLink).filter(c=>c != null && c.name.indexOf(name) != -1) as Array<api.BookData>
  const arr = datas.map(c => {
    // TODO temp
    const urls = c.url.match(/\d+/gi) || []
    if(!urls){
      return null;
    }
    const url = '/book/' + urls[0] + '/';
    c.url = domain + url;
    return c
  }).filter(c=>c != null) as Array<api.BookData>
  return arr
}

const storge = init()
class ReaderImpl implements api.Reader {
  async search(name: string): Promise<api.BookData[]> {
    const sites = storge.sites.filter(i => i.search) || []
    const list = []
    for(let i in sites){
      list.push(... await searchSite(name, sites[i]))
    }
    return list
  }
  all(): api.Book[] {
    return storge.books;
  }
  list(param: object): api.Book[] {
    return storge.books;
  }
  get(id: number): api.Book {
    return storge.books[id];
  }
  update(book: number | api.Book): string {
    if(typeof book === 'number'){
      book = this.get(book)
    }
    book.update();
    return '123'
  }
  add(book: api.BookData): string {
    book.id = maxBookId() + 1
    const option = request.parseUrl(book.url);
    const site = storge.sites.find(i => i.host === option.host && i.protocol === option.protocol)
    book.block = (site||{}).block
    file.writeJson(bookDir + '/' + book.id + '/book.json', book)
    return '123'
  }
  del(book: number | api.Book): string {
    if(typeof book === 'number'){
      book = this.get(book)
      if(book == null){
        return 'nobook';
      }
    }
    file.del(bookDir + '/' + book.id)
    return '123'
  }
  updateAll(): string {
    storge.books.map(this.update)
    return '123'
  }
}

export default ReaderImpl;
