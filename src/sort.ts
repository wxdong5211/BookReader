import * as api from './api'

const numDict: any = {
    '零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,
    '两':2
}
const unitDict: any = {'十':1,'百':2,'千':3,'万':4,'亿':8}

const str2num = (chars:Array<string>):number =>{
    let c = null
    const len = chars.length
    const nums = chars.map(c => numDict[c]|0)
    for(let i = 0; i< len; i++){
        c = chars[i]
        const unitIdx = unitDict[c]
        if(unitIdx != null){
            const unitNum = Math.pow(10, unitIdx)
            if(i === 0){
                nums[0] = unitNum
            }else{
                nums[i-1] *= unitNum
            }
        }
    }
    return nums.reduce((p,c)=>p+c,0)
}

const compareChar = (a: api.Charcter, b: api.Charcter): number => {
    const aNum = title2num(a.title)
    const bNum = title2num(b.title)
    return aNum === bNum ? 0 : (aNum > bNum ? 1 : -1);
}

const compareNumChar = (a: api.Charcter, b: api.Charcter): number => {
    const aNum = numTitle2num(a.title)
    const bNum = numTitle2num(b.title)
    return aNum === bNum ? 0 : (aNum > bNum ? 1 : -1);
}

export const title2num = (t:string):number => {
    const chars = t.split('')
    const nums = []
    let oneNum = []
    let c = null;
    for(let i in chars){
        c = chars[i]
        if(numDict[c] != null || unitDict[c] != null){
            oneNum.push(c)
        }else{
            if(oneNum.length > 0){
                nums.push(oneNum)
                oneNum = []
            }
        }
    }
    return nums.map(str2num)[0]
}

export const numTitle2num = (t:string):number => {
    const chars = t.split('')
    const nums = []
    let oneNum = []
    let c = null;
    for(let i in chars){
        c = chars[i]
        if(/\d/.test(c)){
            oneNum.push(c)
        }else{
            if(oneNum.length > 0){
                nums.push(oneNum)
                oneNum = []
            }
        }
    }
    return nums.map(x => parseInt(x.join('')))[0]
}

export const sortChars = (chars: Array<api.Charcter>) : Array<api.Charcter> => {
    const newChars = [...chars]
    newChars.sort(compareChar)
    return newChars;
}

export const sortNumChars = (chars: Array<api.Charcter>) : Array<api.Charcter> => {
    const newChars = [...chars]
    newChars.sort(compareNumChar)
    return newChars;
}

