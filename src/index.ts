import factory from './factory'

const test = async () => {
  // await search('我必将加冕为王')
  // await updateDirs()
  // await updateChars()
  await exportChars()
}

const search = async (name: string) => {
  const r = factory.getReader()
  const books = await r.search(name)
  console.log(books)
  if(books && books.length == 1){
    r.add(books[0])
    // r.add({
    //   id: 37,
    //   name:'我老婆是邪神',
    //   url:'https://www.boquku.com/book/125937/'
    // })
  }

}

const test1 = async () => {
  const r = factory.getReader()
  // r.updateAll()

  const book = r.get(18)
  console.log('get book = ', book)
  // r.del(book)
  const ret = await book.updateDir()
  console.log('updateDir ret = ', ret)
  // const ret = book.getChars()
  // console.log('getChars ret = ', ret)
  // const ret1 = sortChars(ret)
  // ret1.forEach(r=>console.log(r.title))
  
  // const ret = book.getChar(0)
  // console.log('getChar ret = ', ret)
  // const ret = book.getCharsScope(1,3)
  // console.log('getCharsScope ret = ', ret)
  // const idx = 233;
  // const ret1 = await book.updateChar(idx)
  // console.log('updateChar ret = ', ret1)
  // const ret2 = book.exportChar(idx)
  // console.log('exportChar ret = ', ret2)
  // const ret = book.updateCharScope(1, 10)
  // console.log('updateCharScope ret = ', ret)
  // const ret = book.exportCharScope(1, 5)
  // console.log('exportCharScope ret = ', ret)
  // console.log('getCharsLength ret = ', book.getCharsLength())
  // const ret = await book.updateCharScope(691)
  // console.log('updateCharScope ret = ', ret)
  // const ret = book.exportCharScope(100)
  // console.log('exportCharScope ret = ', ret)
  // book.updateCharState(1, 1)
  // console.log('updateCharState')
  // book.updateCharStateScope(0, 0)
  // console.log('updateCharStateScope')
  // const ret = book.exportTxtScope(691)
  // console.log('exportTxtScope ret = ', ret)
};

const updateChars = async () => {
  const r = factory.getReader()
  r.updateChars()
};

const exportChars = async () => {
  const r = factory.getReader()
  r.exportChars()
};

const updateDirs = async () => {
  const r = factory.getReader()
  r.updateDirs()
};

test();
