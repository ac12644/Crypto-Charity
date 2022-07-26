import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

const Image = ({ images, name }) => {
  return (
    <Box>
      <Box
        sx={{
          width: 1,
          height: 'auto',
          '& img': {
            width: 1,
            height: 1,
            objectFit: 'cover',
            borderRadius: 2,
          },
        }}
      >
        <img src={images} alt={name} />
      </Box>
    </Box>
  );
};
Image.propTypes = {
  images: PropTypes.string,
  name: PropTypes.string,
};

export default Image;
