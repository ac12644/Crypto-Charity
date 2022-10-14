import { CHAIN_NAMESPACES } from '@web3auth/base';
import WalletProvider, { WalletContext } from './AuthContext';

export const CHAIN_CONFIG = {
  polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com/',
    chainId: '0x89',
    displayName: 'Polygon Mainnet',
    ticker: 'matic',
    tickerName: 'Matic',
  },
  mumbai: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: 'https://rpc-mumbai.matic.today/',
    blockExplorer: 'https://mumbai.polygonscan.com/',
    chainId: '0x13881',
    displayName: 'Mumbai Testnet',
    ticker: 'matic',
    tickerName: 'Matic',
  },
};

export enum CHAIN_TYPES {
  polygon = 'polygon',
  mumbai = 'mumbai',
}

export interface WalletContextValues {
  web3AuthType: string | null;
  isLoading: boolean;
  connected: boolean;
  accountAddress: string | null;
  accountBalance: number | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  createFundraiser: (
    name: string,
    linkToCompany: string,
    images: string,
    description: string,
    about: string,
    beneficiary: string,
  ) => Promise<void>;
  fundraiserList: () => Promise<any>;
}

export { WalletContext, WalletProvider };
