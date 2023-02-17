import { TextField, Box, Button, InputLabel, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  createPipelineLocal,
  updateCheckEdit,
  updatePipelineInforMirror,
  updateTypeEdit
} from '~/redux/slices/project';
import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';
import Scheduler from 'material-ui-cron';
import EyeOff from '@iconify-icons/eva/eye-off-outline';
import EyeOn from '@iconify-icons/eva/eye-outline';
import MaterialTable from 'material-table';
import { tableIcons } from './TableIconsComponent';
import { isObject } from 'lodash';

const useStyles = makeStyles(theme => ({
  cardStyle: {
    position: 'fixed',
    zIndex: 1,
    right: '-100%',
    top: '12%',
    borderRadius: '8px 0px 0px 8px',
    transition: '0.5s',
    backgroundColor: theme.palette.background.default,
    transition: 'all .7s'
  },
  openCardRight: {
    right: '0'
  },
  boxCustomForm: {
    height: '75vh',
    overflowY: 'auto',
    marginBottom: '20px',
    paddingRight: '10px',
    paddingTop: '10px',
    scrollBehavior: 'smooth'
  },
  cssLabel: {
    color: '#3853c8'
  },
  customSchedule: {
    '& h6': {
      display: 'none'
    },
    '& .makeStyles-box-1': {
      '& input': {
        color: theme.palette.mode == 'dark' && '#fff'
      }
    }
  },
  BoxCustomButton: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    display: 'flex',
    justifyContent: 'flex-end',
    '& .btn-cancel': {
      backgroundColor: '#ffff',
      color: '#3853c8',
      border: 'solid 1px #3853c8',
      marginRight: '10px'
    }
  }
}));

const FormAddPipline = ({ setIsOpen, idProject }) => {
  const columnsParam = React.useMemo(() => {
    return [
      { title: 'Name', field: 'name' },
      {
        title: 'Type',
        field: 'type',
        lookup: { 1: 'String' }
      },
      {
        title: 'Default value',
        field: 'defaultValue'
      }
    ];
  }, []);
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    isLoading,
    diDetail,
    typeEdit,
    checkEdit,
    diCreatePipline
  } = useSelector(state => state.project);

  const validationSchema = yup.object({
    name: yup.string('Enter your Name').required('Name is required'),
    description: yup.string('Enter your Name'),
    start_date: yup
      .string('Enter your start day')
      .required('Start day is required'),
    timeout: yup
      .number()
      .max(20000000, 'Limit time 20M')
      .required('This field is requried')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      schedule_interval: undefined,
      start_date: moment().format('YYYY-MM-DD'),
      timeout: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const {
        name,
        description,
        schedule_interval,
        start_date,
        timeout
      } = values;
      let newParam = {};
      if (dataParam != [])
        dataParam.map(item => {
          newParam[item.name] = {
            type: 'string',
            defaultValue: item.defaultValue
          };
        });

      if (checkEdit && typeEdit == 'PIPELINE') {
        const valueBeforeEdit = {
          ...diDetail,
          name,
          description,
          parameters: newParam,
          policy: {
            schedule_interval,
            start_date,
            timeout
          }
        };
        dispatch(updatePipelineInforMirror(valueBeforeEdit, diCreatePipline));
      } else {
        const formatValue = {
          id: Math.random(3),
          typeLocal: 'new',
          operators: [],
          name,
          description,
          policy: {
            schedule_interval,
            start_date,
            timeout
          },
          idProject: idProject,
          parameters: newParam
        };
        dispatch(createPipelineLocal(formatValue));
      }
      setIsOpen(false);
      resetFill();
      formik.resetForm();
    }
  });

  //state
  const [cronExp, setCronExp] = useState(undefined);
  const [cronError, setCronError] = useState(''); // get error message if cron is invalid
  const [isAdmin, setIsAdmin] = useState(true); // set admin or non-admin to enable or disable high frequency scheduling (more than once a day)
  const [isOpen, setIsOpenSchedule] = useState(false);
  const [dataParam, setDataParam] = React.useState([]);

  React.useEffect(() => {
    if (isOpen == false) {
      formik.setFieldValue('schedule_interval', undefined);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (Object.keys(formik?.errors).length && formik.isSubmitting) {
      document.getElementById(Object.keys(formik?.errors)[0])?.scrollIntoView();
    }
  }, [formik.errors, formik?.isSubmitting]);

  console.log('chay vao day', diDetail);

  React.useEffect(() => {
    if (checkEdit && typeEdit == 'PIPELINE') FilterDataPipeline();
  }, [checkEdit, typeEdit]);

  const FilterDataPipeline = () => {
    const arrNameForm = [
      'name',
      'description',
      'schedule_interval',
      'start_date',
      'timeout'
    ];
    arrNameForm?.map(item => {
      if (
        item == 'schedule_interval' ||
        item == 'start_date' ||
        item == 'timeout'
      ) {
        formik.setFieldValue(item, diDetail?.policy?.[item]);
      } else formik.setFieldValue(item, diDetail?.[item]);
    });
    if (
      diDetail?.policy?.schedule_interval &&
      diDetail?.policy?.schedule_interval !== null
    ) {
      setIsOpenSchedule(true);
      setCronExp(diDetail?.policy?.schedule_interval);
    }

    if (isObject(diDetail?.parameters)) {
      let paramsArr = [];
      Object?.keys(diDetail?.parameters).forEach(function(key, index) {
        paramsArr.push({
          name: key,
          type: diDetail?.parameters[key]?.type == 'string' && 1,
          defaultValue: diDetail?.parameters[key]?.defaultValue
        });
      });
      setDataParam(paramsArr);
    }
  };

  const resetFill = () => {
    setIsOpenSchedule(false);
    setCronExp(undefined);
    setDataParam([]);
    if (checkEdit && typeEdit == 'PIPELINE') {
      dispatch(updateCheckEdit(false));
      dispatch(updateTypeEdit(''));
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className={classes.boxCustomForm}>
        <TextField
          InputLabelProps={{
            classes: {
              root: classes.cssLabel
            }
          }}
          sx={{ mb: 2 }}
          fullWidth
          id="name"
          name="name"
          label="Name *"
          onKeyPress={event => preventSpecialCharacters(event)}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          sx={{ mb: 2 }}
          fullWidth
          id="description"
          name="description"
          label="Description"
          onKeyPress={event => preventSpecialCharacters(event)}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <Box>
          <InputLabel sx={{ m: 2 }}>
            Schedule interval
            <IconButton
              className={classes.button}
              sx={{ ml: 1 }}
              color={open ? 'primary' : 'default'}
            >
              <Icon
                onClick={() => {
                  setIsOpenSchedule(!isOpen);
                }}
                icon={isOpen == false ? EyeOff : EyeOn}
                width={20}
                height={20}
              />
            </IconButton>
          </InputLabel>
          {isOpen == true && (
            <div className={classes.customSchedule}>
              <Scheduler
                cron={cronExp}
                setCron={value => {
                  setCronExp(value);
                  formik.setFieldValue('schedule_interval', value);
                }}
                setCronError={setCronError}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </Box>
        <TextField
          sx={{ mb: 2, mt: 2 }}
          fullWidth
          name="start_date"
          id="start_date"
          label="Start date"
          type="date"
          inputProps={{
            min: moment().format('YYYY-MM-DD')
          }}
          value={formik.values.start_date}
          onChange={formik.handleChange}
          error={formik.touched.start_date && Boolean(formik.errors.start_date)}
          helperText={formik.touched.start_date && formik.errors.start_date}
        />
        <TextField
          type={'number'}
          InputLabelProps={{
            classes: {
              root: classes.cssLabel
            }
          }}
          sx={{ mb: 2 }}
          fullWidth
          id="timeout"
          name="timeout"
          label="Timeout *"
          value={formik.values.timeout}
          onChange={formik.handleChange}
          error={formik.touched.timeout && Boolean(formik.errors.timeout)}
          helperText={formik.touched.timeout && formik.errors.timeout}
        />
        {/* <MaterialTable
          columns={columnsParam}
          title="Parameters"
          data={dataParam}
          options={{
            search: false,
            draggable: false,
            paging: false,
            showEmptyDataSourceMessage: false,
            showFirstLastPageButtons: false,
            showSelectAllCheckbox: false,
            showTextRowsSelected: false,
            sorting: false
          }}
          icons={tableIcons}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  setDataParam([...dataParam, newData]);

                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...dataParam];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setDataParam([...dataUpdate]);

                  resolve();
                }, 1000);
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...dataParam];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setDataParam([...dataDelete]);

                  resolve();
                }, 1000);
              })
          }}
        /> */}
      </Box>
      <Box className={classes.BoxCustomButton}>
        <Button
          className="btn-cancel"
          color="inherit"
          variant="contained"
          onClick={() => {
            setIsOpen(false);
            resetFill();
            formik.resetForm();
          }}
        >
          Cancel
        </Button>
        <Button color="primary" variant="contained" type="submit">
          <ClipLoader
            css={{
              margin: '2px'
            }}
            loading={isLoading}
            speedMultiplier={1}
          />
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default React.memo(FormAddPipline);
