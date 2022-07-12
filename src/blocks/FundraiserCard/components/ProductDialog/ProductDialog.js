import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';

import { Image, Details } from './components';

const ProductDialog = ({ onClose, open, name, images, description, about, linkToCompany }) => {
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
                name={name}
                description={description}
                about={about}
                linkToCompany={linkToCompany}
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
  images: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  about: PropTypes.string,
  linkToCompany: PropTypes.string,
};

export default ProductDialog;
