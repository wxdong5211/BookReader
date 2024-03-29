
export interface BRFactory {
  getReader() : Reader
}

export interface Reader {
  all(): Array<Book>,
  list(param: object): Array<Book>,
  get(id: number): Book,
  update(book: number | Book): string,
  add(book: BookData): string,
  del(book: number | Book): string,
  updateAll(): string,
  updateDirs(): Promise<string>,
  updateChars(): Promise<string>,
  exportChars(): string,
  search(param: string): Promise<Array<BookData>>
}

export interface Block {
  dirStart: string,
  dirEnd: string,
  charStart: string,
  charEnd: string,
  filter? : string
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

export interface BookData {
  id : number,
  url : string,
  name : string,
  location? : string,
  method? : string,
  commonUrlParam? : string,
  reSort? : string,
  encode? : string,
  interval? : number,
  block? : string
}

export interface Book extends BookConfig {
  id : number,
  url : string,
  name : string,
  location? : string,
  method? : string,
  commonUrlParam? : string,
  reSort? : string,
  update(): string,
  updateDir(): Promise<UpdateDirResult>
  updateChar(id: number): Promise<string>,
  updateCharScope(from: number, until ?: number): Promise<UpdateCharResult|null>,
  exportChar(id: number): string,
  exportCharScope(from: number, until ?: number): string,
  exportTxtScope(from: number, until ?: number): string,
  getCharsLength(): number,
  getChars(): Array<Charcter>,
  getChar(id: number): Charcter,
  getLastUpdateChar(from ?: number): Charcter | undefined,
  getLastChar(): Charcter | undefined,
  updateCharState(state: CharcterState, id: number): void,
  updateCharStateScope(state: CharcterState, from: number, until ?: number): void,
  getCharsScope(from: number, until ?: number): Array<Charcter>,
  reOrder(): void
}

export class UpdateDirResult {

  chars : Array<Charcter>;
  num: number;
  constructor(chars: Array<Charcter>, num: number){
    this.chars = chars;
    this.num = num;
  }

}

export class UpdateCharResult {

  total: number;
  skip: number;
  done: number;
  error: number;
  constructor(total: number, skip: number, done: number, error: number){
    this.total = total;
    this.skip = skip;
    this.done = done;
    this.error = error;
  }

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
