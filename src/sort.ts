import * as api from './api'

const compareChar = (a: api.Charcter, b: api.Charcter): number => {
    //TODO need fixed ascii order is not right
    return a.title === b.title ? 0 : (a.title > b.title ? 1 : -1);
}

export const sortChars = (chars: Array<api.Charcter>) : Array<api.Charcter> => {
    const newChars = [...chars]
    newChars.sort(compareChar)
    return newChars;
}

