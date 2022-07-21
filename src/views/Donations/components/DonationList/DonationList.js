import React, { useState, useEffect } from 'react';

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserContract from 'contracts/Fundraiser.json';

const cc = require('cryptocompare');

const DonationList = () => {
    const [ web3, setWeb3 ] = useState(null);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts ] = useState([]);
    const [ userDonations, setUserDonations ] = useState(null);
    const [ exchangeRate, setExchangeRate ] = useState(null);

    useEffect (() => {

            init();
        
    }, []);
  
    const init = async (fundraiser) => {
        try {
            const fund = fundraiser;
            const provider = await detectEthereumProvider();
            const web3 = new Web3(provider);
            const account = await web3.eth.getAccounts();
    
            console.log('accounts---', account);
    
            const instance = new web3.eth.Contract(
              FundraiserContract.abi,
              fund
            );
            
            setWeb3 (web3);
            setContract (instance);
            setAccounts (account);

            console.log('web3--', web3, 'contract--', contract, 'accounts---', account);

          const donations = await instance.methods.myDonations().call({ from: accounts[0] });
          console.log('donations--', donations);

          console.log('userDonations',donations);
          setUserDonations(donations);

          await cc.price('ETH', ['USD'])
          .then( prices => { 
            exchangeRate = prices.USD; 
            setExchangeRate(prices.USD); 
          }).catch(console.error);

        } catch (error) {
            console.error(error);
        }
    }

    var donations = userDonations;
    if (donations === null) {
        return null;
    };

    const totalDonations = donations.length;
    let donationList = [];
    var i;
    for (i = 0; i < totalDonations; i++) {
        const ethAmount = web3.utils.fromWei(donations.values[i], 'ether');
        const userDonation = exchangeRate * ethAmount;
        const donationDate = donations.dates[i];
        donationList.push({ donationAmount: userDonation.toFixed(2), date: donationDate });
    }

    return donationList.map((donation) => {
      return (
        <div className="donation-list">
          <h1>list</h1>
        </div>
      )
    })
  }

  export default DonationList;
