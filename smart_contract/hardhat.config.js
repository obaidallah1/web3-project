require('dotenv').config(); 
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_URL, 
      accounts: [process.env.ACCOUNT_PRIVATE_KEY] 
    }
  }
};