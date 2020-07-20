const { table } = require("table");
const ethers = require("ethers");
require("dotenv").config();
const { tokenmap, abi } = require("./tokendata");
const { default: Axios } = require("axios");
const api = 'https://api.coingecko.com/api/v3/coins/ethereum/contract/'

let provider = ethers.getDefaultProvider();
let contracts = new Map();
let currencydata = new Map();
let tabledata = [["Currency", "Symbol", "Supply","Price"]];

const makeContract = () => {
  for (let [key, value] of tokenmap) {
    contracts.set(key, new ethers.Contract(value, abi, provider));
  }
};

const getData = async () => {
  for (let [key, value] of contracts) {
    currencydata.set(key, {
      Name: await value.name(),
      Symbol: await value.symbol(),
      Supply: (await value.totalSupply()).toString(),
      Price: '$'+(await Axios.get(api+tokenmap.get(key))).data['market_data']['current_price']['usd']
    });
  }
};

const makeTable = () => {
  for (let value of currencydata.values()) {
    tabledata.push(Array(value["Name"], value["Symbol"], value["Supply"],value["Price"]));
  }

  let output = table(tabledata);
  console.log(output);
};

const main = async () => {
  makeContract();
  await getData();
  makeTable();
};
main();
