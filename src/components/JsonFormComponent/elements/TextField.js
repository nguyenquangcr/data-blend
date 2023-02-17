import { TextField } from '@mui/material';
import React, { useContext } from 'react';
// import { FormContext } from '../../FormContext';

const TextFieldComponent = ({ formik, field_id, field_label }) => {
  return (
    <TextField
      sx={{ mb: 2 }}
      //   InputLabelProps={{
      //     classes: {
      //       root: classes.cssLabel
      //     }
      //   }}
      fullWidth
      id={field_id}
      name={field_id}
      label={field_label}
      value={formik.values[field_id]}
      onChange={formik.handleChange}
      error={formik.touched[field_id] && Boolean(formik.errors[field_id])}
      helperText={formik.touched[field_id] && formik.errors[field_id]}
    />
  );
};

export default TextFieldComponent;
