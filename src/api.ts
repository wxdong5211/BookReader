
export interface BRFactory {
  getReader() : Reader
}

export interface Reader {
  all(): Array<Book>,
  list(param: object): Array<Book>,
  get(id: number): Book,
  update(book: number | Book): string,
  add(book: Book): string,
  del(book: number | Book): string,
  updateAll(): string
}

export interface Block {
  dirStart: string,
  dirEnd: string,
  charStart: string,
  charEnd: string,
}

export interface BookConfig {
  encode? : string,
  interval? : number,
  block: Block
}

export interface Site extends BookConfig {
  host : string,
  protocol? : string
}

export interface Book extends BookConfig {
  url : string,
  name : string,
  location : string,
  method? : string,
  update(): string,
  updateDir(): string
  updateChar(id: number): string,
  updateCharScope(from: number, until ?: number): Promise<string>,
  exportChar(id: number): string,
  exportCharScope(from: number, until ?: number): string,
  exportTxtScope(from: number, until ?: number): string,
  getCharsLength(): number,
  getChars(): Array<Charcter>,
  getChar(id: number): Charcter,
  getCharsScope(from: number, until ?: number): Array<Charcter>
}

export enum CharcterState {
  Init = 0,
  Done = 1,
  Error = 2,
}

export interface Charcter {
  id : number,
  url : string,
  title : string,
  create : Date,
  disOrder? : number,
  order : number,
  state : CharcterState
}

export interface CharcterFull extends Charcter {
  data : string
}
