import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

const useStyles = makeStyles(theme => ({
  root: {}
}));

// ----------------------------------------------------------------------

SortPosts.propTypes = {
  query: PropTypes.string,
  options: PropTypes.array,
  onSort: PropTypes.func,
  className: PropTypes.string
};

function SortPosts({ query, options, onSort, className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <TextField select size="small" value={query} onChange={onSort}>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

export default SortPosts;
