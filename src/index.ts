import url from 'url'
import http from 'http'
import https from 'https'
import fs from 'fs'

const parseUrl = (urlStr:string) => {
  const urlObj = url.parse(urlStr)
  const option = {
    protocol: urlObj.protocol,
    host: urlObj.host,
    hostname: urlObj.hostname,
    port: urlObj.port,
    method: 'GET',
    path: urlObj.path,
    headers: {},
    timeout: 10
  }
  console.log(option)
  return option;
}

const request = (options: http.RequestOptions) => new Promise<string>( (resolve,reject) => {
  const cb = (res: http.IncomingMessage) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        resolve(rawData);
      } catch (e) {
        reject(e);
      }
    });
  }

  const httpMod = options.protocol === 'https:' ? https.request : http.request;
  const req = httpMod(options, cb);
  req.on('error', e => reject(e));
  // req.write(data)
  req.end();
})

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
    const option = parseUrl(book.url);
    let req = await request(option);
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

const readJsonFile = (path: fs.PathLike) => {
  const book = fs.readFileSync(path)
  return JSON.parse(book.toString())
}

const readJsonDir = (path: fs.PathLike) => {
  const dirs = fs.readdirSync(path)
  return dirs.map(d => readJsonFile(path+'/'+d))
}

const init = () => {
  return {
    "sites": readJsonDir('data/sites'),
    "books": readJsonDir('data/books')
  }
}

const test = () => {
  const book = init()
  console.log(book)
  read(book.books[0]);
};

test();
