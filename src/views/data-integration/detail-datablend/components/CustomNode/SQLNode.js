import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';
import React from 'react';
import { Handle } from 'react-flow-renderer';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getOperatorDetalLocal, updateSelectOpe } from '~/redux/slices/project';
import { backNode, IconSqlOpe } from '../../constant';
import { MIcon } from '~/@material-extend';
import './styleHanle.scss';
import clsx from 'clsx';
import DeleteIcon from '@mui/icons-material/Delete';

const FtelSqlNode = ({ data, selected, id }) => {
  //select
  const { diDetail } = useSelector(state => state.project);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (selected == true) {
      dispatch(getOperatorDetalLocal(data));
      dispatch(updateSelectOpe(id));
    }
  }, [selected]);

  const useStyles = makeStyles(theme => ({
    avatar: {
      zIndex: 9,
      width: 32,
      height: 32,
      bottom: -16,
      position: 'absolute',
      left: theme.spacing(3)
    },
    customLabelNode: {
      position: 'relative',
      backgroundImage: `url(${backNode})`,
      backgroundPosition: ' 50% center',
      backgroundSize: ' cover',
      zIndex: '-2',
      minWidth: '160px'
    },
    active: {
      '&:after': {
        content: "''",
        backgroundImage:
          ' linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))',
        display: ' block',
        top: '-2px',
        left: '-2px',
        width: '102%',
        height: '103%',
        borderRadius: '8px',
        position: ' absolute',
        opacity: ' 0.65',
        zIndex: '-1'
      }
    },
    labelTextOverFlow: {
      maxWidth: '160px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    customIcon: {
      '& svg': {
        background: ' rgb(255, 255, 255)',
        color: ' rgb(52, 71, 103)',
        borderRadius: ' 0.5rem',
        boxShadow:
          ' rgb(20 20 20 / 12%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(20 20 20 / 7%) 0rem 0.125rem 0.25rem -0.0625rem',
        display: ' grid',
        placeItems: ' center',
        padding: '4px',
        margin: '7px 10px'
      },
      '& div': {
        textAlign: 'start'
      }
    },
    customCardContent: {
      padding: '0 12px',
      paddingBottom: '0 !important'
    },
    customText: {
      whiteSpace: 'nowrap',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '10px',
      fontWeight: '500'
    },
    customBtnDeleteNode: {
      minWidth: '20px',
      '& svg': {
        color: '#000000b5',
        width: '15px',
        height: '15px'
      }
    },
    customCardAction: {
      padding: '7px 0'
    },
    customCardMedia: {
      display: 'flex',
      alignItems: 'center'
    }
  }));
  const classes = useStyles();

  const renderIconDelete = () => {
    if (selected == true && diDetail.typeLocal == 'new') {
      return (
        <CardActions className={classes.customCardAction}>
          <Button
            style={{ zIndex: '10' }}
            className={classes.customBtnDeleteNode}
            size="small"
            onClick={e => {
              e.stopPropagation();
              data?.onDelete(data.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </CardActions>
      );
    }
  };

  return (
    <Box
      className={clsx(selected ? classes.active : '', classes.customLabelNode)}
      sx={{
        maxWidth: 200,
        maxHeight: 140,
        border: 'solid 2px #00000024',
        borderRadius: '10px',
        cursor: 'pointer'
      }}
    >
      <Handle
        style={{ zIndex: '10' }}
        className="circle-port circle-port-left"
        type="target"
        position="left"
      />
      <Handle
        style={{ zIndex: '10' }}
        className="circle-port circle-port-right"
        type="source"
        position="right"
      />
      <CardMedia alt="Copy data" className={classes.customCardMedia}>
        <MIcon
          size={'30'}
          color=""
          src={IconSqlOpe}
          className={classes.customIcon}
        />
        <Typography className={classes.customText} variant="h7" component="div">
          {data.label}
        </Typography>
      </CardMedia>
      <CardContent className={classes.customCardContent}>
        {renderIconDelete()}
      </CardContent>
    </Box>
  );
};

export default FtelSqlNode;
