require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        "0x89eb7604fea51064c7a13da5dde5b09c537a60667c7c3678359e8d08592c5c0a"
      ]
    }
  }
};
