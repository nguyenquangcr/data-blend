import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CardHeader
} from '@mui/material';
import * as yup from 'yup';
import { makeStyles, useTheme } from '@mui/styles';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import HeaderDashboard from '~/components/HeaderDashboard';
import Page from '~/components/Page';
import { OverlayLoading } from '~/views/common/OverlayLoading';
import ChunkedUpload from './ChunkedUpload';
import PreviewTable from './PreviewTable';
import { useDispatch, useSelector } from 'react-redux';
import { getListConnections } from '~/redux/slices/project';
import { ToastContainer } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  dropzone: {
    '& .dzu-dropzone': {
      overflow: 'hidden',
      backgroundImage: `url('/static/illustrations/illustration_upload.svg')`,
      backgroundPosition: 'left',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      padding: '0.5rem 0.5rem',
      height: '150px'
    },
    '& .dzu-inputLabelWithFiles': {
      display: 'none'
    },
    '& .dzu-inputLabel': {
      textAlign: 'right',
      marginLeft: '40%',
      marginRight: '5%'
    },
    '& .dzu-previewContainer': {
      flexDirection: 'column',
      alignItems: 'flex-end',
      paddingLeft: '20%',
      border: 'none'
    },
    '& .dzu-previewFileName': {
      fontFamily: 'system-ui'
    }
  },
  progress: {
    '& .MuiLinearProgress-root': {
      height: 10
    }
  },
  customTitleHeader: {
    margin: '0px',
    marginBottom: '10px',
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
  }
}));

function LinearProgressWithLabel(props) {
  const { value, classes } = props;
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', width: 400 }}
      className={classes.progress}
    >
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function UploadFile() {
  const dispatch = useDispatch();
  //selector
  const { diConection } = useSelector(state => state.project);
  //style
  const classes = useStyles();
  //theme
  const theme = useTheme();
  //param
  const { idProject } = useParams();
  //state
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);
  const [checkFile, setCheckFile] = useState([]);
  const [checkErrFile, setCheckErrFile] = useState(false);

  useEffect(() => {
    dispatch(getListConnections(idProject));
  }, []);

  useEffect(() => {
    if (checkFile.length !== 0) setCheckErrFile(false);
  }, [checkFile]);

  const formik = useFormik({
    initialValues: {
      idProject,
      file: '',
      connection: ''
    },
    validationSchema: Yup.object({
      connection: yup
        .string('Choose your connection')
        .required('Connection is required')
    }),
    onSubmit: values => {
      if (checkFile.length !== 0) {
        setIsFetching(true);
        setCurrentChunkIndex(0);
        setCheckErrFile(false);
      } else setCheckErrFile(true);
    }
  });

  return (
    <Page title="Job">
      <Container maxWidth="xl">
        <HeaderDashboard
          links={[
            { name: 'List Datablend', href: '/app/di' },
            { name: 'Detail Projects', href: `/app/di/${idProject}` },
            { name: 'Upload file' }
          ]}
        ></HeaderDashboard>
        <Grid container spacing={2}>
          <Grid item md={4} sm={12}>
            <Typography
              className={classes.customTitleHeader}
              variant="h5"
              component="div"
            >
              upload file
            </Typography>
            <Card>
              <CardContent>
                <form onSubmit={formik.handleSubmit}>
                  <OverlayLoading isLoading={isFetching}>
                    <Box
                      sx={{
                        position: 'absolute',
                        display: 'inline-flex',
                        top: '50%',
                        left: '10%',
                        zIndex: 10
                      }}
                    >
                      {(1 || progress === 100) && (
                        <LinearProgressWithLabel
                          value={progress}
                          classes={classes}
                        />
                      )}
                    </Box>
                  </OverlayLoading>
                  <Grid container spacing={2}>
                    <Grid item sm={12} className={classes.dropzone}>
                      <ChunkedUpload
                        currentChunkIndex={currentChunkIndex}
                        setCurrentChunkIndex={setCurrentChunkIndex}
                        setIsFetching={setIsFetching}
                        setProgress={setProgress}
                        formik={formik}
                        isFetching={isFetching}
                        setCheckFile={setCheckFile}
                      />
                      {checkErrFile == true && (
                        <FormHelperText sx={{ color: '#FF4842' }}>
                          Please import file !{' '}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item sm={12} textAlign="left">
                      <FormControl
                        fullWidth
                        sx={{ mb: 2 }}
                        error={
                          formik.touched.connection &&
                          Boolean(formik.errors.connection)
                        }
                      >
                        <InputLabel className={classes.cssLabel}>
                          Connection *
                        </InputLabel>
                        <Select
                          id="connection"
                          name="connection"
                          label="Connection"
                          value={formik.values.connection}
                          onChange={formik.handleChange}
                        >
                          {diConection &&
                            diConection
                              .filter(
                                item =>
                                  item?.properties?.type ==
                                  'FtelLakeHouseConnection'
                              )
                              .map(item => {
                                return (
                                  <MenuItem value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                );
                              })}
                        </Select>
                        <FormHelperText>
                          {formik.touched.connection &&
                            formik.errors.connection}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} textAlign="right">
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={8} sm={12}>
            <Typography
              className={classes.customTitleHeader}
              variant="h5"
              component="div"
            >
              History upload
            </Typography>
            <Card>
              <PreviewTable />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer />
    </Page>
  );
}
