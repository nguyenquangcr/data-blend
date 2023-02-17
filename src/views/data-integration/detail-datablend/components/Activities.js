import {
  List,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MIcon } from '~/@material-extend';
import { IconCopyDataOpe, IconDrag, IconSqlOpe } from '../constant';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import clsx from 'clsx';

const Activities = () => {
  //Store
  const dispatch = useDispatch();
  const { diCreatePipline, diDetail } = useSelector(state => state.project);
  //state
  const [openActivities, setOpenActivities] = React.useState(true);

  const useStyles = makeStyles(theme => ({
    labelListActivities: {
      background: '#fff',
      marginRight: '10px',
      height: '79vh',
      padding: '10px 10px 25px 10px',
      borderRadius: '16px',
      boxShadow:
        '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
    },
    labelTitleSubHeader: {
      fontSize: '0.75rem',
      display: 'flex',
      justifyContent: openActivities ? 'space-between' : 'center',
      alignItems: 'center'
    },
    classContainerItemActivities: {
      display: 'flex',
      alignItems: 'center',
      padding: '2px 4px',
      border: 'solid 1.5px #3a44cd59',
      margin: '10px 10px',
      borderRadius: '3px',
      cursor: 'move',
      '& .MuiListItemText-root': {
        '& span': {
          fontSize: '0.6rem'
        }
      }
    }
  }));
  const classes = useStyles();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <List
      className={classes.labelListActivities}
      sx={{ width: openActivities ? '200px' : '50px' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          className={classes.labelTitleSubHeader}
          sx={{ marginTop: openActivities == false && '16px' }}
          component="div"
          id="nested-list-subheader"
        >
          {openActivities == true && 'Activities'}
          {openActivities == true ? (
            <KeyboardDoubleArrowLeftIcon
              cursor={'pointer'}
              onClick={() => setOpenActivities(!openActivities)}
            />
          ) : (
            <KeyboardDoubleArrowRightIcon
              cursor={'pointer'}
              onClick={() => setOpenActivities(!openActivities)}
            />
          )}
        </ListSubheader>
      }
    >
      {openActivities && (
        <>
          <Box
            className={clsx(classes.classContainerItemActivities, 'dndnode')}
            onDragStart={event => onDragStart(event, 'copyData')}
            draggable
          >
            <ListItemIcon>
              <MIcon size={'30'} color="" src={IconCopyDataOpe} />
            </ListItemIcon>
            <ListItemText primary="Copy Operators" />
            <MIcon
              size={'20'}
              color=""
              src={IconDrag}
              className={'label-animation'}
            />
          </Box>
          <Box
            className={clsx(classes.classContainerItemActivities, 'dndnode')}
            onDragStart={event => onDragStart(event, 'sql')}
            draggable
          >
            <ListItemIcon>
              <MIcon size={'25'} color="" src={IconSqlOpe} />
            </ListItemIcon>
            <ListItemText primary="Ftel SQL Operator" />
            <MIcon
              size={'20'}
              color=""
              src={IconDrag}
              className={'label-animation'}
            />
          </Box>
        </>
      )}
    </List>
  );
};

export default Activities;
