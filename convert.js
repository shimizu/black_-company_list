const pdf_table_extractor = require("pdf-table-extractor")
const d3 = require("d3-dsv") 
 
const fileName = process.argv[2] || null

const shaping = (json) => {
    const head = json.pageTables[0].tables[0]
    
    const pageTables = json.pageTables.map( page => page.tables.filter((tr,i) => i > 0) )
    
    const flattenTable = Array.prototype.concat.apply([], pageTables)
    
    const deletedLF = flattenTable.map( tr => tr.map(td => td.replace(/\n/g, "")) )
    

    const cleand = deletedLF.map((tr => {
        if (tr[1]==="" && tr[2]==="" && tr[3] ==""){
            let split = tr[0].split(/\s/).filter(s => s !== "" )
            
            if(split.length > 4){
                split[0] += split[1]
                delete split[1]
                let tmp = split.filter(s => s !== null)
                split = tmp
            }
            tr[0] = split[0]
            tr[1] = split[1]
            tr[2] = split[2]
            tr[3] = split[3]
            
        }
        else if (tr[1]==="" && tr[2]===""){
            let split = tr[0].split(/\s/).filter(s => s !== "" )
            if(split.length > 3){
                split[0] += split[1]
                delete split[1]
                let tmp = split.filter(s => s !== null)
                split = tmp
            }
            tr[0] = split[0]
            tr[1] = split[1]
            tr[2] = split[2]
            
        }
        else if (tr[2]==="" && tr[3]===""){
            let split = tr[1].split(/\s/).filter(s => s !== "" )
            if(split.length > 3){
                split[0] += split[1]
                delete split[1]
                let tmp = split.filter(s => s !== null)
                split = tmp
            }
            tr[1] = split[0]
            tr[2] = split[1]
            tr[3] = split[2]
            
            
        }
        else if (tr[2]==""){
            let split = tr[1].split(/\s/).filter(s => s !== "" )
            tr[1] = split[0]
            tr[2] = split[1]        
        }
        else  if (tr[3] ==""){
            let split = tr[2].split(/\s/).filter(s => s !== "" )
            tr[2] = split[0]
            tr[3] = split[1]        
        }
        
        return tr
    }))
    
    const result = cleand.map(d => {
        let obj = {}
        head.forEach((key,i) => {
            obj[key] = d[i]
        })
        return obj
    })
        
    return result
}


const success = (result) => {
    const json = shaping(result)    
    const csv = d3.csvFormat(json)
    
    console.log('\ufeff'+csv)
}
 
const error = (err) => {
   console.error('Error: ' + err)
}


if(!fileName){
    console.log("ファイル名を指定してください")
}else{
    pdf_table_extractor(fileName,success,error)    
}

