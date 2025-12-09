require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: ["0x325d56647f038d54abc2ea1bf6cca21b5504bd4a07b4019f0f595ea4d2413273"]
    }
  }
};
