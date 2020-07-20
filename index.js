const { table } = require('table')
const ethers = require('ethers')
require('dotenv').config()
const axios = require('axios')
let defaultroute = 'https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses='


let provider = ethers.getDefaultProvider()
const { tokenmap,abi } = require('./tokendata')
let contracts = new Map()
for(let [key,value] of tokenmap){
    console.log(key+':'+value)
    contracts.set(key,new ethers.Contract(value, abi, provider ))
}

let contractdata = new Map()
async function getData() { 

    for(let [key,value] of contracts){
        contractdata.set(key, {
            'Symbol': await value.symbol(),
            "Total Supply": (await value.totalSupply()).toString()
        })
    }
    console.log(contractdata)
    
}
let outputdata=[]
let data=[]
getData().then(function(){
    for(let key of contractdata.keys()){
        data.push(key) 
    }
    outputdata.push(data)
    let output = table(outputdata)
    console.log(output)
}).then(async function(){
    for(let [key,value] of tokenmap){
        contractdata.set(key, {
            'Price': (await axios.get(defaultroute+value+'&vs_currencies=usd')).data[value.toLowerCase()].usd
        })
    }
    console.log(contractdata)    
})




