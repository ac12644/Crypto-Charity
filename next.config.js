module.exports = {
  swcMinify: true,
  env: {
    INFURA_IPFS_ID: process.env.INFURA_IPFS_ID,
    INFURA_IPFS_SECRET: process.env.INFURA_IPFS_SECRET,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    MNEMONIC_KEY: process.env.MNEMONIC_KEY,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  },
};
