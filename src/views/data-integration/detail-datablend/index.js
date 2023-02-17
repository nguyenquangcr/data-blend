import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import BasicCard from './components/CardRight';
import ListComponent from './components/List';
import { makeStyles } from '@mui/styles';
import { useParams } from 'react-router';
import {
  changeCheckIdProjectPageDetail,
  changeIsOpenLeftMenu,
  createPipeline,
  getListConnections,
  getListDatasets,
  getListPipelines,
  updateDiPageDetail,
  updateIdProject
} from '~/redux/slices/project';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { ToastContainer, toast } from 'react-toastify';
import HeaderDashboard from '~/components/HeaderDashboard';
import { MIcon } from '~/@material-extend';
import DetailBotComponent from './components/DetailBotComponent';
import DetailTopComponent from './components/DetailTopComponet';
import Activities from './components/Activities';
import { IconDefault } from './constant';
import LoadingButton from '@mui/lab/LoadingButton';
import monitorOutline from '@iconify-icons/eva/monitor-outline';
import { valueTabContext } from '~/App';
//style
import '../style.scss';

const DetailDatablend = () => {
  //Store
  const dispatch = useDispatch();
  const {
    diConection,
    diDataset,
    diDetail,
    typeDetail,
    diCreatePipline,
    isLoading,
    diPageDetail,
    isOpenLeftMenu
  } = useSelector(state => state.project);
  //Params
  const { idProject } = useParams();
  //context
  const [valueTab, setValueTab] = React.useContext(valueTabContext);
  //State
  const [openFactory, setOpenFactory] = useState(true);
  const [valueForm, setValueForm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [gridOne, setGridOne] = useState('20%');
  const [gridTwo, setGridTwo] = useState('86.5%');

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary
  }));

  const useStyles = makeStyles(theme => ({
    root: {},
    customGridItem1: {
      position: 'relative',
      overflow: 'auto',
      padding: '10px',
      height: gridOne,
      borderRadius: '16px',
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0',
      borderBottom: 'solid 1px #0000004d',
      boxShadow:
        '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
    },
    customGridItem2: {
      position: 'relative',
      overflow: 'auto',
      height: gridTwo,
      borderRadius: '16px',
      borderTopLeftRadius: '0',
      borderTopRightRadius: '0',
      boxShadow:
        '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
    },
    customGridItem3: {
      position: 'relative',
      overflow: 'auto',
      height: '100%',
      boxShadow:
        '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
    },
    cutomPoint: {
      position: 'absolute',
      top: '0.5%',
      left: '51%',
      transform: 'translate(-50%, -50%)',
      content: '""',
      width: '3%',
      height: '6px',
      borderRadius: '10px',
      backgroundColor: ' #242424',
      cursor: 'n-resize'
    },
    avatar: {
      zIndex: 9,
      width: 32,
      height: 32,
      bottom: -16,
      position: 'absolute',
      left: theme.spacing(3)
    },
    customBox: {
      backgroundColor:
        theme.palette.mode != 'dark' && theme.palette.action.focus
    },
    customIconDefault: {
      '& svg': {
        width: '40vw !important'
      }
    },
    labelGridMain: {
      marginLeft: '16%',
      '@media(max-width: 1500px)': {
        marginLeft: '0%'
      }
    },
    colapseNavbar: {
      position: 'fixed',
      top: '150px',
      left: '1%',
      maxHeight: '97%',
      overflow: 'auto',
      width: '14%',
      height: 'auto',
      transition:
        'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, background-color 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
      margin: '1rem',
      '@media(max-width: 1500px)': {
        border: 'none',
        transform: 'translateX(0)',
        transition: 'transform 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        zIndex: ' 1200',
        width: '25vw',
        minWidth: ' 13rem',
        borderRadius: '10px',
        boxShadow: 'rgb(0 0 0 / 5%) 0rem 1.25rem 1.6875rem 0rem',
        maxHeight: '75vh'
      }
    },
    closeNavRight: {
      transition:
        'width 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, background-color 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
      '@media(max-width: 1500px)': {
        border: 'none',
        transform: 'translateX(-23rem)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        zIndex: ' 1200'
      }
    },
    labelBoxIconHeaderReponsive: {
      display: 'none',
      '@media(max-width: 1500px)': {
        display: 'block'
      }
    },
    labelContainerList: {
      width: openFactory ? '350px' : '65px',
      marginRight: '10px',
      height: '79vh'
    }
  }));
  const classes = useStyles();

  useEffect(() => {
    dispatch(getListConnections(idProject));
    dispatch(updateIdProject(idProject));
    dispatch(getListDatasets(idProject));
    dispatch(getListPipelines(idProject));
    dispatch(updateDiPageDetail(true));
    dispatch(changeCheckIdProjectPageDetail(idProject));
  }, []);

  useEffect(() => {
    if (typeDetail != 'dataset') setValueTab({ ...valueTab, tabDataset: 0 });
    if (typeDetail == 'pipeline') {
      setGridOne('55%');
      setGridTwo('51.5%');
    } else {
      setGridOne('20%');
      setGridTwo('86.5%');
    }
  }, [typeDetail]);

  return (
    <>
      <Box sx={{ flexGrow: 1, minHeight: '100%' }}>
        <div style={{ display: 'flex' }}>
          <HeaderDashboard
            links={[
              { name: 'List Datablend', href: '/app/di' },
              { name: 'Detail Projects', href: `/app/di/${idProject}` },
              { name: 'Orchestrate' }
            ]}
          ></HeaderDashboard>
          {diCreatePipline != [] &&
            typeDetail == 'pipeline' &&
            diDetail != '' &&
            diDetail.typeLocal == 'new' && (
              <LoadingButton
                loading={isLoading}
                sx={{ marginLeft: '1vw', padding: '10px', maxHeight: '45px' }}
                color="primary"
                variant="contained"
                onClick={() => {
                  let choosePipeline = diCreatePipline.find(
                    item => item.id == diDetail.id
                  );
                  let arrOperators = [];
                  choosePipeline?.operators?.map(item => {
                    if (item.type == 'ftelsqlNode') {
                      return arrOperators.push({
                        name: item?.name,
                        policy: {
                          retries: item?.retries
                        },
                        dependsOn: item?.dependsOn,
                        properties: {
                          serviceConnection: item?.serviceConnection,
                          scriptConnection: item?.scriptConnection,
                          scriptPath: item?.scriptPath,
                          type: 'FtelSqlOperator'
                        }
                      });
                    } else {
                      let arrMapping = [];
                      item?.mapping?.map(map => {
                        if (map?.encryptionKey?.value == '') {
                          return arrMapping.push({
                            source: {
                              name: map?.sourceName,
                              dataType: map?.sourceDataType
                            },
                            sink: {
                              name: map?.sinkName,
                              dataType: map?.sinkDataType,
                              expression: map?.expression
                            }
                          });
                        } else {
                          return arrMapping.push({
                            source: {
                              name: map?.sourceName,
                              dataType: map?.sourceDataType
                            },
                            sink: {
                              name: map?.sinkName,
                              dataType: map?.sinkDataType,
                              expression: map?.expression
                            },
                            encryptionKey: map?.encryptionKey
                          });
                        }
                      });
                      return arrOperators.push({
                        name: item?.name,
                        policy: {
                          retries: item?.retries
                        },
                        dependsOn: item?.dependsOn,
                        properties: {
                          source: {
                            datasetId: item?.source?.datasetId,
                            parameters:
                              item?.source?.parameters != null
                                ? item?.source?.parameters
                                : undefined
                          },
                          sink: {
                            datasetId: item?.sink?.datasetId,
                            saveMode: item?.sink?.saveMode,
                            parameters:
                              item?.sink?.parameters != null
                                ? item?.sink?.parameters
                                : undefined
                          },
                          mapping: arrMapping,
                          type: 'CopyOperator'
                        }
                      });
                    }
                  });
                  const formatValue = {
                    name: choosePipeline?.name,
                    description: choosePipeline?.description,
                    operators: arrOperators,
                    policy: {
                      schedule_interval: choosePipeline?.schedule_interval,
                      start_date: choosePipeline?.start_date,
                      timeout: choosePipeline?.timeout
                    },
                    parameters: choosePipeline?.parameters
                  };
                  dispatch(
                    createPipeline(
                      idProject,
                      formatValue,
                      diCreatePipline,
                      diDetail
                    )
                  );
                }}
              >
                Publish Pipeline
              </LoadingButton>
            )}
          {diPageDetail == true && (
            <Button
              sx={{ marginLeft: '1vw', padding: '10px', maxHeight: '45px' }}
              disableRipple
              to={`/app/di/${idProject}/pipelinerun`}
              component={RouterLink}
              endIcon={<Icon icon={monitorOutline} />}
            >
              Monitor
            </Button>
          )}
          <Box className={classes.labelBoxIconHeaderReponsive}>
            {isOpenLeftMenu == false ? (
              <IconButton
                sx={{
                  marginLeft: '1vw',
                  padding: '10px',
                  maxHeight: '45px',
                  color: '#3853c8'
                }}
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() =>
                  dispatch(changeIsOpenLeftMenu({ value: !isOpenLeftMenu }))
                }
              >
                <MenuIcon fontSize="medium" />
              </IconButton>
            ) : (
              <IconButton
                sx={{
                  marginLeft: '1vw',
                  padding: '10px',
                  maxHeight: '45px',
                  color: '#3853c8'
                }}
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() =>
                  dispatch(changeIsOpenLeftMenu({ value: !isOpenLeftMenu }))
                }
              >
                <MenuOpenIcon fontSize="medium" />
              </IconButton>
            )}
          </Box>
        </div>
        <Grid sx={{ minHeight: '100%' }} container spacing={1}>
          <Grid sx={{ display: 'flex' }} item xs={12} md={12}>
            <Box className={classes.labelContainerList}>
              <ListComponent
                idProject={idProject}
                listConection={diConection}
                listDataset={diDataset}
                setIsOpen={setIsOpen}
                setValueForm={setValueForm}
                openFactory={openFactory}
                setOpenFactory={setOpenFactory}
              />
            </Box>
            {diDetail == '' ? (
              <Grid container spacing={1}>
                <Grid sx={{ height: '80vh' }} item xs={12} md={12}>
                  <Paper
                    sx={{ borderRadius: '16px' }}
                    className={classes.customGridItem3}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        position: 'absolute',
                        top: '45%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                      className={classes.customIconDefault}
                    >
                      <MIcon
                        color=""
                        src={
                          'https://databricks.com/wp-content/uploads/2021/11/Graphic-header-solutions.svg'
                        }
                        className={classes.avatarShape}
                      />
                      <Typography variant="h4" sx={{ mb: 1, mt: 2 }}>
                        {IconDefault.name}
                      </Typography>
                      <Typography variant="h7" sx={{ mb: 1 }}>
                        {IconDefault.des}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Grid sx={{ borderRadius: '16px' }} container spacing={1}>
                <Grid
                  sx={{ height: '75vh', display: 'flex' }}
                  item
                  xs={12}
                  md={12}
                >
                  {typeDetail == 'pipeline' && <Activities />}
                  <Box sx={{ width: '100%' }}>
                    <Paper className={classes.customGridItem1} id={'top'}>
                      <DetailTopComponent />
                    </Paper>
                    <Item className={classes.customGridItem2} id={'bot'}>
                      <DetailBotComponent />
                    </Item>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
      <BasicCard
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        idProject={idProject}
        keyMessage={key => {
          toast.success(key, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }}
        valueForm={valueForm}
      />
    </>
  );
};

export default React.memo(DetailDatablend);
