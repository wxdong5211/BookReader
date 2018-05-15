import url from 'url'
import http from 'http'
import https from 'https'

const parseUrl = (urlStr:string) : http.RequestOptions => {
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

const request = (options: http.RequestOptions) : Promise<string> => new Promise<string>( (resolve,reject) => {
  const cb = (res: http.IncomingMessage) => {
    if(options.host === 'www.qiushu.cc'){
      res.setEncoding('gbk');
    } else {
      res.setEncoding('utf8');
    }
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

export default {request, parseUrl};
