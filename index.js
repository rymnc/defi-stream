const { table } = require('table')
const ethers = require('ethers')
require('dotenv').config()


let provider = ethers.getDefaultProvider()
const { tokenmap,abi } = require('./tokendata')
let contracts = new Map()
for(let [key,value] of tokenmap){
    console.log(key+':'+value)
    contracts.set(key,new ethers.Contract(value, abi, provider ))
}

let contractdata = new Map()
const getData = async() =>{

    for(let [key,value] of contracts){
        contractdata.set(key, {
            'Symbol': await value.symbol(),
            "Total Supply": (await value.totalSupply()).toString()
        })
    }
    
}
getData().then(function(){
    let data=[];
    for(let key of contractdata.keys()){
        data.push(key) 
        console.log(key)
    }
    console.log(data)
})


