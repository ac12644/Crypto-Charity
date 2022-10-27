import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import NavItem from './components/NavItem';

const SidebarNav = ({ pages }) => {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Box>
      <Box width={1} paddingX={2} paddingY={1}>
        <Box
          display={'flex'}
          component="a"
          href="/"
          title="Virtualground"
          width={{ xs: 380, md: 380 }}
        >
          <Box
            component={'img'}
            src={
              mode === 'light'
                ? 'https://github.com/ac12644/Fundraising-Dapp/blob/main/images/crypto%20charity-light.png?raw=true'
                : 'https://github.com/ac12644/Fundraising-Dapp/blob/main/images/crypto%20charity-dark.png?raw=true'
            }
            height={1}
            width={1}
          />
        </Box>
      </Box>
      <Box paddingX={2} paddingY={2}>
        <Box>
          <NavItem items={pages} />
        </Box>
      </Box>
    </Box>
  );
};

SidebarNav.propTypes = {
  pages: PropTypes.array.isRequired,
};

export default SidebarNav;
