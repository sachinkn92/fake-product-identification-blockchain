require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        "0xf17e8c8423dfcbfc9ac74e2bbe27a2dfba8276b51ba005d51760738284db4c11"
      ]
    }
  }
};
