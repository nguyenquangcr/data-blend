import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetPreview } from '~/redux/slices/upload';
import Typography from '~/theme/overrides/Typography';
import { NoData } from '~/views/common/NoData';
import { deleteHitoryUpload, updateHitoryUpload } from '~/redux/slices/project';
import { fDateTime } from '~/utils/formatTime';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Button } from '@mui/material';
import ModalConfirm from '~/components/ModalConfirm';
import { makeStyles, useTheme } from '@mui/styles';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells?.map(headCell => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.array.isRequired
};

const headCells = [
  { id: 'connectionId', label: 'Connection' },
  { id: 'createdTime', label: 'Created Time' },
  { id: 'filename', label: 'File Name' },
  { id: 'username', label: 'User Name' },
  { id: 'action', label: '' }
];

const useStyles = makeStyles(theme => ({
  customPagination: {
    '& .MuiTablePagination-selectLabel': {
      fontWeight: 'initial'
    }
  },
  customTable: {
    '& td': {
      fontWeight: 'initial'
    }
  }
}));

export default function PreviewTable() {
  const classes = useStyles();
  const { idProject } = useParams();
  const dispatch = useDispatch();
  const { arrayLogUpload, diConection } = useSelector(state => state.project);
  const data = arrayLogUpload;
  //state
  const [page, setPage] = React.useState(0);
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('createdTime');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModalComfirmDelete, setOpenModalComfirmDelete] = React.useState(
    false
  );
  const [projectDelete, setProjectDelete] = React.useState(null);
  const [datasetDelete, setDatasetDelete] = React.useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  React.useEffect(() => {
    dispatch(updateHitoryUpload(idProject));
  }, []);

  React.useEffect(() => {
    return () => {
      dispatch(actionSetPreview([]));
    };
  }, []);

  const confirmDelete = () => {
    dispatch(deleteHitoryUpload(projectDelete, datasetDelete, { purge: true }));
    setOpenModalComfirmDelete(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        {!data?.length && (
          <NoData size="small" text="Please drop a file to preview" />
        )}
        <Table
          sx={{ minWidth: 750, mt: 3, borderRadius: '8px' }}
          aria-labelledby="tableTitle"
        >
          {data?.length > 0 && (
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              headCells={headCells}
            />
          )}
          <TableBody className={classes.customTable}>
            {data
              ?.slice()
              ?.sort(getComparator(order, orderBy))
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => {
                const _key = 'row' + index;
                const { connectionId, createdTime, filename, username } = row;
                return (
                  <TableRow tabIndex={-1} key={_key}>
                    <TableCell key={index}>
                      {
                        diConection?.find(item => item?.id == connectionId)
                          ?.name
                      }
                    </TableCell>
                    <TableCell key={index}>{fDateTime(createdTime)}</TableCell>
                    <TableCell key={index}>{filename}</TableCell>
                    <TableCell key={index}>{username}</TableCell>
                    <TableCell key={index}>
                      <Button
                        style={{ color: 'rgb(255,108,108)' }}
                        onClick={() => {
                          setDatasetDelete(row?.datasetId);
                          setProjectDelete(row?.projectId);
                          setOpenModalComfirmDelete(true);
                        }}
                      >
                        <DeleteOutlinedIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 54 * emptyRows
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={classes.customPagination}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length > 50 ? 50 : data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ModalConfirm
        open={openModalComfirmDelete}
        setOpen={setOpenModalComfirmDelete}
        actionTitle={'Delete project'}
        actionDescription={<> Are you sure you want to delete file upload</>}
        onClickConfirm={confirmDelete}
      ></ModalConfirm>
    </Box>
  );
}
