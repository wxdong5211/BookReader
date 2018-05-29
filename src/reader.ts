import file from './file'
import * as api from './api'
import Book from './book'

const readBooks = (dirs: Array<string>): Array<api.Book> => {
  return dirs.map(readBook)
}

const readBook = (dir: string): api.Book => {
  const book = file.readJsonFile(dir + '/book.json') as api.Book
  book.location = dir
  return new Book(book);
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
    book.update();
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
