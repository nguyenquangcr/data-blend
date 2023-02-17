import React from 'react';
import { useGridSlotComponentProps } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() =>
  createStyles({
    pagination: {
      display: 'flex'
    }
  })
);

function DataGridPagination() {
  const { state, apiRef } = useGridSlotComponentProps();
  const classes = useStyles();

  return (
    <Pagination
      className={classes.pagination}
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default DataGridPagination;
