import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserContract from 'contracts/Fundraiser.json';

const cc = require('cryptocompare');

const DonationList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async (fundraiser) => {
    try {
      const fund = fundraiser;
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const account = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(FundraiserContract.abi, fund);
      setWeb3(web3);
      setContract(instance);
      console.log('contract---', contract);
      setAccounts(account);
      console.log('accounts---', accounts);

      const donations = instance.methods
        .myDonations()
        .call({ from: accounts[0] });

      setUserDonations(donations);
      console.log('userDonations---', userDonations);

      await cc
        .price('ETH', ['USD'])
        .then((prices) => {
          exchangeRate = prices.USD;
          setExchangeRate(prices.USD);
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };
  const renderDonationsList = () => {
    var donations = userDonations;
    console.log('donations---', donations);
    if (donations === null) {
      return null;
    }

    const totalDonations = donations.length;
    let donationList = [];
    var i;
    for (i = 0; i < totalDonations; i++) {
      const ethAmount = web3.utils.fromWei(donations.values[i], 'ether');
      const userDonation = exchangeRate * ethAmount;
      const donationDate = donations.dates[i];
      donationList.push({
        donationAmount: userDonation.toFixed(2),
        date: donationDate,
      });
    }

    return donationList.map((donation) => {
      return (
        <div className="donation-list">
          <p>${donation.donationAmount}</p>
          <a>
            <Link
              className="donation-receipt-link"
              to={{
                pathname: '/receipts',
                state: {
                  fund: fundName,
                  donation: donation.donationAmount,
                  date: donation.date,
                },
              }}
            >
              Request Receipt
            </Link>
          </a>
        </div>
      );
    });
  };

  return <div className="donation-list">{renderDonationsList()}</div>;
};

export default DonationList;
