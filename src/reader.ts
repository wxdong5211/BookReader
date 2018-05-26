import request from './request'
import file from './file'
import * as api from './api'

class ReaderImpl implements api.Reader {
  all(): api.Book[] {
    throw new Error("Method not implemented.");
  }
  list(param: object): api.Book[] {
    throw new Error("Method not implemented.");
  }
  get(id: string): api.Book {
    throw new Error("Method not implemented.");
  }
  update(book: string | api.Book): string {
    throw new Error("Method not implemented.");
  }
  add(book: api.Book): string {
    throw new Error("Method not implemented.");
  }
  del(book: string | api.Book): string {
    throw new Error("Method not implemented.");
  }
  updateAll(): string {
    throw new Error("Method not implemented.");
  }
}

export default ReaderImpl;
