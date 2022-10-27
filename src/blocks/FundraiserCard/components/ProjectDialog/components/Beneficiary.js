import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Dialog, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  newBeneficiary: yup
    .string()
    .min(20, 'Enter correct wallet address!')
    .required('Please specify new beneficiary address')
    .matches(/0x[a-fA-F0-9]{40}/, 'Enter correct wallet address!'),
});

const Beneficiary = ({
  beneficiaryOpen,
  beneficiaryClose,
  contract,
  account,
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      newBeneficiary: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      handleSubmit();
    },
  });

  async function handleSubmit() {
    const { newBeneficiary } = formik.values;
    try {
      await contract.methods.setBeneficiary(newBeneficiary).send({
        from: account,
      });
      alert(`Fundraiser Beneficiary Changed`);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
    setLoading(false);
  }

  return (
    <Dialog
      onClose={beneficiaryClose}
      open={beneficiaryOpen}
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
        <ManageAccountsIcon sx={{ fontSize: 50 }} />
        <Typography align={'center'}>
          <Typography component={'span'} fontWeight={700}>
            Change beneficiary address{' '}
          </Typography>
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ marginY: 4 }}>
            <Grid item xs={12}>
              <TextField
                label="Enter new beneficiary address"
                variant="outlined"
                name={'newBeneficiary'}
                fullWidth
                onChange={formik.handleChange}
                value={formik.values?.newBeneficiary}
                error={
                  formik.touched.newBeneficiary &&
                  Boolean(formik.errors.newBeneficiary)
                }
                helperText={
                  formik.touched.newBeneficiary && formik.errors.newBeneficiary
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                size={'large'}
                variant={'contained'}
                type={'submit'}
                loading={loading}
                fullWidth
              >
                Change
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
        <Typography
          align={'center'}
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={beneficiaryClose}
        >
          Cancel
        </Typography>
      </Box>
    </Dialog>
  );
};
Beneficiary.propTypes = {
  beneficiaryClose: PropTypes.func.isRequired,
  beneficiaryOpen: PropTypes.bool.isRequired,
  contract: PropTypes.object.isRequired,
  account: PropTypes.string,
};
export default Beneficiary;
