import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import FundraiserFactory from 'contracts/FundraiserFactory.json';
import FundraiserCard from 'blocks/FundraiserCard';
import Web3 from 'web3';

const mockLeftGrid = [
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img8.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    title: 'Lorem ipsum dolor sit amet,',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img9.jpg',
    description: 'Excepteur sint occaecat cupidatat non proident',
    title: 'Consectetur adipiscing elit',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img12.jpg',
    description: 'Eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    title: 'Labore et dolore magna aliqua',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img11.jpg',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    title: 'Eiusmod tempor incididunt',
  },
];

const mockMiddleGrid = [
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img11.jpg',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus',
    title: 'Sed ut perspiciatis',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img12.jpg',
    description:
      'Qui blanditiis praesentium voluptatum deleniti atque corrupti',
    title: 'Unde omnis iste natus',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img9.jpg',
    description:
      'On the other hand, we denounce with righteous indignation and dislike',
    title: 'Sit voluptatem',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img8.jpg',
    description: 'Quos dolores et quas molestias excepturi',
    title: 'Accusantium doloremque',
  },
];

const mockRightGrid = [
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img12.jpg',
    description: 'Et harum quidem rerum facilis est et expedita distinctio',
    title: 'Totam rem aperiam',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img11.jpg',
    description: 'Nam libero tempore, cum soluta nobis est eligendi optio',
    title: 'Uae ab illo inventore',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img8.jpg',
    description: 'Itaque earum rerum hic tenetur a sapiente delectus',
    title: 'Beatae vitae dicta',
  },
  {
    image: 'https://assets.maccarianagency.com/backgrounds/img9.jpg',
    description:
      'On the other hand, we denounce with righteous indignation and dislike',
    title: 'Nemo enim ipsam',
  },
];

const Column = ({ data }) => {
  const theme = useTheme();
  return (
    <Box>
      {data.map((item, i) => (
        <Box
          key={i}
          sx={{
            marginBottom: { xs: 2, sm: 3 },
            '&:last-child': { marginBottom: 0 },
          }}
        >
          <Box
            boxShadow={1}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              '&:hover': {
                '& img': {
                  transform: 'scale(1.2)',
                },
                '& .portfolio-massonry__main-item': {
                  bottom: 0,
                },
              },
              '& .lazy-load-image-loaded': {
                display: 'flex !important',
              },
            }}
          >
            <Box
              component={LazyLoadImage}
              height={1}
              width={1}
              src={item.image}
              alt="..."
              effect="blur"
              maxHeight={{ xs: 400, sm: 600, md: 1 }}
              sx={{
                transition: 'transform .7s ease !important',
                transform: 'scale(1.0)',
                objectFit: 'cover',
                filter:
                  theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none',
              }}
            />
            <Box
              position={'absolute'}
              bottom={'-100%'}
              left={0}
              right={0}
              padding={4}
              bgcolor={'background.paper'}
              className={'portfolio-massonry__main-item'}
              sx={{ transition: 'bottom 0.3s ease 0s' }}
            >
              <Box
                component={'svg'}
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 1920 100.1"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: 'translateY(-90%)',
                  zIndex: 2,
                  width: 1,
                }}
              >
                <path
                  fill={theme.palette.background.paper}
                  d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                ></path>
              </Box>
              <Typography variant={'h6'} fontWeight={700} gutterBottom>
                {item.fundName}
              </Typography>
              <Typography>{item.description}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

Column.propTypes = {
  data: PropTypes.array.isRequired,
};

const FundraiserGrid = () => {
  const [funds, setFunds] = useState([]);
  const web3 = new Web3(
    new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com'),
  );

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundraiserFactory.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FundraiserFactory.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const funds = await instance.methods.fundraisers(20, 0).call();
      setFunds(funds);
      console.log('------', funds);
      setFunds(funds);
    } catch (error) {
      console.error(error);
    }
  };

  const displayFundraisers = () => {
    return funds.slice(4, 12).map((fundraiser) => {
      return <FundraiserCard fundraiser={fundraiser} key={fundraiser} />;
    });
  };

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'medium',
          }}
          gutterBottom
          color={'secondary'}
          align={'center'}
        >
          Fundraisers
        </Typography>
        <Typography
          variant={'h4'}
          gutterBottom
          align={'center'}
          sx={{ fontWeight: 700 }}
        >
          Listed projects for fundraising
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {displayFundraisers()}
      </Grid>
    </Box>
  );
};

export default FundraiserGrid;
