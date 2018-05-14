import request from './request'
import file from './file'

interface Block {
  dirStart: string,
  dirEnd: string
}

interface Site {
  host : string,
  protocol? : string,
  encode? : string,
  interval? : number,
  block: Block
}

interface Book {
  url : string,
  method? : string,
  block: Block
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

const readDir = async (book:Book) : Promise<Array<Charcter>>  => {
  const option = request.parseUrl(book.url);
  let req = await request.request(option);
  const start = book.block.dirStart;
  const end = book.block.dirEnd;
  req = req.substr(req.indexOf(start) + start.length);
  req = req.substr(0, req.indexOf(end));
  const dirHtml = req.match(/<a.*href=".*".*>.*<\/a>/gi)
  if(dirHtml){
    const hrefStart = 'href="'
    let idx = 0
    return dirHtml.map(x => {
      let href = x.substr(x.indexOf(hrefStart) + hrefStart.length);
      href = href.substr(0, href.indexOf('"'))
      const title  = x.replace(/<\/?[^>]*>/g,'')
      const charcter = {
        url : href,
        title : title,
        create : new Date(),
        disOrder : idx,
        order : idx,
        state : CharcterState.Init
      }
      idx ++
      return charcter
    });
  }
  return [];
}

const updateDir = async (book:Book) => {
  try {
    const chars = await readDir(book);
    console.log(chars)
    for (let x in chars) {
      await sleep(1000)
      console.log(new Date())
      console.log(chars[x])
    }
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
}

const writeBook = (book:Book) => {
  file.writeFile('data/test.json', JSON.stringify(book, null, 2))
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
  writeBook(book.books[0])
};

test();
