import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Box, Typography } from '@mui/material';

const Hero = ({ title, heading, subtitle, image }) => {
  useEffect(() => {
    const jarallaxInit = async () => {
      const jarallaxElems = document.querySelectorAll('.jarallax');
      if (!jarallaxElems || (jarallaxElems && jarallaxElems.length === 0)) {
        return;
      }
      const { jarallax } = await import('jarallax');
      jarallax(jarallaxElems, { speed: 0.2 });
    };

    jarallaxInit();
  });

  return (
    <Box
      className={'jarallax'}
      data-jarallax
      data-speed="0.2"
      position={'relative'}
      minHeight={{ xs: 400, sm: 500, md: 600 }}
      display={'flex'}
      alignItems={'center'}
      id="agency__portfolio-item--js-scroll"
    >
      <Box
        className={'jarallax-img'}
        sx={{
          position: 'absolute',
          objectFit: 'cover',
          fontFamily: 'object-fit: cover;',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundImage: `url(${image})`,
        }}
      />
      <Container position={'relative'} zindex={3}>
        <Typography
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'medium',
          }}
          gutterBottom
          align={'center'}
        >
          {title}
        </Typography>
        <Box marginBottom={2}>
          <Typography
            variant="h2"
            align={'center'}
            sx={{
              fontWeight: 700,
            }}
          >
            {heading}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" align={'center'}>
            {subtitle}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
Hero.propTypes = {
  title: PropTypes.string,
  headline: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
};

export default Hero;
