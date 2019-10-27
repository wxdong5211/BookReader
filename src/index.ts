import factory from './factory'

const test = () => {
  const r = factory.getReader()
  // r.updateAll()
  const book = r.get(1)
  console.log('get book = ', book)
  // const ret = book.updateDir()
  // console.log('updateDir ret = ', ret)
  // const ret = book.getChars()
  // console.log('getChars ret = ', ret)
  // const ret = book.getChar(0)
  // console.log('getChar ret = ', ret)
  const ret = book.updateChar(0)
  console.log('updateChar ret = ', ret)
};

test();
