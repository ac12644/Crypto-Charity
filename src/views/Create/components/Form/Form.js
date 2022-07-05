import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

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
    .max(1000, 'Should be less than 1000 chars')
    .required('Please write description'),
  beneficiary: yup
    .string()
    .min(0, 'Price should be minimum 0')
    .required('Please specify NFT price')
    .matches(
      /0x[a-fA-F0-9]{40}/,
      'Enter correct wallet address!'
    ),
  url: yup
    .string()
    .min(3, 'Enter correct link')
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!'
    )
});

const Form = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      beneficiary: '',
      url: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      handleSubmit();
    }
  });

  const [ contract, setContract] = useState(null);
  const [ web3, setWeb3 ] = useState(null);
  const [ accounts, setAccounts ] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageAddress, setImageAddress] = useState('');
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
  
  useEffect (() => {
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
                FundraiserFactoryContract.abi, deployedNetwork && deployedNetwork.address,
            );
            setWeb3(web3);
            setContract(instance);
            setAccounts(accounts);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    }
    
  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      setImageAddress(`https://ipfs.infura.io/ipfs/${added.path}`);

      console.log('----------------', imageAddress);
    } catch (error) {
      console.log('Error uploading file: ', error);
      setLoading(false);
    }  
  }

 async function handleSubmit() {
  if (imageAddress) {
    const { name, url, description, beneficiary } = formik.values;
    if (!name || !description || !url || !beneficiary || !imageAddress) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, url, beneficiary, imageAddress
    });
    
    console.log(data);

      try {
      const transaction = await contract.methods.createFundraiser( 
        name, url, imageAddress, description, beneficiary
        ).send({ from: accounts[0] });
        
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
      
      if (!imageAddress) {
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
                  <AttachFileIcon fontSize="medium" />
                  Upload image *
                </Typography>
                   <input
                     type='file'
                     name={'file'}
                     accept={'image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/webp'}
                     onChange={onChange}
                   />
                {
                  imageAddress && (
                    <Alert
                      severity='success'
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setAlertOpen(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ mt: 1 }}
                    >
                      File uploaded successfully!
                    </Alert>
                  )
                }
                <Box sx={{ width: '100%' }}>
                  <Collapse in={alertOpen}>
                    <Alert
                      severity='error'
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setAlertOpen(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
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
                  Project*
                </Typography>
                <TextField
                  label="Name of your project"
                  variant="outlined"
                  name={'name'}
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values?.name}
                  error={
                    formik.touched.name && Boolean(formik.errors.name)
                  }
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Description*
                </Typography>
                <TextField
                  label="Describe your project"
                  variant="outlined"
                  name={'description'}
                  multiline
                  rows={3}
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values?.description}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Beneficiary Address*
                </Typography>
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
                  helperText={formik.touched.beneficiary && formik.errors.beneficiary}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant={'subtitle2'}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Link to Project*
                </Typography>
                <TextField
                  label="Link to your project"
                  variant="outlined"
                  name={'url'}
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values?.url}
                  error={formik.touched.url && Boolean(formik.errors.url)}
                  helperText={formik.touched.url && formik.errors.url}
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
                    endIcon={<SendIcon />} 
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
