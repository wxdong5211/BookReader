import * as api from './api'
import Reader from './reader'

class BRFactory implements api.BRFactory {
  getReader() : api.Reader {
    return new Reader()
  }
}

const factory = new BRFactory()

export default factory;
