import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import HeaderDashboard from '~/components/HeaderDashboard';
import { makeStyles } from '@mui/styles';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import { useHistory, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  changeCheckIdProjectPageDetail,
  getDetailProjects
} from '~/redux/slices/project';

const useStyles = makeStyles(theme => ({
  boxMain: {
    display: 'flex',
    marginLeft: '0',
    margin: '30px'
  },
  customTitle: {
    margin: '0px',
    fontSize: '1.5rem',
    lineHeight: '1.3',
    fontFamily: 'Roboto, sans-serif',
    letterSpacing: '-0.00833em',
    opacity: '1',
    textTransform: 'capitalize',
    verticalAlign: 'unset',
    textDecoration: 'none',
    color: 'rgb(52, 71, 103)',
    fontWeight: '700'
  },
  customTitle1: {
    margin: '0px',
    fontSize: '1.3rem',
    lineHeight: '1.3',
    fontFamily: 'Roboto, sans-serif',
    letterSpacing: '-0.00833em',
    opacity: '1',
    textTransform: 'capitalize',
    verticalAlign: 'unset',
    textDecoration: 'none',
    color: 'rgb(52, 71, 103)',
    fontWeight: '700'
  },
  customIcon: {
    color: 'white'
  },
  boxCustomIcon: {
    width: '3rem',
    height: '3rem',
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: '1',
    background: '#3852c8',
    color: 'rgb(255, 255, 255)',
    borderRadius: '0.5rem',
    boxShadow:
      'rgb(20 20 20 / 12%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(20 20 20 / 7%) 0rem 0.125rem 0.25rem -0.0625rem'
  },
  customBoxItem: {
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.87)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    minWidth: '0px',
    overflowWrap: 'break-word',
    backgroundColor: 'rgb(255, 255, 255)',
    backgroundClip: 'border-box',
    border: '0px solid rgba(0, 0, 0, 0.125)',
    borderRadius: '8px',
    boxShadow: 'rgb(0 0 0 / 5%) 0rem 1.25rem 1.6875rem 0rem',
    width: '250px',
    padding: '16px',
    '&:hover': {
      boxShadow: 'rgb(0 0 0 / 35%) 0px 5px 15px'
    }
  }
}));

const OrchestratePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { idProject } = useParams();
  const history = useHistory();

  React.useEffect(() => {
    dispatch(getDetailProjects(idProject));
    dispatch(changeCheckIdProjectPageDetail(idProject));
  }, []);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100%' }}>
      <div style={{ display: 'flex' }}>
        <HeaderDashboard
          links={[
            { name: 'List Datablend', href: '/di' },
            { name: 'Detail Projects' }
          ]}
        ></HeaderDashboard>
      </div>
      <Grid
        sx={{
          minHeight: '80%',
          width: '95%',
          margin: 'auto',
          display: 'block'
        }}
        container
        spacing={1}
      >
        <Box>
          <Typography className={classes.customTitle} variant="h4">
            General Statistics
          </Typography>
        </Box>

        <Box className={classes.boxMain}>
          <Box
            sx={{ marginRight: '100px' }}
            className={classes.customBoxItem}
            onClick={() => {
              history.push(`/app/di/${idProject}/uploadfile`);
            }}
          >
            <Typography
              sx={{ mr: 3 }}
              className={classes.customTitle1}
              variant="h6"
            >
              Ingest
            </Typography>
            <Box className={classes.boxCustomIcon}>
              <UploadFileOutlinedIcon className={classes.customIcon} />
            </Box>
          </Box>
          <Box
            className={classes.customBoxItem}
            onClick={() => {
              history.push(`/app/di/${idProject}/orchestrate`);
            }}
          >
            <Typography
              sx={{ mr: 3 }}
              className={classes.customTitle1}
              variant="h6"
            >
              Orchestrate
            </Typography>
            <Box className={classes.boxCustomIcon}>
              <TableViewOutlinedIcon className={classes.customIcon} />
            </Box>
          </Box>
        </Box>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default OrchestratePage;
