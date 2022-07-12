import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

import { ProductDialog } from './components';
import Container from 'components/Container';

import Web3 from 'web3';
import FundraiserContract from 'contracts/Fundraiser.json';

const cc = require('cryptocompare');

{/* 
const mock = [
  {
    image1: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image2: 'https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80',
    image3: 'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image4: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    name: 'Feeding America 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vulputate tempus sapien, id posuere elit ultricies quis. Etiam congue porta leo, eu auctor elit ultrices vitae. In viverra at eros quis tincidunt. Integer risus ipsum, vestibulum sed placerat id, cursus ac erat. Vivamus tristique elementum velit ac sagittis. Phasellus viverra libero eget augue elementum, eget rhoncus erat lobortis. Nullam eget sollicitudin purus. Aliquam erat volutpat. Vestibulum sit amet venenatis elit. Integer eu lorem risus. Sed non felis in libero imperdiet tempor eu eu arcu. Aenean ultrices mollis mi, ut dignissim lorem tincidunt non. Morbi malesuada eros purus, id ultrices nisi ullamcorper porta. Vestibulum cursus lacinia massa, nec malesuada est sollicitudin ac. Mauris vitae tellus porta, blandit diam sit amet, interdum magna.',
    price: '14',
    href: '#',
    reviewScore: 5,
    reviewCount: 12,
    id: 1,
  },
  {
    image1: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image2: 'https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80',
    image3: 'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image4: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    name: 'Feeding America 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vulputate tempus sapien, id posuere elit ultricies quis. Etiam congue porta leo, eu auctor elit ultrices vitae. In viverra at eros quis tincidunt. Integer risus ipsum, vestibulum sed placerat id, cursus ac erat. Vivamus tristique elementum velit ac sagittis. Phasellus viverra libero eget augue elementum, eget rhoncus erat lobortis. Nullam eget sollicitudin purus. Aliquam erat volutpat. Vestibulum sit amet venenatis elit. Integer eu lorem risus. Sed non felis in libero imperdiet tempor eu eu arcu. Aenean ultrices mollis mi, ut dignissim lorem tincidunt non. Morbi malesuada eros purus, id ultrices nisi ullamcorper porta. Vestibulum cursus lacinia massa, nec malesuada est sollicitudin ac. Mauris vitae tellus porta, blandit diam sit amet, interdum magna.',
    price: '11',
    reviewScore: 4,
    reviewCount: 6,
    id: 2,
  },
  {
    image1: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image2: 'https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80',
    image3: 'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image4: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    name: 'Feeding America 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vulputate tempus sapien, id posuere elit ultricies quis. Etiam congue porta leo, eu auctor elit ultrices vitae. In viverra at eros quis tincidunt. Integer risus ipsum, vestibulum sed placerat id, cursus ac erat. Vivamus tristique elementum velit ac sagittis. Phasellus viverra libero eget augue elementum, eget rhoncus erat lobortis. Nullam eget sollicitudin purus. Aliquam erat volutpat. Vestibulum sit amet venenatis elit. Integer eu lorem risus. Sed non felis in libero imperdiet tempor eu eu arcu. Aenean ultrices mollis mi, ut dignissim lorem tincidunt non. Morbi malesuada eros purus, id ultrices nisi ullamcorper porta. Vestibulum cursus lacinia massa, nec malesuada est sollicitudin ac. Mauris vitae tellus porta, blandit diam sit amet, interdum magna.',
    price: '8',
    href: '#',
    reviewScore: 5,
    reviewCount: 8,
    id: 3,
  },
  {
    image1: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image2: 'https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80',
    image3: 'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image4: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    name: 'Feeding America 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vulputate tempus sapien, id posuere elit ultricies quis. Etiam congue porta leo, eu auctor elit ultrices vitae. In viverra at eros quis tincidunt. Integer risus ipsum, vestibulum sed placerat id, cursus ac erat. Vivamus tristique elementum velit ac sagittis. Phasellus viverra libero eget augue elementum, eget rhoncus erat lobortis. Nullam eget sollicitudin purus. Aliquam erat volutpat. Vestibulum sit amet venenatis elit. Integer eu lorem risus. Sed non felis in libero imperdiet tempor eu eu arcu. Aenean ultrices mollis mi, ut dignissim lorem tincidunt non. Morbi malesuada eros purus, id ultrices nisi ullamcorper porta. Vestibulum cursus lacinia massa, nec malesuada est sollicitudin ac. Mauris vitae tellus porta, blandit diam sit amet, interdum magna.',
    price: '5',
    reviewScore: 4,
    reviewCount: 10,
    id: 5,
  },
  {
    image1: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image2: 'https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80',
    image3: 'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image4: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    name: 'Feeding America 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vulputate tempus sapien, id posuere elit ultricies quis. Etiam congue porta leo, eu auctor elit ultrices vitae. In viverra at eros quis tincidunt. Integer risus ipsum, vestibulum sed placerat id, cursus ac erat. Vivamus tristique elementum velit ac sagittis. Phasellus viverra libero eget augue elementum, eget rhoncus erat lobortis. Nullam eget sollicitudin purus. Aliquam erat volutpat. Vestibulum sit amet venenatis elit. Integer eu lorem risus. Sed non felis in libero imperdiet tempor eu eu arcu. Aenean ultrices mollis mi, ut dignissim lorem tincidunt non. Morbi malesuada eros purus, id ultrices nisi ullamcorper porta. Vestibulum cursus lacinia massa, nec malesuada est sollicitudin ac. Mauris vitae tellus porta, blandit diam sit amet, interdum magna.',
    price: '14',
    href: '#',
    reviewScore: 5,
    reviewCount: 12,
    id: 6,
  },
  {
    image1: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image2: 'https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80',
    image3: 'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    image4: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    name: 'Feeding America 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vulputate tempus sapien, id posuere elit ultricies quis. Etiam congue porta leo, eu auctor elit ultrices vitae. In viverra at eros quis tincidunt. Integer risus ipsum, vestibulum sed placerat id, cursus ac erat. Vivamus tristique elementum velit ac sagittis. Phasellus viverra libero eget augue elementum, eget rhoncus erat lobortis. Nullam eget sollicitudin purus. Aliquam erat volutpat. Vestibulum sit amet venenatis elit. Integer eu lorem risus. Sed non felis in libero imperdiet tempor eu eu arcu. Aenean ultrices mollis mi, ut dignissim lorem tincidunt non. Morbi malesuada eros purus, id ultrices nisi ullamcorper porta. Vestibulum cursus lacinia massa, nec malesuada est sollicitudin ac. Mauris vitae tellus porta, blandit diam sit amet, interdum magna.',
    price: '14',
    href: '#',
    reviewScore: 5,
    reviewCount: 12,
    id: 7,
  },
];
*/}

const FundraiserCard = ({ fundraiser }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
  const [ linkToCompany, setlinkToCompany ] = useState(null);
  const [ description, setDescription ] = useState(null);
  const [ about, setAbout ] = useState(null);
  const [ images, setImages ] = useState('');
  const [ fundName, setFundName ] = useState(null);
  const [ totalDonations, setTotalDonations ] = useState(null);
  const [ donationCount, setDonationCount ] = useState(null);
  const [ contract, setContract] = useState(null);
  const [ accounts, setAccounts ] = useState(null);
  const [ donationAmount, setDonationAmount ] = useState(null);
  const [ exchangeRate, setExchangeRate ] = useState(null);
  const [ userDonations, setUserDonations ] = useState(null);
  const [ isOwner, setIsOwner ] = useState(false);
  const [ newBeneficiary, setNewBeneficiary ] = useState(null);
  const ethAmount =  (donationAmount / exchangeRate || 0).toFixed(4);

  useEffect (() => {
      if (fundraiser) {
          init (fundraiser);
      }
  }, [fundraiser]);

  const init = async (fundraiser) => {
      try {
          const fund = fundraiser
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = FundraiserContract.networks[networkId];
          const accounts = await web3.eth.getAccounts();
          const instance = new web3.eth.Contract(
            FundraiserContract.abi,
            fund
          );
          setContract(instance);
          setAccounts(accounts);

          setFundName(await instance.methods.name().call());
          setImages(await instance.methods.images().call());
          setDescription(await instance.methods.description().call());
          setAbout(await instance.methods.about().call());
          setLinkToCompany(await instance.methods.linkToCompany().call());

          console.log('---------data--------');
          console.log(fundName, images, description, about, linkToCompany);
      
          await cc.price('ETH', ['USD'])
            .then( prices => { 
              exchangeRate = prices.USD; 
              setExchangeRate(prices.USD); 
            }).catch(console.error);
        
          const eth = web3.utils.fromWei(totalDonations, 'ether');
          const dollarDonationAmount = exchangeRate * eth;
          setTotalDonations(dollarDonationAmount.toFixed(2));
          const userDonations = instance.methods.myDonations().call({ from: accounts[0] });
          console.log(userDonations);
          setUserDonations(userDonations);
          const isUser = accounts[0];
          const isOwner = await instance.methods.owner().call();
          if (isOwner === accounts[0]) {
              setIsOwner(true);
          }
       } catch (error) {
          console.error(error);
      }
  }
  window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload()
    })
  const handleOpen = () => {
      setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };

  const submitFunds = async () => {
    const fundraisercontract = contract
    const ethRate = exchangeRate
    const ethTotal = donationAmount / ethRate
    const donation = web3.utils.toWei(ethTotal.toString())

    await contract.methods.donate().send({
      from: accounts[0],
      value: donation,
      gas: 650000
    })
    setOpen(false);
  }

  const renderDonationsList = () => {
    var donations = userDonations
    if (donations === null) {return null}

    const totalDonations = donations.values.length
    let donationList = []
    var i
    for (i = 0; i < totalDonations; i++) {
      const ethAmount = web3.utils.fromWei(donations.values[i])
      const userDonation = exchangeRate * ethAmount
      const donationDate = donations.dates[i]
      donationList.push({ donationAmount: userDonation.toFixed(2), date: donationDate})
    }

    return donationList.map((donation) => {
      return (
        <div className="donation-list">
          <p>${donation.donationAmount}</p>
          <Button variant="contained" color="primary">
            <Link className="donation-receipt-link" to={{ pathname: '/receipts', state: { fund: fundName, donation: donation.donationAmount, date: donation.date} }}>
              Request Receipt
            </Link>
          </Button>
        </div>
      )
    })
  }

  const withdrawalFunds = async () => {
    await contract.methods.withdraw().send({
      from: accounts[0],
    })

    alert('Funds Withdrawn!')
  }

  const setBeneficiary = async () => {
    await contract.methods.setBeneficiary(beneficiary).send({
      from: accounts[0],
    })

    alert(`Fundraiser Beneficiary Changed`)
  }

  return ( 
    <Grid item xs={12} sm={6} md={3} >
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
          <Box
            marginTop={1}
          >
            <Typography
              fontWeight={700}
              sx={{ textTransform: 'uppercase' }}
            >
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
        <ProductDialog 
          open={open} 
          key={fundraiser}
          onClose={() => setOpen(false)} 
          images={images}
          name={fundName}
          description={description}
          about={about}
          linkToCompany={linkToCompany}
        />
      </Box>
    </Grid>
 
  );
};
FundraiserCard.propTypes = {
  fundraiser: PropTypes.func,
}
export default FundraiserCard;