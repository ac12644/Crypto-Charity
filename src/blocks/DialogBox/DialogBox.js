import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Dialog, Typography } from '@mui/material';
import { VolunteerActivism } from '@mui/icons-material';

const DialogBox = ({ open, onClose }) => {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth={'sm'}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 4,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingY: { xs: 4, sm: 10 },
          paddingX: { xs: 4, sm: 12 },
        }}
      >
        <VolunteerActivism sx={{ fontSize: 50 }} />
        <Typography align={'center'}>
          <Typography component={'span'} fontWeight={700}>
            Thank you for donation{' '}
          </Typography>
        </Typography>
        <Grid container spacing={2} sx={{ marginY: 4 }}>
          <Grid item xs={12}>
            <Button size={'large'} variant={'contained'} fullWidth>
              Go to home
            </Button>
          </Grid>
        </Grid>
        <Typography
          align={'center'}
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={onClose}
        >
          Close
        </Typography>
      </Box>
    </Dialog>
  );
};
DialogBox.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
export default DialogBox;
