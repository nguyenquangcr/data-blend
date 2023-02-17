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
  changeCheckIdProjectPageDetail,
  getProjects,
  resetAll,
  updateDiPageDetail,
  updateType,
  updateUserscop
} from '~/redux/slices/project';
import { useDispatch, useSelector } from 'react-redux';
import SearchNotFound from '~/components/SearchNotFound';
import HeaderDashboard from '~/components/HeaderDashboard';
import Scrollbars from '~/components/Scrollbars';
import homeFill from '@iconify-icons/eva/home-fill';
import plusCircleOutline from '@iconify-icons/eva/plus-circle-outline';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import clsx from 'clsx';
import ModalAddNewDatablend from './components/ModalComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MoreButton from './components/MoreButton';
import { useHistory } from 'react-router-dom';
import { alpha, emphasize } from '@mui/material/styles';

//style
import '../style.scss';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'createdAt', label: 'Created at', alignRight: false },
  { id: '' }
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
    boxShadow:
      '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
  },
  labelCardRoot: {
    boxShadow:
      '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
  },
  labelHeader: {
    fontWeight: 'bold !important'
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
  }
}));

function ComponentsView() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  //store
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.project);
  //state
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [openModalAdd, setopenModalAdd] = useState(false);
  const [typeModal, setTypeModal] = useState({ type: 'Add', id: null });

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem('userScope') !== null) {
      dispatch(updateUserscop(JSON.parse(localStorage.getItem('userScope'))));
    }
    dispatch(updateDiPageDetail(false));
    dispatch(updateType(''));
    dispatch(resetAll());
    dispatch(changeCheckIdProjectPageDetail(null));
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
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };

  const handleFilterByName = event => {
    setFilterName(event?.target?.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projects?.length) : 0;

  const filteredProjects = applySortFilter(
    projects,
    getComparator(order, orderBy),
    filterName
  );

  const isProductNotFound = filteredProjects?.length === 0;

  return (
    <Page
      title="cIntegration | Advance data integration to connect all your data at scale"
      className={clsx(classes.root, 'page-dataIntegration')}
    >
      <Container className="container-dataIntegration">
        <HeaderDashboard
          className={classes.labelHeader}
          heading="cIntegration"
          links={[{ name: '', href: PATH_APP.root }]}
        />
        <Card className={classes.labelCardRoot}>
          <ToolbarTable
            setopenModalAdd={setopenModalAdd}
            filterName={filterName}
            onFilterName={handleFilterByName}
            setTypeModal={setTypeModal}
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
                  {filteredProjects
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row, index) => {
                      const {
                        id,
                        name,
                        type,
                        cover,
                        price,
                        createdAt,
                        inventoryType
                      } = row;

                      const isItemSelected = selected?.indexOf(name) !== -1;

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
                              onClick={() => history.push(`/app/di/${id}`)}
                            >
                              <IconButton
                                className={classes.labelIconList}
                                color={open ? 'primary' : 'default'}
                              >
                                <Icon icon={homeFill} width={20} height={20} />
                              </IconButton>
                              <Typography
                                variant="subtitle2"
                                sx={{ cursor: 'pointer' }}
                                noWrap
                              >
                                {name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {fDateTime(createdAt)}
                          </TableCell>
                          <TableCell align="right">
                            <MoreButton
                              id={id}
                              name={name}
                              keyMessage={key => {
                                toast.success(key, {
                                  position: 'top-right',
                                  autoClose: 1500,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined
                                });
                              }}
                              setopenModalAdd={setopenModalAdd}
                              setTypeModal={setTypeModal}
                            />
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
            count={projects?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ToastContainer />
      <ModalAddNewDatablend
        open={openModalAdd}
        setOpen={setopenModalAdd}
        typeModal={typeModal}
      />
    </Page>
  );
}

export default ComponentsView;
