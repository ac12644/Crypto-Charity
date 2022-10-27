const supportedChains = [
  {
    name: 'Polygon Mumbai',
    short_name: 'matic',
    chain: 'MATIC',
    network: 'mumbai',
    chain_id: 80001,
    network_id: 80001,
    rpc_url: 'https://rpc-mumbai.maticvigil.com',
    native_currency: {
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Polygon',
    short_name: 'matic',
    chain: 'MATIC',
    network: 'mumbai',
    chain_id: 137,
    network_id: 137,
    rpc_url: 'https://polygon-rpc.com/',
    native_currency: {
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
];

export default supportedChains;
