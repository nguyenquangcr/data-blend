import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import HeadTable from './HeadTable';
import { Icon } from '@iconify/react';
import Page from '~/components/Page';
import ToolbarTable from './ToolbarTable';
import { PATH_APP } from '~/routes/paths';
import { fDateTime } from '~/utils/formatTime';
import { visuallyHidden } from '@mui/utils';
import {
  changeStatusPipeline,
  getListLogMonitor,
  getProjects,
  resetAll,
  triggerRunPipeline,
  updateDiPageDetail,
  updateType
} from '~/redux/slices/project';
import { useDispatch, useSelector } from 'react-redux';
import SearchNotFound from '~/components/SearchNotFound';
import HeaderDashboard from '~/components/HeaderDashboard';
import Scrollbars from '~/components/Scrollbars';
import homeFill from '@iconify-icons/eva/home-fill';
import arrowBackOutline from '@iconify-icons/eva/arrow-back-outline';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  Switch,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import ModalAddNewDatablend from './components/ModalComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import MoreButton from './components/MoreButton';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import { orange } from '@mui/material/colors';
import { enumStatusPipeline } from '../detail-datablend/constant';

//style
import '../style.scss';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'startDate', label: 'Start date', alignRight: false },
  { id: 'endDate', label: 'End date', alignRight: false },
  { id: 'elapsedTime', label: 'Elapsed time', alignRight: false },
  { id: 'state', label: 'State', alignRight: false }
];
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    array = filter(array, _product => {
      return _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    return array;
  }
  return stabilizedThis?.map(el => el[0]);
}

const useStyles = makeStyles(theme => ({
  root: {},
  sortSpan: visuallyHidden,
  cartRight: {
    position: 'fixed',
    zIndex: 1,
    right: '0',
    top: '25%',
    width: '4.1vw',
    minWidth: '60px',
    borderRadius: '8px 0px 0px 8px',
    transition: '0.5s',
    backgroundColor: theme.palette.background.default
  }
}));

function convertHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (hours == '00') {
    if (minutes == '00') return seconds + 's';
    return minutes + ':' + seconds + 's';
  }

  return hours + ':' + minutes + ':' + seconds + 's'; // Return is HH : MM : SS
}

const funcConvertElapsedTime = (endTime, startTime, state) => {
  const nowDay = moment();
  const end = moment(endTime);
  const start = moment(startTime);
  if (state == 'failed' || state == 'success') {
    return convertHMS(Math.abs(Math.round(end.diff(start) / 1000)));
  }
  return convertHMS(Math.abs(Math.round(nowDay.diff(start) / 1000)));
};

function MonitorLogComponet() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { idProject, idPipeline } = useParams();
  //store
  const dispatch = useDispatch();
  const { diIdProject, diListLogPipeline } = useSelector(
    state => state.project
  );

  //state
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('startDate');
  const [openModalAdd, setopenModalAdd] = useState(false);
  const formatDiListLogPipeline = diListLogPipeline?.map(item => ({
    ...item,
    elapsedTime: funcConvertElapsedTime(
      item?.endDate,
      item?.startDate,
      item?.state
    )
  }));

  useEffect(() => {
    // dispatch(updateDiPageDetail(false));
    dispatch(getListLogMonitor(idProject, idPipeline));
    // if (diIdProject == '') history.goBack();
  }, []);

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

  const handleFilterByName = event => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - diListLogPipeline.length)
      : 0;

  const filtereddiListLogPipeline = applySortFilter(
    formatDiListLogPipeline,
    getComparator(order, orderBy),
    filterName
  );

  const isProductNotFound = filtereddiListLogPipeline?.length === 0;
  const handleChange = (event, id, statusPip) => {
    let data = '';
    if (statusPip == enumStatusPipeline.pau) data = enumStatusPipeline.act;
    else data = enumStatusPipeline.pau;
    dispatch(changeStatusPipeline(diIdProject, id, { status: data }));
  };
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(orange[300]),
    backgroundColor: orange[300],
    '&:hover': {
      backgroundColor: orange[500]
    }
  }));
  return (
    <Page
      title="cIntegration | Advance data integration to connect all your data at scale"
      className={clsx(classes.root, 'page-dataIntegration')}
    >
      <Container className="container-dataIntegration">
        <HeaderDashboard
          heading="Monitor log"
          links={[{ name: '', href: PATH_APP.root }]}
        />
        <Card className={clsx(classes.root, 'card-right', classes.cartRight)}>
          <Box
            className={classes.box}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <IconButton
              onClick={() => {
                history.push(`/app/di/${idProject}/pipelinerun`);
              }}
              className={classes.button}
            >
              <Icon
                color="#3853c8"
                icon={arrowBackOutline}
                width={30}
                height={30}
              />
            </IconButton>
          </Box>
        </Card>

        <Card className={classes.card}>
          <ToolbarTable
            // numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbars>
            <TableContainer component={Box} sx={{ minWidth: 800 }}>
              <Table>
                <HeadTable
                  order={order}
                  classes={classes}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filtereddiListLogPipeline
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        id,
                        startDate,
                        endDate,
                        state,
                        elapsedTime
                      } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          className={classes.row}
                        >
                          <TableCell style={{ minWidth: 160 }}>{id}</TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {moment(startDate).format('DD-MM-YYYY HH:mm:ss')}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {moment(endDate).format('DD-MM-YYYY HH:mm:ss')}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {elapsedTime}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {state}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isProductNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbars>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={formatDiListLogPipeline.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ToastContainer />
      <ModalAddNewDatablend open={openModalAdd} setOpen={setopenModalAdd} />
    </Page>
  );
}

export default MonitorLogComponet;
