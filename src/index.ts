import factory from './factory'

const test = () => {
  const r = factory.getReader()
  r.updateAll()
};

test();
