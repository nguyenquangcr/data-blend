import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import { Box, Typography, Modal, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  createProject,
  getOperatorDetalLocal,
  updateFormDirty
} from '~/redux/slices/project';
import { makeStyles } from '@mui/styles';
// import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '5%'
};

const useStyles = makeStyles(theme => ({
  cssLabel: {
    color: '#3853c8'
  }
}));

export default function ModalConfirmComponent({ open, setOpen, ope }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { diDetail } = useSelector(state => state.project);

  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h5">
          Action Confirm
        </Typography>
        <Typography id="server-modal-description" sx={{ pt: 2, mb: 3 }}>
          Changes you made may not be saved.
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{
              width: '40%',
              mr: 2
            }}
            color="primary"
            variant="contained"
            onClick={() => {
              if (diDetail.typeLocal == 'new') {
                dispatch(updateFormDirty(false));
                dispatch(getOperatorDetalLocal(ope));
              }
            }}
          >
            Confirm
          </Button>
          <Button
            sx={{
              width: '40%'
            }}
            color="info"
            variant="contained"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
