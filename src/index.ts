import fs from 'fs'
import http from 'http'

console.log('hi123asdasd')
const x = http.get('http://www.baidu.com', res => {
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      // const parsedData = JSON.parse(rawData);
      console.log(rawData);
    } catch (e) {
      console.error(e.message);
    }
  });
})
