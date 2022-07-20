import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';

import { Image, Details } from './components';

const ProductDialog = ({ onClose, open, web3, exchangeRate, totalDonations, totalDonationsEth, name, images, description, about, linkToCompany, contract, accounts, withdrawFunds }) => {
  return (
    <Dialog onClose={onClose} open={open} maxWidth={'lg'}>
      <Box paddingY={{ xs: 1, sm: 2 }} paddingX={{ xs: 2, sm: 4 }}>
        <Box
          paddingY={{ xs: 1, sm: 2 }}
          display={'flex'}
          justifyContent={'flex-end'}
        >
          <Box
            component={'svg'}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width={24}
            height={24}
            onClick={onClose}
            sx={{ cursor: 'pointer' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </Box>
        </Box>
        <Box paddingY={2}>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Image 
                images={images}
                name={name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Details 
                name = {name}
                description = {description}
                about = {about}
                linkToCompany = {linkToCompany}
                web3 = {web3}
                exchangeRate = {exchangeRate}
                contract = {contract} 
                accounts = {accounts}
                totalDonations = {totalDonations}
                totalDonationsEth = {totalDonationsEth}
                withdrawFunds = {withdrawFunds}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

ProductDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  web3: PropTypes.object.isRequired,
  exchangeRate: PropTypes.number.isRequired,
  totalDonations: PropTypes.string.isRequired,
  totalDonationsEth: PropTypes.string.isRequired,
  images: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  about: PropTypes.string.isRequired,
  linkToCompany: PropTypes.string.isRequired,
  withdrawFunds: PropTypes.func.isRequired,
};

export default ProductDialog;
