const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const INFURA_ID = process.env.INFURA_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MNEMONIC_KEY = process.env.MNEMONIC_KEY;

module.exports = {
  networks: {
    // -------------- TESTNET ---------------------
    mumbai: {
      provider: () =>
        new HDWalletProvider(PRIVATE_KEY, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    smartChain: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC_KEY,
          `https://data-seed-prebsc-1-s1.binance.org:8545/`,
        ),
      network_id: 97,
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          PRIVATE_KEY,
          `https://kovan.infura.io/v3/${INFURA_ID}`,
        ),
      network_id: 42,
      gas: 8500000,
      gasPrice: 25000000000,
    },

    // -------------- MAIN NET ---------------------

    bsc: {
      provider: () =>
        new HDWalletProvider(PRIVATE_KEY, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 5,
      timeoutBlocks: 200,
      skipDryRun: true,
    },

    polygon: {
      provider: () =>
        new HDWalletProvider(PRIVATE_KEY, `https://polygon-rpc.com/`),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.0', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
