import {
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MIcon } from '~/@material-extend';
import { FCC, FDT, GLC, PCC, PDT, FSSC, PQDT, DDT, UDT } from '../../constant';
import { updateCheckEdit, updateTypeEdit } from '~/redux/slices/project';
import ModalConfirmComponent from '../ModalConfirm';
import DetailTopPipelineComponent from '../OperatorLocalComponent/TestDragNode';
import OperatorApiComponent from '../OperatorApiComponent';

const DetailTopComponent = () => {
  const {
    typeDetail,
    diDetail,
    diCreatePipline,
    diOperatorDetail,
    diFormDirty
  } = useSelector(state => state.project);
  const dispatch = useDispatch();
  //state
  const [openModalAdd, setopenModalAdd] = React.useState(false);
  const [ope, setOpe] = React.useState('');

  const useStyles = makeStyles(theme => ({
    avatar: {
      zIndex: 9,
      width: 32,
      height: 32,
      bottom: -16,
      position: 'absolute',
      left: theme.spacing(3)
    },
    active: {
      backgroundColor: 'rgba(255, 112, 0, 0.08)'
    },
    labelTextOverFlow: {
      maxWidth: '160px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    customDiv: {
      height: '100%'
    }
  }));
  const classes = useStyles();

  const renderTextIcon = (valueType, key) => {
    switch (valueType) {
      case 'FtelLakeHouseConnection':
        return FCC[key];
      case 'PostgreSqlConnection':
        return PCC[key];
      case 'GitLabConnection':
        return GLC[key];
      case 'FtelSharedStorageConnection':
        return FSSC[key];
      default:
        break;
    }
  };

  const findTypeDataset = valueType => {
    switch (valueType) {
      case 'FtelLakeHouseDataset':
        return FDT;
      case 'DelimitedTextDataset':
        return DDT;
      case 'ParquetDataset':
        return PQDT;
      case 'PostgreSqlDataset':
        return PDT;
      case 'UploadedDataset':
        return UDT;
      default:
        break;
    }
  };

  const detailTop = key => {
    return (
      <Grid sx={{ minHeight: '100%', width: '23vw' }} container spacing={3}>
        <Button
          variant="contained"
          sx={{
            m: 2,
            boxShadow: 'none',
            position: 'absolute',
            top: 0,
            right: '1%'
          }}
          onClick={() => {
            dispatch(updateCheckEdit(true));
            dispatch(updateTypeEdit('CONNECTION'));
          }}
        >
          Update Connection
        </Button>
        <Grid
          item
          xs={8}
          md={6}
          sx={{
            textAlign: 'center',
            margin: 'auto'
          }}
        >
          <MIcon
            size={'80'}
            color=""
            src={renderTextIcon(key, 'pathIcon')}
            className={classes.avatarShape}
          />
        </Grid>
        <Grid item xs={4} md={6}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {diDetail.name}
          </Typography>
          <Typography>{renderTextIcon(key, 'name')}</Typography>
        </Grid>
      </Grid>
    );
  };

  const detailTopDataset = key => {
    const { type } = diDetail?.properties;
    return (
      <Grid sx={{ minHeight: '100%', width: '23vw' }} container spacing={3}>
        {type !== 'UploadedDataset' && (
          <Button
            variant="contained"
            sx={{
              m: 2,
              boxShadow: 'none',
              position: 'absolute',
              top: 0,
              right: '1%'
            }}
            onClick={() => {
              dispatch(updateCheckEdit(true));
              dispatch(updateTypeEdit('DATASET'));
            }}
          >
            Update Dataset
          </Button>
        )}
        <Grid
          item
          xs={8}
          md={6}
          sx={{
            textAlign: 'center',
            margin: 'auto'
          }}
        >
          <MIcon
            size={'80'}
            color=""
            src={findTypeDataset(key).pathIcon}
            className={classes.avatarShape}
          />
        </Grid>
        <Grid item xs={4} md={6}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {diDetail.name}
          </Typography>
          <Typography>{findTypeDataset(key).name}</Typography>
        </Grid>
      </Grid>
    );
  };

  const renderTopDetail = () => {
    switch (diDetail?.properties?.type) {
      case 'FtelLakeHouseConnection':
        return detailTop('FtelLakeHouseConnection');
      case 'PostgreSqlConnection':
        return detailTop('PostgreSqlConnection');
      case 'GitLabConnection':
        return detailTop('GitLabConnection');
      case 'FtelSharedStorageConnection':
        return detailTop('FtelSharedStorageConnection');
      case 'FtelLakeHouseDataset':
        return detailTopDataset('FtelLakeHouseDataset');
      case 'PostgreSqlDataset':
        return detailTopDataset('PostgreSqlDataset');
      case 'DelimitedTextDataset':
        return detailTopDataset('DelimitedTextDataset');
      case 'ParquetDataset':
        return detailTopDataset('ParquetDataset');
      case 'UploadedDataset':
        return detailTopDataset('UploadedDataset');
      default:
        break;
    }
  };

  const renderTopDetailPipeline = () => {
    if (diDetail.typeLocal == 'new') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <Button
            variant="contained"
            sx={{
              m: 2,
              boxShadow: 'none',
              position: 'absolute',
              top: '1%',
              right: '10%',
              zIndex: '10'
            }}
            onClick={() => {
              dispatch(updateCheckEdit(true));
              dispatch(updateTypeEdit('PIPELINE'));
            }}
          >
            Update Pipeline
          </Button>
          <DetailTopPipelineComponent />
        </div>
      );
    } else {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <Button
            variant="contained"
            sx={{
              m: 2,
              boxShadow: 'none',
              position: 'absolute',
              top: 0,
              right: '1%',
              zIndex: '10'
            }}
            onClick={() => {
              dispatch(updateCheckEdit(true));
              dispatch(updateTypeEdit('PIPELINE'));
            }}
          >
            Update Pipeline
          </Button>
          <OperatorApiComponent />
        </div>
      );
    }
  };

  const renderDetail = () => {
    switch (typeDetail) {
      case 'connection':
        return renderTopDetail();
      case 'dataset':
        return renderTopDetail();
      case 'pipeline':
        return renderTopDetailPipeline();
      default:
        break;
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%'
        }}
        className={typeDetail == 'pipeline' && classes.customDiv}
      >
        {renderDetail()}
      </div>
      <ModalConfirmComponent
        open={openModalAdd}
        setOpen={setopenModalAdd}
        ope={ope}
      />
    </>
  );
};

export default React.memo(DetailTopComponent);
