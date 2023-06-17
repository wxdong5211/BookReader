import url from 'url'
import http from 'http'
import https from 'https'
import zlib from 'zlib'

import {decode} from './codec'

export const parseUrl = (urlStr:string) : http.RequestOptions => {
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
    timeout: 10000
  }
  return option;
}

export const request = (options: http.RequestOptions &  { rejectUnauthorized?: boolean }, data?: any) : Promise<string> => new Promise<string>( (resolve,reject) => {
  const cb = (res: http.IncomingMessage) => {
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
        const meta = tryStr.match(/<meta\shttp-equiv="content-type"\scontent="text\/html;\s*charset=([^\"]*)"\s*\/?>/i)
        if(meta && meta.length > 1 && meta[1] !== 'utf-8'){
          resolve(decode(newBuffer, meta[1]));
        }else{
          resolve(tryStr);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  const httpMod = options.protocol === 'https:' ? https.request : http.request;
  if(options.protocol === 'https:'){
    options.rejectUnauthorized = false;
    // pool: false,
    // strictSSL: false,
    // rejectUnauthorized: false,
  }
  const req = httpMod(options, cb);
  req.on('timeout',function(){
    // if(req.res){
    //     req.res('abort');
    // }
    req.abort()
  });
  req.on('error', e => reject(e));
  if(data){
    req.write(data)
  }
  req.end();
})

export const readHtml = async(url: string) : Promise<string> => {
  const option = parseUrl(url);
  option.headers = {
    'user-agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
  }
  const req = await request(option);
  return req;
}

