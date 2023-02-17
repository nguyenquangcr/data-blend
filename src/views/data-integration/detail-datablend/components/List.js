import React, { useState, useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { Box, Popover, Tooltip, Typography } from '@mui/material';
import moreHorizontalOutline from '@iconify-icons/eva/more-horizontal-outline';
import closeFill from '@iconify-icons/eva/close-fill';
import { Icon } from '@iconify/react';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteConnection,
  deleteDataset,
  getDetailConnection,
  getDetailDataset,
  updateType,
  updatePipelineLocal,
  getDetailPipeline,
  getOperatorDetalLocal,
  addOperatorPipelineLocal,
  resetDiDetail,
  deletePipeline,
  updateSelectOpe,
  getPartialList,
  resetPartialList
} from '~/redux/slices/project';
import { enumStatusPipeline } from '../constant';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import CheckIcon from '@mui/icons-material/Check';
import PauseIcon from '@mui/icons-material/Pause';
import { MIcon } from '~/@material-extend';
import ModalConfirm from '../../../../components/ModalConfirm';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
//constant
const ContainerHeight = 200;

const ListComponent = ({
  idProject,
  setIsOpen,
  setValueForm,
  openFactory,
  setOpenFactory
}) => {
  const dispatch = useDispatch();
  const {
    diDetail,
    typeDetail,
    diCreatePipline,
    diApiPipline,
    partialList
  } = useSelector(state => state.project);
  const [openModalComfirmDelete, setOpenModalComfirmDelete] = useState(false);
  const [resource, setResource] = useState({});

  const useStyles = makeStyles(theme => ({
    iconDelete: {
      display: 'none'
    },
    customBox: {
      backgroundColor:
        theme.palette.mode != 'dark' && theme.palette.action.focus
    },
    hoverItemConnection: {
      '&:hover .label-icon-delete-connection': {
        display: 'block'
      }
    },
    hoverItemDataset: {
      '&:hover .label-icon-delete-dataset': {
        display: 'block'
      }
    },
    active: {
      backgroundColor: 'rgba(255, 112, 0, 0.08)'
    },
    labelTextOverFlow: {
      '& .MuiListItemText-primary': {
        color: 'rgb(52, 71, 103)',
        fontWeight: '500',
        fontSize: '0.8rem'
      },
      '& span': {
        maxWidth: '160px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    labelTitleSubHeader: {
      margin: '1rem 0',
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      lineHeight: '1.5',
      letterSpacing: '0.02857em',
      color: 'rgb(28 32 38)',
      fontWeight: '500',
      textAlign: 'center',
      backgroundColor: 'transparent',
      display: 'flex',
      justifyContent: openFactory ? 'space-between' : 'center'
    },
    labelHr: {
      flexShrink: ' 0',
      borderTop: ' 0px solid rgba(0, 0, 0, 0.12)',
      borderRight: ' 0px solid rgba(0, 0, 0, 0.12)',
      borderLeft: ' 0px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: ' transparent',
      height: ' 0.0625rem',
      borderBottom: ' none',
      opacity: ' 0.25',
      backgroundImage:
        ' linear-gradient(to right, rgba(52, 71, 103, 0), rgba(52, 71, 103, 0.5), rgba(52, 71, 103, 0)) !important'
    },
    labelTitleListItem: {
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: '0.5rem',
      margin: '1rem 0',
      '& span': {
        color: 'rgb(52, 71, 103)',
        fontWeight: '500',
        fontSize: '0.9rem',
        lineHeight: '0'
      }
    },
    classActive: {
      backgroundColor: '#e7eaf8'
    },
    avatarShape: {
      backgroundColor: 'rgb(233, 236, 239)',
      borderRadius: '0.5rem',
      padding: '5px',
      boxShadow:
        'rgb(20 20 20 / 12%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(20 20 20 / 7%) 0rem 0.125rem 0.25rem -0.0625rem'
    },
    avatarShapePipeline: {
      backgroundColor: 'rgb(233, 236, 239)',
      borderRadius: '0.5rem',
      padding: '5px',
      boxShadow:
        'rgb(20 20 20 / 12%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(20 20 20 / 7%) 0rem 0.125rem 0.25rem -0.0625rem',
      fontSize: '25px'
    },
    labelIconExpan: {
      background:
        'linear-gradient(90deg, rgba(56,83,200,1) 0%, rgba(28,51,158,1) 100%)',
      color: 'rgb(255, 255, 255)',
      borderRadius: '0.5rem',
      boxShadow:
        'rgb(20 20 20 / 12%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(20 20 20 / 7%) 0rem 0.125rem 0.25rem -0.0625rem'
    },
    customBoxLoadingStatusPipeline: {
      padding: '5px 6px',
      boxShadow:
        'rgb(20 20 20 / 12%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(20 20 20 / 7%) 0rem 0.125rem 0.25rem -0.0625rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgb(233, 236, 239)',
      height: '29px',
      '&.span': {
        width: '13px',
        height: '13px'
      }
    }
  }));
  const classes = useStyles();
  //state
  const [open, setOpen] = React.useState({
    con: false,
    dat: false,
    pip: false
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [typeRightForm, setTypeRightForm] = useState('');
  const [arrPipeline, setarrPipeline] = useState([]);

  useEffect(() => {
    if (diApiPipline && diCreatePipline)
      setarrPipeline(diCreatePipline.concat(diApiPipline));
  }, [diCreatePipline, diApiPipline]);

  useEffect(() => {
    appendData('con');
    appendData('dat');
    return () => {
      dispatch(resetPartialList());
    };
  }, []);

  const appendData = key => {
    switch (key) {
      case 'con':
        if (
          partialList?.totalConnection !==
          partialList.partialListConnection?.length
        )
          return dispatch(
            getPartialList(
              idProject,
              partialList.partialListConnection?.length,
              7,
              'connections'
            )
          );
      case 'dat':
        if (
          partialList?.totalDataset !== partialList.partialListDataset?.length
        )
          return dispatch(
            getPartialList(
              idProject,
              partialList.partialListDataset?.length,
              7,
              'datasets'
            )
          );
      default:
        break;
    }
  };
  const onScroll = (e, key) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData(key);
    }
  };

  const handleClickPOP = (e, type) => {
    e.stopPropagation();
    setTypeRightForm(type);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (key, text) => {
    setOpen(preState => ({ ...preState, [key]: !open[key] }));
  };

  const confirmDeleteConnection = id => {
    dispatch(deleteConnection(idProject, id));
    if (diDetail.id == id) dispatch(resetDiDetail());
    setOpenModalComfirmDelete(false);
  };

  const confirmDeleteDataset = id => {
    dispatch(deleteDataset(idProject, id));
    if (diDetail.id == id) dispatch(resetDiDetail());
    setOpenModalComfirmDelete(false);
  };

  const confirmDeletePipeline = (id, typeLocal) => {
    if ((diDetail.typeLocal == 'new') | (typeLocal == 'new')) {
      let index = '';
      index = diCreatePipline.findIndex(item => item.id == id);
      let dataEnd = [...diCreatePipline];
      dataEnd.splice(index, 1);
      dispatch(addOperatorPipelineLocal(dataEnd, 'deletePipelineLocal'));
    } else {
      dispatch(deletePipeline(idProject, id));
    }
    if (diDetail.id == id) {
      dispatch(updatePipelineLocal(''));
      dispatch(getOperatorDetalLocal(''));
      dispatch(updateType(''));
    }
    setOpenModalComfirmDelete(false);
  };

  const renderIconStatus = status => {
    switch (status) {
      case enumStatusPipeline.notAva:
        return (
          <Box className={classes.customBoxLoadingStatusPipeline}>
            <CircularProgress style={{ width: '13px', height: '13px' }} />
          </Box>
        );
      case enumStatusPipeline.act:
        return <CheckIcon className={classes.avatarShapePipeline} />;
      case enumStatusPipeline.pau:
        return <PauseIcon className={classes.avatarShapePipeline} />;

      default:
        return <Brightness1Icon className={classes.avatarShapePipeline} />;
    }
  };

  const renderListConnection = () => {
    return partialList?.partialListConnection?.map((con, index) => {
      return (
        <>
          <ListItemButton
            sx={{ pl: 2 }}
            className={clsx(
              classes.hoverItemConnection,
              diDetail.id == con?.id && typeDetail == 'connection'
                ? classes.active
                : ''
            )}
            onClick={() => {
              dispatch(getDetailConnection(idProject, con?.id));
              dispatch(updateType('connection'));
            }}
          >
            <ListItemIcon>
              <MIcon
                size={'20'}
                color=""
                src={'/micro/bundle/di/static/icons/di/connection.svg'}
                className={classes.avatarShape}
              />
            </ListItemIcon>
            <ListItemText
              className={classes.labelTextOverFlow}
              primary={con?.name}
            />
            <Icon
              className={clsx(
                classes.iconDelete,
                'label-icon-delete-connection'
              )}
              icon={closeFill}
              width={25}
              height={25}
              onClick={e => {
                e.stopPropagation();
                setOpenModalComfirmDelete(true);
                setResource({
                  type: 'connection',
                  title: 'Delete connection',
                  id: con?.id,
                  name: con?.name
                });
              }}
            />
          </ListItemButton>
        </>
      );
    });
  };

  const renderListDatasets = () => {
    return (
      partialList?.partialListDataset &&
      partialList?.partialListDataset?.map((con, index) => {
        return (
          <>
            <ListItemButton
              sx={{ pl: 2 }}
              className={clsx(
                classes.hoverItemDataset,
                diDetail.id == con?.id && typeDetail == 'dataset'
                  ? classes.active
                  : ''
              )}
              onClick={() => {
                dispatch(getDetailDataset(idProject, con?.id));
                dispatch(updateType('dataset'));
              }}
            >
              <ListItemIcon>
                <MIcon
                  size={'20'}
                  src={'/micro/bundle/di/static/icons/di/dataset.svg'}
                  className={classes.avatarShape}
                />
              </ListItemIcon>
              <ListItemText
                className={classes.labelTextOverFlow}
                primary={con?.name}
              />
              <Icon
                className={clsx(
                  classes.iconDelete,
                  'label-icon-delete-dataset'
                )}
                icon={closeFill}
                width={25}
                height={25}
                onClick={e => {
                  e.stopPropagation();
                  setOpenModalComfirmDelete(true);
                  setResource({
                    type: 'dataset',
                    title: 'Delete dataset',
                    id: con.id,
                    name: con.name
                  });
                }}
              />
            </ListItemButton>
          </>
        );
      })
    );
  };

  const renderListPipeline = () => {
    return (
      arrPipeline &&
      arrPipeline.map((con, index) => {
        return (
          <>
            <Tooltip title={con?.status ? con?.status : 'new'}>
              <ListItemButton
                sx={{
                  pl: 2,
                  color: `${
                    (con?.status == enumStatusPipeline.act) |
                    (con?.status == enumStatusPipeline.notAva)
                      ? '#00a266'
                      : con?.status == enumStatusPipeline.pau
                      ? '#5db3ff'
                      : 'black'
                  }`
                }}
                className={clsx(
                  classes.hoverItemConnection,
                  diDetail?.id == con?.id && typeDetail == 'pipeline'
                    ? classes.active
                    : ''
                )}
                onClick={() => {
                  dispatch(updateType('pipeline'));
                  if (con.typeLocal == 'new') {
                    dispatch(updatePipelineLocal(con));
                  } else {
                    dispatch(getDetailPipeline(idProject, con?.id));
                  }
                  dispatch(getOperatorDetalLocal(''));
                  dispatch(updateSelectOpe(''));
                }}
              >
                <ListItemIcon>{renderIconStatus(con?.status)}</ListItemIcon>
                <ListItemText
                  className={classes.labelTextOverFlow}
                  primary={con?.name}
                />
                <Icon
                  className={clsx(
                    classes.iconDelete,
                    'label-icon-delete-connection'
                  )}
                  icon={closeFill}
                  width={25}
                  height={25}
                  onClick={e => {
                    e.stopPropagation();
                    setOpenModalComfirmDelete(true);
                    setResource({
                      type: 'pipeline',
                      title: 'Delete pipeline',
                      id: con?.id,
                      name: con?.name,
                      typeLocal: con?.typeLocal
                    });
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </>
        );
      })
    );
  };

  return (
    <>
      <List
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          maxWidth: 360,
          bgcolor: '#fff',
          padding: '10px 10px',
          boxShadow:
            '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)',
          transition:
            'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            className={classes.labelTitleSubHeader}
            component="div"
            id="nested-list-subheader"
          >
            {openFactory == true && 'Factory Resources'}
            {openFactory == true ? (
              <KeyboardDoubleArrowLeftIcon
                cursor={'pointer'}
                onClick={() => setOpenFactory(!openFactory)}
              />
            ) : (
              <KeyboardDoubleArrowRightIcon
                cursor={'pointer'}
                onClick={() => setOpenFactory(!openFactory)}
              />
            )}
          </ListSubheader>
        }
      >
        <hr className={classes.labelHr} />
        {openFactory == true && (
          <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <ListItemButton
              className={clsx(
                classes.labelTitleListItem,
                open?.con && classes?.classActive
              )}
              onClick={() => handleClick('con')}
            >
              <ListItemText primary="Connection" />
              <Icon
                icon={moreHorizontalOutline}
                width={25}
                height={25}
                onClick={event => {
                  handleClickPOP(event, 'Connection');
                  setIsOpen(false);
                }}
              />
            </ListItemButton>
            <Collapse in={open.con} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  mr: 2,
                  maxHeight: '200px',
                  overflow: 'auto'
                }}
                onScroll={e => onScroll(e, 'con')}
              >
                {renderListConnection()}
              </List>
            </Collapse>
            <ListItemButton
              className={clsx(
                classes.labelTitleListItem,
                open?.dat && classes?.classActive
              )}
              onClick={() => handleClick('dat')}
            >
              <ListItemText primary="Dataset" />
              <Icon
                onClick={event => {
                  handleClickPOP(event, 'Dataset');
                  setIsOpen(false);
                }}
                icon={moreHorizontalOutline}
                width={25}
                height={25}
              />
            </ListItemButton>
            <Collapse in={open.dat} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  mr: 2,
                  maxHeight: '200px',
                  overflow: 'auto'
                }}
                onScroll={e => onScroll(e, 'dat')}
              >
                {renderListDatasets()}
              </List>
            </Collapse>
            <ListItemButton
              className={clsx(
                classes.labelTitleListItem,
                open?.pip && classes?.classActive
              )}
              onClick={() => handleClick('pip')}
            >
              <ListItemText primary="Pipeline" />
              <Icon
                icon={moreHorizontalOutline}
                width={25}
                height={25}
                onClick={event => {
                  handleClickPOP(event, 'Pipeline');
                  setIsOpen(false);
                }}
              />
            </ListItemButton>
            <Collapse in={open.pip} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  mr: 2,
                  maxHeight: '200px',
                  overflow: 'auto'
                }}
              >
                {renderListPipeline()}
              </List>
            </Collapse>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'left'
              }}
            >
              <Box
                sx={{
                  py: 1,
                  pr: 1,
                  pl: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Typography
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setIsOpen(true);
                    handleClose();
                    setValueForm(typeRightForm);
                  }}
                >
                  New {typeRightForm}
                </Typography>
              </Box>
            </Popover>
          </div>
        )}
      </List>
      <ModalConfirm
        open={openModalComfirmDelete}
        setOpen={setOpenModalComfirmDelete}
        actionTitle={resource.title}
        actionDescription={
          <>
            {' '}
            Are you sure you want to delete <strong>{resource.name}</strong>?
            Your action cannot be reversed!
          </>
        }
        onClickConfirm={() => {
          resource.type == 'connection'
            ? confirmDeleteConnection(resource.id)
            : resource.type == 'dataset'
            ? confirmDeleteDataset(resource.id)
            : confirmDeletePipeline(resource.id, resource.typeLocal);
        }}
      ></ModalConfirm>
    </>
  );
};

export default ListComponent;
