require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/QVYMFQnzpb8yUrWOxAQpO5sGTOLIu91g", 
      accounts: ["011fa053af4eec3403628250ded248eb0e416b44c2ddaa29e3030f6779ad9717"] 
    }
  }
};