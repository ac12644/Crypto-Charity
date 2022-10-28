import React from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { NavItem } from './components';
import ThemeModeToggler from 'components/ThemeModeToggler';
import Login from 'web3/Login';

const Topbar = ({ onSidebarOpen, pages, colorInvert = false }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={1}
    >
      <Box
        display={'flex'}
        component="a"
        href="/"
        title="crypto charity"
        width={{ xs: 360, md: 360 }}
      >
        <Box
          component={'img'}
          src={
            mode === 'light' && !colorInvert
              ? 'https://github.com/ac12644/Crypto-Charity/blob/main/images/crypto-charity-light.png?raw=true'
              : 'https://github.com/ac12644/Crypto-Charity/blob/main/images/crypto-charity-dark.png?raw=true'
          }
          height={0.4}
          width={0.4}
        />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems={'center'}>
        <Box>
          <NavItem items={pages} colorInvert={colorInvert} />
        </Box>
        <Box marginLeft={4}>
          <Login />
        </Box>
        <Box marginLeft={4}>
          <ThemeModeToggler />
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'flex', md: 'none' } }} alignItems={'center'}>
        <Box>
          <Login />
        </Box>
        <Box marginLeft={1}>
          <Button
            onClick={() => onSidebarOpen()}
            aria-label="Menu"
            variant={'outlined'}
            sx={{
              borderRadius: 2,
              minWidth: 'auto',
              padding: 1,
              borderColor: alpha(theme.palette.divider, 0.2),
            }}
          >
            <MenuIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.array,
  colorInvert: PropTypes.bool,
};

export default Topbar;
