import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AsyncLoader from '~/components/AsyncLoader';

const Infra = React.lazy(() => import('infra/InfraDashboard'));

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
  },
  main: {
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    position: 'relative'
    // paddingTop: APP_BAR_MOBILE + 40,
    // paddingBottom: theme.spacing(10),
    // [theme.breakpoints.up('lg')]: {
    //   paddingTop: 0
    // }
  }
}));

const InfraDashboard = props => {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <AsyncLoader>
        <Infra {...props} />
      </AsyncLoader>
    </div>
  );
};

export default InfraDashboard;
