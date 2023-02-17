import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import { Box, Typography, Modal, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createProject } from '~/redux/slices/project';
import { makeStyles } from '@mui/styles';
import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';

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

const validationSchema = yup.object({
  projectName: yup
    .string('Enter your project name')
    .required('Project name is required')
});

const useStyles = makeStyles(theme => ({
  cssLabel: {
    color: '#3853c8'
  }
}));

export default function ModalAddNewDatablend({ open, setOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.project);
  const formik = useFormik({
    initialValues: {
      projectName: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const { projectName } = values;
      dispatch(createProject({ name: projectName }));
      if (isLoading == false) {
        handleClose();
      }
    }
  });
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h5" sx={{ mb: 3 }}>
          Add Datablend
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            type={'text'}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 25 }}
            fullWidth
            id="projectName"
            name="projectName"
            label="Project name *"
            InputLabelProps={{
              classes: {
                root: classes.cssLabel
              }
            }}
            onKeyPress={event => preventSpecialCharacters(event)}
            value={formik.values.projectName}
            onChange={formik.handleChange}
            error={
              formik.touched.projectName && Boolean(formik.errors.projectName)
            }
            helperText={formik.touched.projectName && formik.errors.projectName}
          />
          <Button color="primary" variant="contained" fullWidth type="submit">
            <ClipLoader
              css={{
                margin: '2px'
              }}
              loading={isLoading}
              speedMultiplier={1}
            />
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
