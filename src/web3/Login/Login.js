import { useContext } from 'react';
import { IconButton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Account from './components/Account';
import { WalletContext } from '../Web3Auth/config';

export const Login = () => {
  const { login, logout, accountAddress, connected } =
    useContext(WalletContext);

  return (
    <div className="container">
      {connected ? (
        <Account
          icon="https://firebasestorage.googleapis.com/v0/b/virtualground-meta.appspot.com/o/nft%2Ficon.png?alt=media&token=51904b60-2b20-47aa-9502-67f4aabc8061"
          address={accountAddress}
          handleLogout={logout}
        />
      ) : (
        <IconButton color="primary" onClick={login} size="medium">
          <AccountBalanceWalletIcon fontSize="large" />
        </IconButton>
      )}
    </div>
  );
};

export default Login;
