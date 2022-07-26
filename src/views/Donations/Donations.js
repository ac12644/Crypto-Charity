import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import DonationList from './components/DonationList';
import Main from 'layouts/Main';
import Container from 'components/Container';
import Contact from 'components/Contact';
import Hero from 'components/Hero';

const Donations = () => {
  const theme = useTheme();

  return (
    <Main>
      <Container>
        <Hero
          image={
            'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80'
          }
          title={'My Donations'}
          heading={`Projects you've supported`}
          subtitle={
            'Alone we can do so little, together we can do so much. - Helen Keller'
          }
        />
      </Container>
      <Container paddingY={3}>
        <DonationList />
      </Container>
      <Container></Container>
      <Box
        position={'relative'}
        marginTop={{ xs: 4, md: 6 }}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
        <Box
          component={'svg'}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: 1,
          }}
        >
          <path
            fill={theme.palette.alternate.main}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
        <Container>
          <Contact />
        </Container>
      </Box>
    </Main>
  );
};

export default Donations;