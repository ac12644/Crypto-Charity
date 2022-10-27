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
import FundraiserFactoryContract from 'contracts/FundraiserFactory.json';
import DialogBox from 'blocks/DialogBox';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { create } from 'ipfs-http-client';

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .required('Please specify the name'),
  description: yup.string().trim().required('Please describe your project'),
  beneficiary: yup
    .string()
    .min(6, 'Beneficiary address should be correct')
    .required('Please specify beneficiary address')
    .matches(/0x[a-fA-F0-9]{40}/, 'Enter correct wallet address!'),
});

const Form = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      beneficiary: '',
      goalAmount: '',
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
  const [image, setImage] = useState('');
  const [accounts, setAccounts] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const projectId = process.env.INFURA_IPFS_ID;
  const projectSecret = process.env.INFURA_IPFS_SECRET;
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [hash, setHash] = useState('');

  const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const web3 = new Web3(connection);
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
  };

  async function saveToIpfs(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const fileUrl = `https://ac12644.infura-ipfs.io/ipfs/${added.path}`;
      setImage(fileUrl);
      console.log(image);
      setOpen(true);
    } catch (error) {
      console.log('Error uploading file: ', error);
      setLoading(false);
      setAlertOpen(true);
    }
  }

  async function handleSubmit() {
    const { name, description, beneficiary, goalAmount } = formik.values;

    const data = JSON.stringify({
      name,
      image,
      description,
      goalAmount,
      beneficiary,
    });
    console.log(data);
    try {
      const transaction = await contract.methods
        .createFundraiser(name, image, description, goalAmount, beneficiary)
        .send({ from: accounts[0] });
      setHash(transaction.transactionHash);
      setDialogBoxOpen(true);
      setAlertOpen(false);
      console.log(hash);
      formik.resetForm();
      setOpen(false);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
    setLoading(false);
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
              Upload an image *
            </Typography>
            <input
              type="file"
              name={'images'}
              accept={
                'image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/webp'
              }
              id="upload"
              onChange={saveToIpfs} // fix here change to image
              style={{ display: 'none', cursor: 'pointer' }}
            />
            <IconButton aria-label="upload" size="small">
              <label htmlFor="upload">
                <AddPhotoAlternate fontSize="large" />
              </label>
            </IconButton>
            <Collapse in={open}>
              <Alert
                severity="success"
                sx={{ mt: 1 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                File uploaded successfully!
              </Alert>
            </Collapse>

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
              label="Describe your project"
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

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <Typography variant={'subtitle2'} sx={{ marginBottom: 2 }}>
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
              Goal amount (in USD)
            </Typography>
            <TextField
              label="Amount needed for project"
              variant="outlined"
              name={'goalAmount'}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.goalAmount}
              error={
                formik.touched.goalAmount && Boolean(formik.errors.goalAmount)
              }
              helperText={formik.touched.goalAmount && formik.errors.goalAmount}
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
      <DialogBox
        open={dialogBoxOpen}
        onClose={() => setDialogBoxOpen(false)}
        title={'Thank you!'}
        message={`Campaign created successfully with transaction hash: ${hash}`}
        buttonText="View on polygonscan"
        buttonLink={`https://mumbai.polygonscan.com/tx/${hash}`}
      />
    </Box>
  );
};

export default Form;
