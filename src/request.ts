import url from 'url'
import http from 'http'
import https from 'https'
import zlib from 'zlib'

import iconv from 'iconv-lite'

const parseUrl = (urlStr:string) : http.RequestOptions => {
  const urlObj = url.parse(urlStr)
  const option = {
    protocol: urlObj.protocol,
    host: urlObj.host,
    hostname: urlObj.hostname,
    port: urlObj.port,
    method: 'GET',
    path: urlObj.path,
    headers: {
      // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
    },
    timeout: 10
  }
  console.log(option)
  return option;
}

const request = (options: http.RequestOptions) : Promise<string> => new Promise<string>( (resolve,reject) => {
  const cb = (res: http.IncomingMessage) => {
    // if(options.host === 'www.qiushu.cc'){
    //   res.setEncoding('gbk');
    // } else {
      // res.setEncoding('utf8');
    // }
    const rawData: Array<Buffer> = [];
    res.on('data', (chunk) => {
      rawData.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    res.on('end', () => {
      try {
        let newBuffer = Buffer.concat(rawData);
        if(res.headers['content-encoding'] === 'gzip'){
          newBuffer = zlib.gunzipSync(newBuffer)
        }
        const tryStr = newBuffer.toString()
        const meta = tryStr.match(/<meta\shttp-equiv="Content-Type"\scontent="text\/html;\scharset=([^\"]*)"\s\/>/i)
        if(meta && meta.length > 1 && meta[1] !== 'utf-8'){
          resolve(iconv.decode(newBuffer, meta[1]));
        }else{
          resolve(tryStr);
        }
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
