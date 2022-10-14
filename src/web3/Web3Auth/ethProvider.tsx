import { SafeEventEmitterProvider } from '@web3auth/base';
import { ethers } from 'ethers';
import Web3 from 'web3';
import FundraiserFactory from 'contracts/FundraiserFactory.json';

const contractAddress = '0xB98e88d34229a306Ad58B47756c41400689aCeb4';

export interface IWalletProvider {
  getAccounts: () => Promise<any>;
  getBalance: (accountAddress: string) => Promise<any>;
  checkTxn: (txn: string) => Promise<any>;

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

const ethProvider = (provider: SafeEventEmitterProvider): IWalletProvider => {
  const getAccounts = async () => {
    try {
      if (provider === undefined) {
        console.error('ethProvider - getAccounts', provider);
        return;
      }

      console.warn('ethProvider - getAccounts', provider);

      const web3 = new Web3(provider as any);
      const accounts = await web3.eth.getAccounts();

      return accounts[0];
    } catch (error) {
      console.error('getAccounts Error', error);
    }
  };

  const getBalance = async (accountAddress: string) => {
    try {
      const web3 = new Web3(provider as any);
      // const address = (await web3.eth.getAccounts())[0];
      return parseFloat(
        web3.utils.fromWei(await web3.eth.getBalance(accountAddress)),
      ).toFixed(2);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const checkTxn = async (txn: string) => {
    console.log('called');
    const web3 = new ethers.providers.Web3Provider(provider as any);
    // const signer = web3.getSigner();
    try {
      const txnCheck = await web3.getTransactionReceipt(txn);
      console.log(txnCheck);
      return txnCheck;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const fundraiserList = async () => {
    console.log('called--');
    const web3 = new ethers.providers.Web3Provider(provider as any);
    const signer = web3.getSigner();
    try {
      const contract = new ethers.Contract(
        contractAddress,
        FundraiserFactory.abi,
        signer,
      );
      const fundraisers = await contract.fundraisers(10, 0).call();
      console.log('fundraisers listed---', fundraisers);
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const createFundraiser = async (
    name: string,
    linkToCompany: string,
    images: string,
    description: string,
    about: string,
    beneficiary: string,
  ) => {
    console.log('called--');
    const web3 = new ethers.providers.Web3Provider(provider as any);
    const signer = web3.getSigner();
    try {
      const contract = new ethers.Contract(
        contractAddress,
        FundraiserFactory.abi,
        signer,
      );
      const txn = await contract.createFundraiser(
        name,
        linkToCompany,
        images,
        description,
        about,
        beneficiary,
      );
      await txn.wait();
      alert('created successfully');
    } catch (e) {
      console.log(e);
    }
  };

  return {
    getAccounts,
    getBalance,
    checkTxn,
    createFundraiser,
    fundraiserList,
  };
};

export default ethProvider;
