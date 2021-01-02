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

const init = () => {
  return {
    "sites": file.readJsonFile('data/sites/site.json') as Array<any>,
    "books": readBooks(file.readSubDirs(bookDir))
  }
}

const storge = init()
class ReaderImpl implements api.Reader {
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
