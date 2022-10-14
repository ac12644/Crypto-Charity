import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/web3auth';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import {
  ADAPTER_EVENTS,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import ethProvider, { IWalletProvider } from './ethProvider';
import { CHAIN_CONFIG, CHAIN_TYPES, WalletContextValues } from './config';

const clientId: string = process.env.WEB3AUTH_CLIENT_ID as string;
interface WalletProviderProps {
  chainType: CHAIN_TYPES;
  children: React.ReactNode;
}

export const WalletContext = createContext<WalletContextValues>({
  web3AuthType: null,
  isLoading: false,
  connected: false,
  accountAddress: null,
  accountBalance: null,
  login: async () => {},
  logout: async () => {},
  createFundraiser: async () => {},
  fundraiserList: async () => {},
});

function Web3Context({ children, chainType }: WalletProviderProps) {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IWalletProvider | null>(null);
  const [user, setUser] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [web3AuthType, setWeb3AuthType] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  const setWalletProvider = useCallback(
    (web3authProvider: SafeEventEmitterProvider) => {
      console.warn(
        'WalletContext - setWalletProvider [chainType] - Setting provider - ethProvider',
        web3authProvider,
      );
      const walletProvider = ethProvider(web3authProvider);
      setProvider(walletProvider);
    },
    [chainType],
  );

  useEffect(() => {
    if (!provider) {
      console.error(
        'WalletContext -useEffect [provider, chainType] - provider is null',
      );
    } else {
      const initAccountDetails = async () => {
        try {
          console.warn(
            'WalletContext -useEffect [provider, chainType] - TRYING to getAccounts',
          );
          const accountAddress = await provider.getAccounts();
          setAccountAddress(accountAddress);
          const currentBalance = await provider.getBalance(accountAddress);
          setAccountBalance(currentBalance);
          console.log();
        } catch (e) {
          throw e;
        }
      };

      initAccountDetails();
    }
  }, [provider, chainType]);

  useEffect(() => {
    const subscribeAuthEvents = (web3auth: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
        console.log('XXX - WalletContext -ADAPTER_EVENTS.CONNECTED', data);
        setIsLoading(false);
        setConnected(true);
        setUser(data);
        console.log('WalletContext -ADAPTER_EVENTS.CONNECTED', user);
        setWalletProvider(web3auth.provider as SafeEventEmitterProvider);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        setIsLoading(true);
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log(
          'WalletContext - useEffect [] - subscribeAuthEvents - ADAPTER_EVENTS.DISCONNECTED',
        );
        setIsLoading(false);
        setConnected(false);
        setUser(null);
        setProvider(null);
        setAccountAddress(null);
        setAccountBalance(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error: unknown) => {
        console.error(
          'WalletContext - useEffect [] - subscribeAuthEvents - ADAPTER_EVENTS.ERRORED - Some error or user has cancelled login request',
          error,
        );
        throw error;
      });
    };

    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: CHAIN_CONFIG[chainType],
          uiConfig: {
            theme: 'light',
            appLogo:
              'https://github.com/ac12644/Fundraising-Dapp/blob/main/images/fundraise-light.png?raw=true',
          },
        });

        const openLoginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: 'testnet',
            uxMode: 'popup',
            whiteLabel: {
              name: 'Fundraiser',
              logoLight:
                'https://github.com/ac12644/Fundraising-Dapp/blob/main/images/fundraise-light.png?raw=true',
              logoDark:
                'https://github.com/ac12644/Fundraising-Dapp/blob/main/images/fundraise-dark.png?raw=true',
              defaultLanguage: 'en',
              dark: false,
            },
          },
        });

        web3auth.configureAdapter(openLoginAdapter);
        subscribeAuthEvents(web3auth);
        setWeb3Auth(web3auth);
        setWeb3AuthType('Login');
        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: 'openlogin',
              showOnModal: false, // turn-off social login button
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [chainType]);

  const login = async () => {
    try {
      setIsLoading(true);
      if (!web3Auth) {
        console.error('WalletContext login - ', 'no web3auth');
        return;
      }
      const localProvider = await web3Auth.connect();
      setWalletProvider(localProvider!);
    } catch (e) {
      console.error('WalletContext login - ', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      if (!web3Auth) {
        console.error('WalletContext logout - ', 'no web3auth');
        return;
      }
      await web3Auth.logout();
    } catch (e) {
      console.error('WalletContext logout - ', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fundraiserList = async () => {
    setIsLoading(true);
    if (!provider) {
      alert('provider not initialized');
      return;
    }
    await provider.fundraiserList();
    setIsLoading(false);
  };

  const createFundraiser = async (
    name: string,
    linkToCompany: string,
    images: string,
    description: string,
    about: string,
    beneficiary: string,
  ) => {
    setIsLoading(true);
    if (!provider) {
      alert('provider not initialized');
      return;
    }
    await provider.createFundraiser(
      name,
      linkToCompany,
      images,
      description,
      about,
      beneficiary,
    );
    setIsLoading(false);
  };

  const context: WalletContextValues = {
    web3AuthType,
    isLoading,
    connected,
    accountAddress,
    accountBalance,
    login,
    logout,
    createFundraiser,
    fundraiserList,
  };

  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  );
}

export default Web3Context;
