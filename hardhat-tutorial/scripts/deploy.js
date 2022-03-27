const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS } = require("../constants");

async function main() {
    const cryptoDevTokenAddress = CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS;
    /*
    Contract Factory
    */
   const exchangeContract = await ethers.getContractFactory("Exchange");

   // here we deploy
   const deployedExchangeContract = await exchangeContract.deploy(
       cryptoDevTokenAddress
   );
   await deployedExchangeContract.deployed();

   // print the address of the deployed contract
   console.log("Exchange Contract Address:", deployedExchangeContract.address);
}

// Call the main function and catch any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });