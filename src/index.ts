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

interface Charcter {
  url : string,
  title : string,
  create : Date,
  disOrder? : number,
  order : number
}

const read = async (book:Book) => {
  try {
    const option = request.parseUrl(book.url);
    let req = await request.request(option);
    const start = book.block.dirStart;
    const end = book.block.dirEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    const xx = req.match(/<a.*href=".*".*>.*<\/a>/gi)
    if(xx){
      const hrefStart = 'href="'
      let idx = 0
      const chars = xx.map(x => {
        let href = x.substr(x.indexOf(hrefStart) + hrefStart.length);
        href = href.substr(0, href.indexOf('"'))
        const title  = x.replace(/<\/?[^>]*>/g,'')
        const charcter = {
          url : href,
          title : title,
          create : new Date(),
          disOrder : idx,
          order : idx
        }
        idx ++
        console.log(charcter)
        return charcter
      });
    }
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
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
  read(book.books[0]);
};

test();
