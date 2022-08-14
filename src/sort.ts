import * as api from './api'

const numArr = ['零','一','二','三','四','五','六','七','八','九']
const unitDict: any = {'十':1,'百':2,'千':3,'万':4,'亿':8}

const str2num = (chars:Array<string>):number =>{
    let c = null
    const len = chars.length
    const nums = chars.map(c => numArr.indexOf(c))
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
    return nums.filter(n=>n!==-1).reduce((p,c)=>p+c,0)
}

const compareChar = (a: api.Charcter, b: api.Charcter): number => {
    const aNum = title2num(a.title)
    const bNum = title2num(b.title)
    return aNum === bNum ? 0 : (aNum > bNum ? 1 : -1);
}

export const title2num = (t:string):number => {
    const chars = t.split('')
    const nums = []
    let oneNum = []
    let c = null;
    for(let i in chars){
        c = chars[i]
        if(numArr.indexOf(c) !== -1 || unitDict[c] != null){
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

export const sortChars = (chars: Array<api.Charcter>) : Array<api.Charcter> => {
    const newChars = [...chars]
    newChars.sort(compareChar)
    return newChars;
}

