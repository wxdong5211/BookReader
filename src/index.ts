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
  // const ret1 = sortChars(ret)
  // ret1.forEach(r=>console.log(r.title))
  
  // const ret = book.getChar(0)
  // console.log('getChar ret = ', ret)
  // const ret = book.getCharsScope(1,3)
  // console.log('getCharsScope ret = ', ret)
  // const idx = 953;
  // const ret1 = book.updateChar(idx)
  // console.log('updateChar ret = ', ret1)
  // const ret2 = book.exportChar(idx)
  // console.log('exportChar ret = ', ret2)
  // const ret = book.updateCharScope(1, 10)
  // console.log('updateCharScope ret = ', ret)
  // const ret = book.exportCharScope(1, 5)
  // console.log('exportCharScope ret = ', ret)
  // console.log('getCharsLength ret = ', book.getCharsLength())
  // const ret = book.updateCharScope(953)
  // console.log('updateCharScope ret = ', ret)
  // const ret = book.exportCharScope(100)
  // console.log('exportCharScope ret = ', ret)
  // book.updateCharState(1, 1)
  // console.log('updateCharState')
  // book.updateCharStateScope(0, 953)
  // console.log('updateCharStateScope')
  const ret = book.exportTxtScope(953)
  console.log('exportTxtScope ret = ', ret)
};

test();
