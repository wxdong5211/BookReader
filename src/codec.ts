import iconv from 'iconv-lite'

export const encode = (txt: any, encode: string): Buffer => {
    return iconv.encode(txt, encode)
}

export const decode = (buffer: Buffer, encode: string): string => {
    return iconv.decode(buffer, encode)
}

