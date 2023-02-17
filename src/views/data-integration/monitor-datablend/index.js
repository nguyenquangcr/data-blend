import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import HeadTable from './HeadTable';
import { Icon } from '@iconify/react';
import Page from '~/components/Page';
import ToolbarTable from './ToolbarTable';
import { PATH_APP } from '~/routes/paths';
import { visuallyHidden } from '@mui/utils';
import {
  changeStatusPipeline,
  getListPipelines,
  triggerRunPipeline,
  updateDiPageDetail
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import { orange } from '@mui/material/colors';
import { enumStatusPipeline } from '../detail-datablend/constant';
import cronstrue from 'cronstrue';

//style
import '../style.scss';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'policy.start_date', label: 'Start date', alignRight: false },
  {
    id: 'policy.schedule_interval',
    label: 'Schedule interval',
    alignRight: false
  },
  { id: 'policy.owner', label: 'Owner', alignRight: false },
  { id: 'policy.timeout', label: 'Timeout', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '', label: 'Action', alignRight: false },
  { id: '', label: 'Trigger run', alignRight: false }
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
      return (
        _product?.name?.toLowerCase()?.indexOf(query?.toLowerCase()) !== -1
      );
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
  },
  labelIconList: {
    // background: 'rgb(23, 193, 232)',
    background: '#3852c8',
    borderRadius: '0.5rem',
    boxShadow:
      'rgb(20 20 20 / 12%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(20 20 20 / 7%) 0rem 0.125rem 0.25rem -0.0625rem',
    margin: '5px 10px',
    '&:hover': {
      // background: 'rgb(23, 193, 232)'
      background: '#3852c8'
    },
    '& svg': {
      color: '#fff'
    }
  },
  customNameMonitor: {
    width: '125px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

function MonitorListComponet() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  //Params
  const { idProject } = useParams();
  //store
  const dispatch = useDispatch();
  const { diApiPipline, diIdProject } = useSelector(state => state.project);
  //state
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('policy.start_date');
  const [openModalAdd, setopenModalAdd] = useState(false);

  useEffect(() => {
    dispatch(updateDiPageDetail(false));
    dispatch(getListPipelines(idProject));
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - diApiPipline.length) : 0;

  const filtereddiApiPipline = applySortFilter(
    diApiPipline,
    getComparator(order, orderBy),
    filterName
  );

  const isProductNotFound = filtereddiApiPipline?.length === 0;
  const handleChange = (event, id, statusPip) => {
    let data = '';
    if (statusPip == enumStatusPipeline.pau) data = enumStatusPipeline.act;
    else data = enumStatusPipeline.pau;
    dispatch(changeStatusPipeline(idProject, id, { status: data }));
  };
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(orange[300]),
    backgroundColor: orange[300],
    '&:hover': {
      backgroundColor: orange[500]
    }
  }));

  const convertScheduleInterval = value => {
    try {
      return cronstrue.toString(value);
    } catch (error) {
      return ' - ';
    }
  };

  return (
    <Page
      title="cIntegration | Advance data integration to connect all your data at scale"
      className={clsx(classes.root, 'page-dataIntegration')}
    >
      <Container className="container-dataIntegration">
        <HeaderDashboard
          heading="Monitors"
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
              onClick={() => history.push(`/app/di/${idProject}/orchestrate`)}
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
                  {filtereddiApiPipline
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row, index) => {
                      const { id, name, policy, status } = row;
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
                          <TableCell component="th" scope="row" padding="none">
                            <Box
                              sx={{
                                py: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <IconButton
                                className={classes.labelIconList}
                                color={open ? 'primary' : 'default'}
                              >
                                <Icon icon={homeFill} width={20} height={20} />
                              </IconButton>
                              <Typography
                                className={classes.customNameMonitor}
                                variant="subtitle2"
                                sx={{ cursor: 'pointer' }}
                                noWrap
                                onClick={() => {
                                  if (status != 'Not Available')
                                    history.push(
                                      `/app/di/${idProject}/log/${id}`
                                    );
                                }}
                              >
                                {name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {moment(policy.start_date, 'YYYY-MM-DD').format(
                              'DD/MM/YYYY'
                            )}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {convertScheduleInterval(policy?.schedule_interval)}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {policy.owner}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {policy.timeout}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {status}
                          </TableCell>
                          <TableCell>
                            <Switch
                              disabled={status == enumStatusPipeline.notAva}
                              checked={
                                status == enumStatusPipeline.pau ? false : true
                              }
                              onChange={event =>
                                handleChange(event, id, status)
                              }
                              name="gilad"
                            />
                          </TableCell>
                          <TableCell>
                            {status != enumStatusPipeline.notAva && (
                              <Button
                                disabled={status == enumStatusPipeline.pau}
                                variant="contained"
                                onClick={() => {
                                  dispatch(triggerRunPipeline(diIdProject, id));
                                }}
                              >
                                Trigger
                              </Button>
                            )}
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
            count={diApiPipline?.length}
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

export default MonitorListComponet;
