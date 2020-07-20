const { table } = require("table");
const ethers = require("ethers");
require("dotenv").config();
const axios = require("axios");
let defaultroute =
  "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=";

let provider = ethers.getDefaultProvider();
const { tokenmap, abi } = require("./tokendata");
let contracts = new Map();
for (let [key, value] of tokenmap) {
  contracts.set(key, new ethers.Contract(value, abi, provider));
}

let contractdata = new Map();

function to_poll() {
  let outputdata = [];
  let data = [];
  for (let key of contractdata.keys()) {
    data.push(key);
  }
  outputdata.push(data);
  async function updatePrice() {
    let prices = [];
    for (let [key, value] of tokenmap) {
      let price = (await axios.get(defaultroute + value + "&vs_currencies=usd"))
        .data[value.toLowerCase()].usd;
      contractdata.set(key, {
        Price: "$" + price,
      });
      prices.push("$" + price);
    }
    outputdata.push(prices);
    try {
      let output = table(outputdata);
      console.log(output);
    } catch {
      console.log("Startup...");
    }
  }
  updatePrice();
}
let poller = setInterval(() => {
  to_poll();
}, 10000);
