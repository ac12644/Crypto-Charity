import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Stack,
  Typography,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ProjectDialog from './components/ProjectDialog/ProjectDialog';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserContract from 'contracts/Fundraiser.json';

const cc = require('cryptocompare');

const FundraiserCard = ({ fundraiser }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [web3, setWeb3] = useState(null);

  const [description, setDescription] = useState(null);
  const [image, setImage] = useState('');
  const [fundName, setFundName] = useState(null);
  const [goalAmount, setGoalAmount] = useState(null);
  const [totalDonations, setTotalDonations] = useState(null);
  const [totalDonationsEth, setTotalDonationsEth] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const [exchangeRate, setExchangeRate] = useState(null);
  const [userDonations, setUserDonations] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState(null);

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
      //console.log('----account0--', accounts[0]);

      setFundName(await instance.methods.name().call());
      setImage(await instance.methods.image().call());
      setDescription(await instance.methods.description().call());
      setGoalAmount(await instance.methods.goalAmount().call());
      console.log('---------data--------');
      console.log(fundName, image, description, goalAmount);
      const totalDonation = await instance.methods.totalDonations().call();

      await cc
        .price('ETH', ['USD'])
        .then((prices) => {
          exchangeRate = prices.USD;
          setExchangeRate(prices.USD);
        })
        .catch(console.error);

      const eth = web3.utils.fromWei(web3.utils.toBN(totalDonation), 'ether');

      setTotalDonationsEth(parseFloat(eth).toFixed(4));
      const dollarDonationAmount = exchangeRate * eth;
      setTotalDonations(dollarDonationAmount.toFixed(2));

      const userDonation = await instance.methods
        .myDonations()
        .call({ from: accounts[0] });
      setUserDonations(userDonation);

      const isUser = accounts[0];
      const isOwner = await instance.methods.owner().call();
      if (isOwner === accounts[0]) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setBeneficiary = async () => {
    await contract.methods
      .setBeneficiary(newBeneficiary)
      .send({ from: accounts[0] });
    alert(`Fundraiser Beneficiary Changed`);
    setOpen(false);
  };

  const renderDonationsList = () => {
    var donations = userDonations;
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
      console.log('<<<<', donationList);
    }

    return donationList.map((donation) => {
      return (
        <Box>
          <Typography component={'span'} fontWeight={700}>
            ${donation.donationAmount}
          </Typography>

          <Link
            to={{
              pathname: '/receipt',
              state: {
                fund: fundName,
                donation: donation.donationAmount,
                date: donation.date,
              },
            }}
          >
            <Button
              startIcon={<ReceiptIcon />}
              variant="contained"
              color="primary"
            >
              Receipt
            </Button>
          </Link>
        </Box>
      );
    });
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
            image={image}
            sx={{
              position: 'relative',
              height: 320,
              overflow: 'hidden',
              borderRadius: 2,
              filter:
                theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none',
            }}
            onClick={() => setOpen(true)}
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

                    lineHeight: 1,
                  }}
                >
                  ${totalDonations || '0'} raised
                </Typography>
              </Box>
            </Stack>
          </CardMedia>
          <Box marginTop={1}>
            <Typography fontWeight={700}>{fundName}</Typography>
          </Box>
          <Stack marginTop={1} spacing={1} direction={'row'}>
            <Button
              color={'primary'}
              size={'large'}
              startIcon={
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
              }
              fullWidth
              sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
              onClick={() => setOpen(true)}
            >
              View
            </Button>
          </Stack>
        </Card>
        <ProjectDialog
          open={open}
          key={fundraiser}
          onClose={() => setOpen(false)}
          web3={web3}
          contract={contract}
          exchangeRate={exchangeRate}
          totalDonations={totalDonations}
          totalDonationsEth={totalDonationsEth}
          image={image}
          name={fundName}
          description={description}
          goalAmount={goalAmount}
          account={accounts[0]}
          isOwner={isOwner}
          renderDonationsList={renderDonationsList()}
        />
      </Box>
    </Grid>
  );
};

export default FundraiserCard;
