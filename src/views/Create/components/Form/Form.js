import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  Typography,
  IconButton,
  Collapse,
  Alert,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  AttachFile,
  AddPhotoAlternate,
  Close,
  Send,
} from '@mui/icons-material';

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import FundraiserFactoryContract from 'contracts/FundraiserFactory.json';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .required('Please specify the name'),
  description: yup
    .string()
    .trim()
    .min(210, 'Description is too short')
    .max(2020, 'Should be less than 300 words')
    .required('Please describe your project'),
  about: yup
    .string()
    .trim()
    .min(210, 'Company description is too short')
    .max(2020, 'Should be less than 300 words')
    .required('Please write about your company'),
  beneficiary: yup
    .string()
    .min(6, 'Beneficiary address should be correct')
    .required('Please specify beneficiary address')
    .matches(/0x[a-fA-F0-9]{40}/, 'Enter correct wallet address!'),
  linkToCompany: yup
    .string()
    .min(3, 'Enter correct link')
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!',
    ),
});

const Form = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      linkToCompany: '',
      description: '',
      about: '',
      beneficiary: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      handleSubmit();
    },
  });

  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState('');
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundraiserFactoryContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FundraiserFactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setWeb3(web3);
      setContract(instance);
      setAccounts(accounts);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  async function saveToIpfs(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
      setImages(fileUrl);
      console.log('----------------', images);
    } catch (error) {
      console.log('Error uploading file: ', error);
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (images) {
      const { name, linkToCompany, description, about, beneficiary } =
        formik.values;
      if (
        !name ||
        !description ||
        !about ||
        !linkToCompany ||
        !beneficiary ||
        !images
      )
        return;
      /* first, upload to IPFS */
      const data = JSON.stringify({
        name,
        linkToCompany,
        images,
        description,
        about,
        beneficiary,
      });

      console.log(data);

      try {
        const transaction = await contract.methods
          .createFundraiser(
            name,
            linkToCompany,
            images,
            description,
            about,
            beneficiary,
          )
          .send({ from: accounts[0] });

        alert('Project created successfully');
        setLoading(false);
        console.log('10.1 transaction.wait------success', transaction);
      } catch (error) {
        //console.log('10.2 transaction.wait------error', error)
        alert(error);
        setLoading(false);
      }
      setLoading(false);
    }
    if (!images) {
      setAlertOpen(true);
      setLoading(false);
    }
  }
  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}
              fontWeight={700}
            >
              <AttachFile fontSize="medium" />
              Upload images *
            </Typography>
            <input
              type="file"
              name={'images'}
              accept={
                'image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/webp'
              }
              id="upload"
              multiple
              onChange={saveToIpfs}
              style={{ display: 'none', cursor: 'pointer' }}
            />
            <IconButton aria-label="upload" size="small">
              <label htmlFor="upload">
                <AddPhotoAlternate fontSize="large" />
              </label>
            </IconButton>

            {images && (
              <Alert severity="success" sx={{ mt: 1 }}>
                File uploaded successfully!
              </Alert>
            )}
            <Box sx={{ width: '100%' }}>
              <Collapse in={alertOpen}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertOpen(false);
                      }}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  Please upload a file!
                </Alert>
              </Collapse>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Project *
            </Typography>
            <TextField
              label="Name of your project"
              variant="outlined"
              name={'name'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Description *
            </Typography>
            <TextField
              label="Describe your project (<300 words)"
              variant="outlined"
              name={'description'}
              multiline
              rows={5}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.description}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              About your company *
            </Typography>
            <TextField
              label="Write about your company (<300 words)"
              variant="outlined"
              name={'about'}
              multiline
              rows={5}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.about}
              error={formik.touched.about && Boolean(formik.errors.about)}
              helperText={formik.touched.about && formik.errors.about}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <Typography
                variant={'subtitle2'}
                sx={{ marginBottom: 2 }}
                fontWeight={700}
              >
                Beneficiary Address *
              </Typography>
            </Box>
            <TextField
              label="Wallet address 0x..."
              variant="outlined"
              name={'beneficiary'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.beneficiary}
              error={
                formik.touched.beneficiary && Boolean(formik.errors.beneficiary)
              }
              helperText={
                formik.touched.beneficiary && formik.errors.beneficiary
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={'subtitle2'}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Link to Project *
            </Typography>
            <TextField
              label="Link to your project"
              variant="outlined"
              name={'linkToCompany'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.linkToCompany}
              error={
                formik.touched.linkToCompany &&
                Boolean(formik.errors.linkToCompany)
              }
              helperText={
                formik.touched.linkToCompany && formik.errors.linkToCompany
              }
            />
          </Grid>
          <Grid item container xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretched', sm: 'center' }}
              justifyContent={'center'}
              width={1}
              margin={'0 auto'}
            >
              <LoadingButton
                endIcon={<Send />}
                size={'large'}
                variant={'contained'}
                type={'submit'}
                loading={loading}
                loadingPosition={'end'}
              >
                Create
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Form;
