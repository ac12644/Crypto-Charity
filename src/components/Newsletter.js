import React, { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as FirestoreService from 'services/firebase';

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required.'),
});

const Newsletter = () => {
  const [emailUploaded, setEmailUploaded] = useState(false);
  const initialValues = {
    email: '',
  };
  const onSubmit = (values) => {
    FirestoreService.addNewsletterEmail(values.email)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        setEmailUploaded(true);
        formik.resetForm();
      })
      .catch((error) => console.log(error));
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit,
  });

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          fontWeight={700}
          variant={'h4'}
          align={'center'}
          gutterBottom
        >
          Subscribe to our newsletter
        </Typography>
        <Typography
          variant={'h6'}
          component={'p'}
          color={'text.secondary'}
          align={'center'}
        >
          Get real time updates and news.
        </Typography>
      </Box>
      {!emailUploaded && (
        <Box maxWidth={600} margin={'0 auto'}>
          <Box
            component={'form'}
            onSubmit={formik.handleSubmit}
            noValidate
            autoComplete="off"
            sx={{
              '& .MuiInputBase-input.MuiOutlinedInput-input': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'center', md: 'flex-start' }}
              justifyContent={{ xs: 'center' }}
            >
              <TextField
                sx={{ height: 54, maxWidth: 422, marginRight: 1 }}
                label="Email*"
                type="email"
                variant="outlined"
                color="primary"
                size="medium"
                name="email"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <Button
                sx={{ height: 54 }}
                variant="contained"
                color="primary"
                size="medium"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <Box width={1} display={'flex'} justifyContent={'center'}>
        <Collapse in={emailUploaded}>
          <Alert
            severity="success"
            color="primary"
            action={
              <IconButton aria-label="close" size="small">
                <CloseIcon
                  fontSize="inherit"
                  onClick={() => {
                    setEmailUploaded(false);
                  }}
                />
              </IconButton>
            }
            sx={{ mt: 1 }}
          >
            Successfully subscribed!
          </Alert>
        </Collapse>
      </Box>
    </Box>
  );
};

export default Newsletter;
