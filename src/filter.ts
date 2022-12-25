import file from './file'

const filterData = file.readJsonFile('data/filter.json') || {}


export const clearContents = (content: string) : string => {
    const clearContents: Array<string> = filterData.clearContents || [];
    let newContent = content;
    clearContents.forEach(cc=>{
        newContent = newContent.replace(cc,'');
    });
    return newContent;
}