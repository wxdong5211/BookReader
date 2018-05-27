import * as api from './api'
import reader from './reader'

class BRFactory implements api.BRFactory {
  getReader() : api.Reader {
    return new reader()
  }
}

const factory = new BRFactory()

export default factory;
