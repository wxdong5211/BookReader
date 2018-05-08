import url from 'url'
import http from 'http'
import https from 'https'

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
  req.on('error', function (e) {
    reject(e);
  });
  // req.write(data)
  req.end();
})

interface Site {
  host : string,
  protocol? : string,
  encode? : string,
  interval? : number
}

interface Book {
  url : string,
  method? : string
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
    const start = '<div id="yulan">';
    const end = '</div>';
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    const xx = req.match(/<a.*href=".*".*>.*<\/a>/gi)
    xx!.forEach(x => {
        console.log(x)
    });

  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
}

const test = () => {
  read({url:'http://www.80txt.com/txtml_69001.html'});
};

test();
