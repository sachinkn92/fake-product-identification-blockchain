require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        "0x6f78d3638a7d4c94963f9060f5e3166feac082d42ee2dbd166a884f952287b36"
      ]
    }
  }
};
