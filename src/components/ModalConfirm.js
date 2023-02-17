import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Modal, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '1%'
};

const useStyles = makeStyles(theme => ({
  cssLabel: {
    color: '#3853c8'
  },
  cssModal: {
    '& .MuiBox-root': {
      outline: 'none'
    }
  }
}));

ModalConfirm.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  actionTitle: PropTypes.string,
  actionDescription: PropTypes.string,
  onClickConfirm: PropTypes.func
};

export default function ModalConfirm({
  open,
  setOpen,
  actionTitle,
  actionDescription,
  onClickConfirm
}) {
  const handleClose = () => setOpen(false);
  const classes = useStyles();
  return (
    <Modal
      className={classes.cssModal}
      open={open}
      onClose={handleClose}
      onKeyPress={ev => {
        if (ev.key == 'Enter') {
          onClickConfirm();
        }
      }}
    >
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h5">
          {actionTitle}
        </Typography>
        <Typography
          id="server-modal-description"
          sx={{ pt: 2, mb: 4, mt: 1, fontWeight: 'light' }}
        >
          {actionDescription}
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{
              width: '30%',
              mr: 2
            }}
            color="secondary"
            variant="contained"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
          <Button
            sx={{
              width: '30%'
            }}
            color="primary"
            variant="contained"
            onClick={() => onClickConfirm()}
          >
            Confirm
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
