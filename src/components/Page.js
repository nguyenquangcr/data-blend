import React, { forwardRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import track from '~/utils/analytics';

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', ...other }, ref) => {
  const { pathname } = useLocation();

  const sendPageViewEvent = useCallback(() => {
    track.pageview({
      page_path: pathname
    });
  }, []);

  useEffect(() => {
    sendPageViewEvent();
  }, [sendPageViewEvent]);
  return (
    <div ref={ref} {...other}>
      <Helmet>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${process.env.REACT_APP_URL}/img/dmc/apps/datablend.png`}
        />
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Page;
