import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Page from '../components/Page';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-image-lightbox/style.css';
import 'aos/dist/aos.css';

import { WalletProvider, CHAIN_TYPES } from 'web3/Web3Auth/config';

export default function App({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Put A Smile</title>
      </Head>
      <WalletProvider chainType={CHAIN_TYPES.mumbai}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </WalletProvider>
    </React.Fragment>
  );
}
App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
