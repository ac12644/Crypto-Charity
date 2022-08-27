import React, { useState, useEffect } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

import { ProjectDialog } from './components';

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserContract from 'contracts/Fundraiser.json';

const cc = require('cryptocompare');

const FundraiserCard = ({ fundraiser }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [linkToCompany, setLinkToCompany] = useState(null);
  const [description, setDescription] = useState(null);
  const [about, setAbout] = useState(null);
  const [images, setImages] = useState('');
  const [fundName, setFundName] = useState(null);
  const [totalDonations, setTotalDonations] = useState(null);
  const [totalDonationsEth, setTotalDonationsEth] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [donationAmount, setDonationAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [userDonations, setUserDonations] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const ethAmount = (donationAmount / exchangeRate || 0).toFixed(4);

  useEffect(() => {
    if (fundraiser) {
      init(fundraiser);
    }
  }, [fundraiser]);

  const init = async (fundraiser) => {
    try {
      const fund = fundraiser;
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const account = await web3.eth.getAccounts();

      console.log('accounts---', account);

      const instance = new web3.eth.Contract(FundraiserContract.abi, fund);
      setWeb3(web3);
      setContract(instance);
      setAccounts(account);

      console.log('----account0--', accounts[0]);

      setFundName(await instance.methods.name().call());
      setImages(await instance.methods.images().call());
      setDescription(await instance.methods.description().call());
      setAbout(await instance.methods.about().call());
      setLinkToCompany(await instance.methods.linkToCompany().call());
      const totalDonation = await instance.methods.totalDonations().call();

      console.log('---------data--------');
      console.log(fundName, images, description, about, linkToCompany);

      await cc
        .price('ETH', ['USD'])
        .then((prices) => {
          exchangeRate = prices.USD;
          setExchangeRate(prices.USD);
        })
        .catch(console.error);

      const eth = web3.utils.fromWei(web3.utils.toBN(totalDonation), 'ether');

      setTotalDonationsEth(parseFloat(eth).toFixed(4));

      console.log('eth--', eth);
      console.log('totalDonationsEth', totalDonationsEth);

      const dollarDonationAmount = exchangeRate * eth;
      setTotalDonations(dollarDonationAmount.toFixed(2));

      const userDonation = await instance.methods
        .myDonations()
        .call({ from: accounts[0] });
      setUserDonations(userDonation);

      console.log('userDonations', userDonations.values, userDonations.dates);
      const isUser = accounts[0];
      const isOwner = await instance.methods.owner().call();
      if (isOwner === accounts[0]) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload();
  });
  const withdrawFunds = async () => {
    await contract.methods.withdraw().send({
      from: accounts[0],
    });

    alert('Funds Withdrawn!');
  };

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Box display={'block'} width={1} height={1}>
        <Card
          sx={{
            width: 1,
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
            bgcolor: 'transparent',
            backgroundImage: 'none',
          }}
        >
          <CardMedia
            title={fundName}
            image={images}
            sx={{
              position: 'relative',
              height: 320,
              overflow: 'hidden',
              borderRadius: 2,
              filter:
                theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none',
            }}
          >
            <Stack
              direction={'row'}
              spacing={1}
              sx={{
                position: 'absolute',
                top: 'auto',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: theme.palette.success.light,
                  paddingY: '4px',
                  paddingX: '8px',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant={'caption'}
                  fontWeight={700}
                  sx={{
                    color: theme.palette.common.white,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  Raised: {totalDonations || '0'}
                </Typography>
              </Box>
            </Stack>
          </CardMedia>
          <Box marginTop={1}>
            <Typography fontWeight={700} sx={{ textTransform: 'uppercase' }}>
              {fundName}
            </Typography>
          </Box>
          <Stack marginTop={1} spacing={1} direction={'row'}>
            <Button
              color={'primary'}
              size={'large'}
              fullWidth
              sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
              onClick={() => setOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width={20}
                height={20}
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button
              color={'primary'}
              size={'large'}
              fullWidth
              sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width={20}
                height={20}
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Stack>
        </Card>
        <ProjectDialog
          open={open}
          key={fundraiser}
          onClose={() => setOpen(false)}
          web3={web3}
          exchangeRate={exchangeRate}
          totalDonations={totalDonations}
          totalDonationsEth={totalDonationsEth}
          images={images}
          name={fundName}
          description={description}
          about={about}
          linkToCompany={linkToCompany}
          contract={contract}
          accounts={accounts[0]}
          withdrawFunds={withdrawFunds}
          isOwner={isOwner}
          userDonations={userDonations}
        />
      </Box>
    </Grid>
  );
};

export default FundraiserCard;
