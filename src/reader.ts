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
  const books = readBooks(file.readSubDirs(bookDir))
  const booksMap: any = {}
  books.forEach((v,i)=>{
    booksMap[v.id] = i
  })
  return {
    "sites": file.readJsonFile('data/sites/site.json') as Array<any>,
    "books": books,
    "booksMap": booksMap,
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
  const title  = tag.replace(/<\/?[^>]*>/g,'').trim();
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
  const type = search.type
  const html = await request.readHtml(path + encodeURI(name))
  let str = html
  str = str.substring(str.indexOf(search.listStart))
  str = str.substring(0, str.indexOf(search.listEnd))
  const links = str.match(/<a([\s\S]*?)<\/a>/gi) || []
  const datas = links.map(parseCharLink).filter(c=>c != null && c.name.indexOf(name) != -1) as Array<api.BookData>
  const arr = datas.map(c => {
    // TODO temp
    if(type === 'cutNumber'){
      const urls = c.url.match(/\d+/gi) || []
      if(!urls){
        return null;
      }
      const url = '/book/' + urls[0] + '/';
      c.url = domain + url;
    }else{
      if(c.url.indexOf('http://')!==0 && c.url.indexOf('https://')!==0){
        c.url = domain + c.url;
      }
    }
    return c
  }).filter(c=>c != null) as Array<api.BookData>
  return arr
}

const getBooksUpdateMap = (books: Array<any>) => {
  const booksMap: any = {}
  let book;
  for(let i in books){
    book = books[i]
    booksMap[book.id] = {...book}
  }
  return booksMap;
}

const storge = init()
class ReaderImpl implements api.Reader {
  async search(name: string): Promise<api.BookData[]> {
    const sites = storge.sites.filter(i => i.search && !i.search.skip) || []
    const list = []
    for(let i in sites){
      try{
        list.push(... await searchSite(name, sites[i]))
      }catch(e){
        console.error('search ' + name + ' fail',  sites[i], e)
      }
    }
    list.forEach((v,i)=>{v.id=i})
    return list
  }
  all(): api.Book[] {
    return storge.books;
  }
  list(param: object): api.Book[] {
    return storge.books;
  }
  get(id: number): api.Book {
    return storge.books[storge.booksMap[id]];
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
    book.reSort = (site||{}).reSort
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
  async updateDirs(): Promise<string> {
    const booksData = file.readJsonFile('data/books.json') || {}
    const books = booksData.books || []
    const newBooks = []
    const booksMap = getBooksUpdateMap(books)
    const allBooks = this.all()
    for(let i in allBooks){
      const book =allBooks[i]
      if(book){
        let bookUpdateData = booksMap[book.id]
        if(!bookUpdateData){
          const lastReadChar = book.getLastUpdateChar() || {title:'', order:0}
          bookUpdateData = {
            id:book.id,
            name:book.name,
            readNum: lastReadChar.order,
            readChar: lastReadChar.title
          }
        }
        const {chars,num} = await book.updateDir()
        const lastChar = chars == null || chars.length === 0 ? {title:'', order: 0} : chars[chars.length - 1]
        bookUpdateData.num = num;
        bookUpdateData.lastNum = lastChar.order;
        bookUpdateData.lastChar = lastChar.title;
        console.log(i + ' updateDir ret = ', bookUpdateData)
        newBooks.push(bookUpdateData)
      }
    }
    booksData.books = newBooks
    file.writeJson('data/books.json', booksData)
    return '123'
  }
  async updateChars(): Promise<string> {
    const booksData = file.readJsonFile('data/books.json') || {}
    const books = booksData.books || []
    const newResults = []
    const booksMap = getBooksUpdateMap(books)
    const allBooks = this.all()
    for(let i in allBooks){
      const book =allBooks[i]
      if(book){
        let bookUpdateData = booksMap[book.id]
        if(bookUpdateData){
          const result = await book.updateCharScope(bookUpdateData.readNum)
          console.log(i + ` update chars `, {...bookUpdateData, ...result})
          newResults.push({...bookUpdateData, ...result, idx:i})
        }
      }
    }
    newResults.forEach(i => console.log(` update chars `, i))
    return '123'
  }
  exportChars(): string {
    const booksData = file.readJsonFile('data/books.json') || {}
    const books = booksData.books || []
    const newBooks = []
    const booksMap = getBooksUpdateMap(books)
    const allBooks = this.all()
    for(let i in allBooks){
      const book =allBooks[i]
      if(book){
        let bookUpdateData = booksMap[book.id]
        if(bookUpdateData){
          if(bookUpdateData.readNum !== bookUpdateData.lastNum || bookUpdateData.lastNum === 0){
            const ret = book.exportTxtScope(bookUpdateData.readNum)
            bookUpdateData.num = 0;
            const lastReadChar = book.getLastUpdateChar(bookUpdateData.readNum) || {title:'', order:0}
            bookUpdateData.readNum = lastReadChar.order;
            bookUpdateData.readChar = lastReadChar.title;
            console.log(i + ' exportChars ret = ', bookUpdateData)
          }
        }else{
          const lastReadChar = book.getLastUpdateChar() || {title:'', order:0}
          bookUpdateData = {
            id:book.id,
            name:book.name,
            readNum: lastReadChar.order,
            readChar: lastReadChar.title
          }
        }
        newBooks.push(bookUpdateData)
      }
    }
    booksData.books = newBooks
    file.writeJson('data/books.json', booksData)
    return '123'
  }
}

export default ReaderImpl;
