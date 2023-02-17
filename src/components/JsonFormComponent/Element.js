import React from 'react';
// import Checkbox from './elements/Checkbox';
import TextFieldComponent from './elements/TextField';
// import Select from './elements/Select';
const Element = ({ formik, field_type, field_id, field_label }) => {
  switch (field_type) {
    case 'text':
      return (
        <TextFieldComponent
          formik={formik}
          field_id={field_id}
          field_label={field_label}
        />
      );
    // case 'select':
    //   return (
    //     <Select
    //       field_id={field_id}
    //       field_label={field_label}
    //       field_placeholder={field_placeholder}
    //       field_value={field_value}
    //       field_options={field_options}
    //     />
    //   );
    // case 'checkbox':
    //   return (
    //     <Checkbox
    //       field_id={field_id}
    //       field_label={field_label}
    //       field_value={field_value}
    //     />
    //   );

    default:
      return null;
  }
};

export default Element;
