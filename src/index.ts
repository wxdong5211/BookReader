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

const request = (urlStr:string) => new Promise( (resolve,reject) => {
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

  const option = parseUrl(urlStr);
  const httpMod = option.protocol === 'https:' ? https.request : http.request;
  const req = httpMod(option, cb);
  req.on('error', function (e) {
    reject(e);
  });
  // req.write(data)
  req.end();
})

const test = async () => {
  try {
    const req = await request('https://www.baidu.com');
    console.log(req)
  } catch (e) {
    console.log('problem with request: ' + e.message);
  }
};

test();
