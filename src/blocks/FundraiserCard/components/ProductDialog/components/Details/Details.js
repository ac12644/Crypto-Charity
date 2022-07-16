import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

const Details = ({ name, description, about, totalDonations, linkToCompany, web3, exchangeRate, contract, accounts }) => {
  const theme = useTheme();
  const [ amount, setAmount ] = useState(5);
  
  const submitFunds = async () => {
    const ethTotal = amount / exchangeRate;
    console.log('total', ethTotal);
    
    const donation = web3.utils.toWei(ethTotal.toString());
    console.log('donation', donation);
    
    console.log('contract', contract);
    
    await contract.methods.donate().send({
      from: accounts,
      value: donation,
      gas: 650000
    })
  }

  return (
    <Box>
      <Typography variant={'h5'} fontWeight={700} gutterBottom>
        {name}
      </Typography>
      <Typography variant={'subtitle2'} color={'text.secondary'}>
        {description}
      </Typography>
      <Typography variant={'h5'} fontWeight={700}  marginTop={2} display={'flex'} alignItems={'center'} gutterBottom>
        About Company  
        <IconButton href={linkToCompany} target='_blank' >
          <LinkIcon/>
        </IconButton>
      </Typography>
      <Typography variant={'subtitle2'} color={'text.secondary'}>
        {about}
      </Typography>
      <Box
        marginTop={2}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography display= {'flex'} alignItems={'center'} variant={'h6'} fontWeight={700}>
          Raised: {totalDonations}
        </Typography>
        <Box display={'flex'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'}>
            {[1, 2, 3, 4, 5].map((r) => (
              <Box
                key={r}
                component={'svg'}
                color={
                  r <= 4 ? theme.palette.secondary.main : theme.palette.divider
                }
                width={16}
                height={16}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </Box>
            ))}
          </Box>
          <Typography
            variant={'caption'}
            color={'text.secondary'}
            marginLeft={0.5}
          >
            8 reviews
          </Typography>
        </Box>
      </Box>
      <Box marginTop={2}>
        <Typography>
          Donate: ${' '}
          <Typography component={'span'} fontWeight={700}>
            {amount || ''}
          </Typography>
        </Typography>
        <Stack direction={'row'} spacing={1} marginTop={0.5}>
          {[5, 10, 15, 20, 30].map((item) => (
            <Box
              key={item}
              onClick={() => setAmount(item)}
              sx={{
                borderRadius: 1,
                padding: 1,
                border: `2px solid ${
                  amount === item
                    ? theme.palette.primary.main
                    : theme.palette.divider
                }`,
                cursor: 'pointer',
              }}
            >
              <Typography>${item}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Stack marginTop={2} spacing={1} direction={'row'}>
        <Button
          variant={'contained'}
          color={'primary'}
          size={'large'}
          onClick={submitFunds}
          fullWidth
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
    </Box>
  );
};
Details.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  about: PropTypes.string.isRequired,
  linkToCompany: PropTypes.string.isRequired,
  web3: PropTypes.object.isRequired,
  totalDonations: PropTypes.string.isRequired,
  exchangeRate: PropTypes.number.isRequired,
  contract: PropTypes.object.isRequired,
  accounts: PropTypes.string.isRequired,
}

export default Details;
