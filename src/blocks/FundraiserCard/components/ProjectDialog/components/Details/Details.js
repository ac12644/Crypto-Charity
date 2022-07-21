import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Beneficiary from './components/Beneficiary';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, Button, IconButton, Tooltip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { Favorite, ManageAccounts, CurrencyExchange } from '@mui/icons-material';

const Details = ({ name, description, about, totalDonations, totalDonationsEth, linkToCompany, web3, exchangeRate, contract, accounts, withdrawFunds, isOwner }) => {
  const theme = useTheme();
  const [ amount, setAmount ] = useState(5);
  const [  open, setOpen ] = useState(false);
  
  const submitFunds = async () => {
    const ethTotal = amount / exchangeRate;
    console.log('total', ethTotal);
    const donation = web3.utils.toWei(ethTotal.toString());
    console.log('donation', donation);
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
          Raised: ${totalDonations || 0} ≈ {totalDonationsEth} ETH
        </Typography>
        <Box display={'flex'} alignItems={'center'}>
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
        <Typography variant={'h6'} fontWeight={700}>
          Donate: $
          <Typography component={'span'}variant={'h6'} fontWeight={700}>
            {amount} ≈ {parseFloat(amount/exchangeRate).toFixed(4)} ETH
          </Typography>
        </Typography>
        <Stack direction={'row'} spacing={1} marginTop={1}>
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
      <Stack marginTop={3} marginBottom={3} spacing={1} direction={'row'}>
        <Tooltip title='Donate'>
          <Button
            variant={'contained'}
            color={'primary'}
            size={'large'}
            onClick={submitFunds}
            fullWidth
          >
             <Favorite/>
          </Button>
        </Tooltip>
        {isOwner && 
          <Tooltip title='Change Beneficiary'>
            <Button
              color={'primary'}
              size={'large'}
              fullWidth
              sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
              onClick={() => setOpen(true)}
            >
              <ManageAccounts/>
            </Button>
          </Tooltip>
        }
        <Beneficiary
          onClose = {() => setOpen(false)}
          open = {open}
          accounts = {accounts}
          contract = {contract}
        />
        {isOwner && 
          <Tooltip title='Withdraw'>
            <Button
              color={'primary'}
              size={'large'}
              fullWidth
              sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
              onClick={withdrawFunds}
            >
              <CurrencyExchange/>
            </Button>
          </Tooltip>
        }
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
  totalDonationsEth: PropTypes.string.isRequired,
  exchangeRate: PropTypes.number.isRequired,
  contract: PropTypes.object.isRequired,
  accounts: PropTypes.string.isRequired,
  withdrawFunds: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired
}

export default Details;
