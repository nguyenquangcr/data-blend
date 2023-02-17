import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { capitalize } from '~/utils/formatText';
import { Checkbox } from '@mui/material';

// ----------------------------------------------------------------------

const useStyles = makeStyles(theme => {
  const createStyle = color => {
    return {
      '&.Mui-checked': {
        color: theme.palette[color].main
      },
      '&.MuiCheckbox-indeterminate': {
        color: theme.palette[color].main
      },
      '&:hover, &.Mui-checked:hover': {
        backgroundColor: alpha(
          theme.palette[color].main,
          theme.palette.action.hoverOpacity
        )
      }
    };
  };

  return {
    colorInfo: createStyle('info'),
    colorSuccess: createStyle('success'),
    colorWarning: createStyle('warning'),
    colorError: createStyle('error')
  };
});

// ----------------------------------------------------------------------

const MCheckbox = forwardRef(
  ({ color = 'primary', className, ...other }, ref) => {
    const classes = useStyles();

    if (color === 'default' || color === 'primary' || color === 'secondary') {
      return (
        <Checkbox ref={ref} color={color} className={className} {...other} />
      );
    }

    return (
      <Checkbox
        ref={ref}
        className={clsx(
          {
            [classes[`color${capitalize(color)}`]]: color
          },
          className
        )}
        {...other}
      />
    );
  }
);

MCheckbox.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error'
  ])
};

export default MCheckbox;
