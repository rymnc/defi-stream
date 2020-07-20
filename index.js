const { table } = require("table");
const ethers = require("ethers");
require("dotenv").config();

let provider = ethers.getDefaultProvider();
const { tokenmap, abi } = require("./tokendata");
let contracts = new Map();
let currencydata = new Map();
let tabledata = [['Currency','Symbol','Supply']]

const makeContract = () => {
  for (let [key, value] of tokenmap) {
    contracts.set(key, new ethers.Contract(value, abi, provider));
  }
};

const getData = async () => {
  for (let [key, value] of contracts) {
    currencydata.set(key, {
      'Name': await value.name(),
      'Symbol': await value.symbol(),
      'Supply': (await value.totalSupply()).toString(),
    });
  }
};

const makeTable = () =>{
    let names = []
    let symbols = []
    let supplies = []
    for(let value of currencydata.values()){
  
        tabledata.push(Array(value['Name'],value['Symbol'],value['Supply']))
    }

    let output = table(tabledata)
    console.log(output)
    
}

const main = async () => {
  makeContract();
  await getData();
  makeTable()
};
main();
