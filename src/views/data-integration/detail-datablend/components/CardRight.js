import * as React from 'react';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { updateCheckEdit } from '~/redux/slices/project';
import FormAddConnection from './FormAddConnection';
import FormAddDataset from './FormAddDataset';
import FormAddPipline from './FormAddPipline';
import FormUpdateConnection from './UpdateModule/FormUpdateConnection';
import FormUpdateDataset from './UpdateModule/FormUpdateDataset';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  cardStyle: {
    height: '98%',
    zIndex: 1000,
    position: 'fixed',
    right: '-100%',
    top: '1%',
    borderRadius: '8px 0px 0px 8px',
    backgroundColor: theme.palette.background.default,
    transition: 'all .7s'
  },
  openCardRight: {
    right: '0.5%'
  },
  boxCustomForm: {
    overflowY: 'auto',
    marginBottom: '20px',
    paddingRight: '10px',
    paddingTop: '10px'
  }
}));

export default function BasicCard({
  isOpen,
  setIsOpen,
  idProject,
  keyMessage,
  valueForm
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { checkEdit, typeEdit, diDetail } = useSelector(state => state.project);

  React.useEffect(() => {
    if (checkEdit == true) setIsOpen(true);
    else setIsOpen(false);
  }, [checkEdit]);

  React.useEffect(() => {
    if (checkEdit == true) dispatch(updateCheckEdit(false));
  }, [diDetail]);

  const renderForm = () => {
    switch (valueForm) {
      case 'Dataset':
        return <FormAddDataset setIsOpen={setIsOpen} idProject={idProject} />;
      case 'Connection':
        return (
          <FormAddConnection setIsOpen={setIsOpen} idProject={idProject} />
        );
      case 'Pipeline':
        return <FormAddPipline setIsOpen={setIsOpen} idProject={idProject} />;
      default:
        break;
    }
  };

  const renderContent = () => {
    if (checkEdit == true) {
      if (typeEdit == 'DATASET')
        return (
          <FormUpdateDataset setIsOpen={setIsOpen} idProject={idProject} />
        );
      else if (typeEdit == 'CONNECTION')
        return (
          <FormUpdateConnection setIsOpen={setIsOpen} idProject={idProject} />
        );
      else if (typeEdit == 'PIPELINE')
        return <FormAddPipline setIsOpen={setIsOpen} idProject={idProject} />;
    } else return renderForm();
  };

  return (
    <Card
      sx={{ width: '30vw' }}
      className={clsx(classes.cardStyle, isOpen ? classes.openCardRight : '')}
    >
      <CardContent>
        <Box sx={{ borderColor: 'divider' }}>
          <Typography
            id="keep-mounted-modal-title"
            variant="h5"
            sx={{
              mb: 3,
              padding: '10px 5px 10px 5px'
            }}
          >
            {checkEdit == true ? 'Update Modal' : 'Add'} {valueForm}
          </Typography>
          {renderContent()}
        </Box>
      </CardContent>
    </Card>
  );
}
