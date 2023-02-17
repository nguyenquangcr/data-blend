import {
  TextField,
  Box,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useFormik, Er } from 'formik';
import * as yup from 'yup';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch, useSelector } from 'react-redux';
import { updateCheckEdit, updateDataset } from '~/redux/slices/project';
import MaterialTable from 'material-table';
import EyeOn from '@iconify-icons/eva/eye-outline';
import EyeOff from '@iconify-icons/eva/eye-off-outline';
import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';
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

const FormUpdateDataset = ({ setIsOpen, idProject }) => {
  const classes = useStyles();
  //store
  const dispatch = useDispatch();
  const { isLoading, diConection, diDetail } = useSelector(
    state => state.project
  );
  //state
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [valueType, setValueType] = React.useState('');
  const [value, setValue] = React.useState(0);
  const [inputSchema, setInputSchema] = React.useState(false);
  const [isOpen, setIsOpenAdvancedSetting] = useState(false);
  const [data, setData] = React.useState([]);
  const [dataParam, setDataParam] = React.useState([]);

  const columns = [
    { title: 'Column name', field: 'columnName' },
    {
      title: 'Data type',
      field: 'dataType',
      lookup: { ['STRING']: 'STRING' }
    }
  ];

  const columnsParam = [
    { title: 'Name', field: 'name' },
    {
      title: 'Type',
      field: 'type',
      lookup: { ['string']: 'string' }
    },
    {
      title: 'Default value',
      field: 'defaultValue'
    }
  ];

  React.useEffect(() => {
    funcResetForm();
    setTimeout(() => {
      let arrSchema = [];
      formik.setFieldValue('name', diDetail?.name);
      if (diDetail?.description === undefined) {
        formik.setFieldValue('description', '');
      } else formik.setFieldValue('description', diDetail?.description);
      formik.setFieldValue(
        'connection',
        diConection.find(item => item?.id == diDetail?.connection)?.id
      );
      if (diDetail?.schema?.length > 0) {
        diDetail?.schema?.map(item => {
          arrSchema?.push({
            columnName: item?.columnName,
            dataType: item?.dataType
          });
        });
        setData(arrSchema);
      }
      if (isObject(diDetail?.parameters)) {
        let cloneArr = [];
        Object?.keys(diDetail?.parameters).forEach(function(key, index) {
          cloneArr.push({
            name: key,
            type: diDetail?.parameters[key]?.type,
            defaultValue: diDetail?.parameters[key]?.defaultValue
          });
        });
        setDataParam(cloneArr);
      }
      if (isObject(diDetail?.properties)) {
        Object?.keys(diDetail?.properties).forEach(function(key) {
          formik.setFieldValue(key, diDetail?.properties[key]);
        });
      }
      if (diDetail?.properties?.type == 'PostgreSqlDataset') {
        if (diDetail?.properties?.query !== undefined) setValue(1);
        else setValue(0);
      } else setIsOpenAdvancedSetting(true);
    }, 300);
  }, [diDetail]);

  const validationSchema = yup.object({
    name: yup.string('Enter your Name').required('Name is required'),
    connection: yup
      .string('Choose your connection')
      .required('Connection is required'),
    type: yup.string('Enter your type').required('Type is required'),
    schema:
      valueType == 'PostgreSqlDataset'
        ? value == 0 &&
          yup.string('Enter your schema').required('Schema is required')
        : '',
    query:
      valueType == 'PostgreSqlDataset'
        ? value == 1 &&
          yup.string('Enter your Query').required('Query is required')
        : '',
    location:
      (valueType == 'FtelLakeHouseDataset' ||
        valueType == 'DelimitedTextDataset' ||
        valueType == 'ParquetDataset') &&
      yup.string('Enter your location').required('Location is required'),
    columnDelimiter:
      valueType == 'DelimitedTextDataset' &&
      yup
        .string('Enter column delimiter')
        .required('Column delimiter is required'),
    fileName:
      valueType == 'UploadedDataset' &&
      yup.string('Enter column filename').required('Filename is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      connection: '',
      description: '',
      type: '',
      schema: undefined,
      tableName: undefined,
      query: undefined,
      location: '',
      partitionBy: undefined,
      compression: '',
      columnDelimiter: '',
      firstRowAsHeader: '',
      encoding: ''
    },
    validationSchema,
    validate: values => {
      const { name, connection, type } = values;
      if (checkSubmit == true) {
        if (name != '' && connection != '' && type == '') {
          document.getElementById('type')?.scrollIntoView();
        }
        setTimeout(() => {
          setCheckSubmit(false);
        }, 300);
      }
    },
    onSubmit: values => {
      const {
        columnName,
        connection,
        dataType,
        description,
        location,
        name,
        partitionBy,
        query,
        schema,
        tableName,
        type,
        columnDelimiter,
        encoding,
        firstRowAsHeader,
        compression
      } = values;
      let newParam = {};
      let formatValue = {};
      if (dataParam != [])
        dataParam.map(item => {
          newParam[item.name] = {
            type: 'string',
            defaultValue: item.defaultValue
          };
        });
      if (type == 'PostgreSqlDataset') {
        if (value == 0)
          formatValue = {
            name,
            connection: +connection,
            description,
            schema: data != [] ? data : undefined,
            properties: {
              schema,
              tableName,
              query,
              type
            },
            parameters: newParam
          };
        else
          formatValue = {
            name,
            connection: +connection,
            description,
            schema: data != [] ? data : undefined,
            properties: {
              query,
              type
            },
            parameters: newParam
          };
      } else if (type == 'DelimitedTextDataset') {
        formatValue = {
          name,
          connection: +connection,
          description,
          schema: data != [] ? data : undefined,
          properties: {
            location,
            columnDelimiter,
            compression,
            encoding,
            firstRowAsHeader,
            type
          },
          parameters: newParam
        };
      } else if (type == 'ParquetDataset') {
        formatValue = {
          name,
          connection: +connection,
          description,
          schema: data != [] ? data : undefined,
          properties: {
            location,
            compression,
            type
          },
          parameters: newParam
        };
      } else
        formatValue = {
          name,
          connection: +connection,
          description,
          schema: data != [] ? data : undefined,
          properties: {
            location,
            tableName,
            partitionBy,
            type
          },
          parameters: newParam
        };
      Object?.keys(formatValue).forEach(function(key, index) {
        if (formatValue[key] === '') {
          delete formatValue[`${key}`];
        }
      });
      Object?.keys(formatValue?.properties).forEach(function(key, index) {
        if (formatValue?.properties[key] === '') {
          delete formatValue?.properties[`${key}`];
        }
      });
      dispatch(updateDataset(idProject, diDetail?.id, formatValue));
      setIsOpen(false);
      funcResetForm();
    }
  });

  React.useEffect(() => {
    if (Object.keys(formik?.errors).length && formik.isSubmitting) {
      document.getElementById(Object.keys(formik?.errors)[0])?.scrollIntoView();
    }
  }, [formik.errors, formik?.isSubmitting]);

  const top100Films = [
    { title: 'PostgreSqlDataset' },
    { title: 'FtelLakeHouseDataset' },
    { title: 'DelimitedTextDataset' },
    { title: 'ParquetDataset' },
    { title: 'UploadedDataset' }
  ];

  const compressionType = ['gzip', 'lz4', 'snappy'];

  React.useEffect(() => {
    setValueType(formik.getFieldMeta('type').value);
  }, [formik]);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  const handleChangeTabs = (event, newValue) => setValue(newValue);

  const funcResetForm = () => {
    formik.resetForm();
    setData([]);
    setDataParam([]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className={classes.boxCustomForm}>
        <TextField
          sx={{ mb: 2 }}
          fullWidth
          id="name"
          name="name"
          label="Name *"
          InputLabelProps={{
            className: classes.cssLabel
          }}
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
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <FormControl
          fullWidth
          sx={{ mb: 2 }}
          error={formik.touched.connection && Boolean(formik.errors.connection)}
        >
          <InputLabel className={classes.cssLabel}>Connection *</InputLabel>
          <Select
            id="connection"
            name="connection"
            label="Connection"
            value={formik.values.connection}
            onChange={formik.handleChange}
          >
            {diConection &&
              diConection.map(item => {
                return <MenuItem value={item.id}>{item.name}</MenuItem>;
              })}
          </Select>
          <FormHelperText>
            {formik.touched.connection && formik.errors.connection}
          </FormHelperText>
        </FormControl>
        <Box sx={{ mb: 2 }}>
          <MaterialTable
            columns={columns}
            title="Schema"
            data={data}
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
                    setData([...data, newData]);

                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
          />
        </Box>
        <MaterialTable
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
        />
        <FormControl
          fullWidth
          sx={{ mb: 2, mt: 2 }}
          error={formik.touched.type && Boolean(formik.errors.type)}
        >
          <InputLabel className={classes.cssLabel}>Type *</InputLabel>
          <Select
            disabled
            id="type"
            name="type"
            label="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            {top100Films.map(item => {
              return <MenuItem value={item.title}>{item.title}</MenuItem>;
            })}
          </Select>
          <FormHelperText>
            {formik.touched.type && formik.errors.type}
          </FormHelperText>
        </FormControl>
        {formik.getFieldMeta('type').value == 'PostgreSqlDataset' && (
          <>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={value}
                  onChange={handleChangeTabs}
                  aria-label="basic tabs example"
                >
                  <Tab label="Table" {...a11yProps(0)} />
                  <Tab label="Query" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <Collapse
                in={value === 0 ? true : false}
                timeout="auto"
                unmountOnExit
              >
                <TextField
                  sx={{ mb: 2, mt: 2 }}
                  fullWidth
                  id="schema"
                  name="schema"
                  label="Schema"
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel
                    }
                  }}
                  onClick={() => {
                    setInputSchema(true);
                  }}
                  onBlur={() => {
                    setInputSchema(false);
                  }}
                  inputRef={input => {
                    if (input != null && inputSchema == true) {
                      input.focus();
                    }
                  }}
                  value={formik.values.schema}
                  onChange={formik.handleChange}
                  error={formik.touched.schema && Boolean(formik.errors.schema)}
                  helperText={formik.touched.schema && formik.errors.schema}
                />
                <TextField
                  sx={{ mb: 2 }}
                  fullWidth
                  id="tableName"
                  name="tableName"
                  label="Table Name"
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel
                    }
                  }}
                  value={formik.values.tableName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.tableName && Boolean(formik.errors.tableName)
                  }
                  helperText={
                    formik.touched.tableName && formik.errors.tableName
                  }
                />
              </Collapse>
              <Collapse
                in={value === 1 ? true : false}
                timeout="auto"
                unmountOnExit
              >
                <TextField
                  sx={{ mb: 2, mt: 2 }}
                  fullWidth
                  id="query"
                  name="query"
                  label="Query"
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel
                    }
                  }}
                  value={formik.values.query}
                  onChange={formik.handleChange}
                  error={formik.touched.query && Boolean(formik.errors.query)}
                  helperText={formik.touched.query && formik.errors.query}
                />
              </Collapse>
            </Box>
          </>
        )}
        {formik.getFieldMeta('type').value == 'FtelLakeHouseDataset' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="location"
              name="location"
              label="Location *"
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="tableName"
              name="tableName"
              label="Table Name"
              value={formik.values.tableName}
              onChange={formik.handleChange}
              error={
                formik.touched.tableName && Boolean(formik.errors.tableName)
              }
              helperText={formik.touched.tableName && formik.errors.tableName}
            />
            <Autocomplete
              multiple
              freeSolo
              id="partitionBy"
              name="partitionBy"
              onChange={(e, value) => {
                if (value !== null) formik.setFieldValue('partitionBy', value);
                else formik.setFieldValue('partitionBy', []);
              }}
              options={[]}
              filterSelectedOptions
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={params => (
                <TextField {...params} sx={{ mb: 2 }} label="Partition By" />
              )}
            />
          </>
        )}
        {formik.getFieldMeta('type').value == 'DelimitedTextDataset' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="location"
              name="location"
              label="Location *"
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="columnDelimiter"
              name="columnDelimiter"
              label="Column Delimiter *"
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              value={formik.values.columnDelimiter}
              onChange={formik.handleChange}
              error={
                formik.touched.columnDelimiter &&
                Boolean(formik.errors.columnDelimiter)
              }
              helperText={
                formik.touched.columnDelimiter && formik.errors.columnDelimiter
              }
            />
            <Box>
              <InputLabel sx={{ m: 2 }}>
                Advanced Setting
                <IconButton
                  className={classes.button}
                  sx={{ ml: 1 }}
                  color={open ? 'primary' : 'default'}
                >
                  <Icon
                    onClick={() => {
                      setIsOpenAdvancedSetting(!isOpen);
                    }}
                    icon={isOpen == false ? EyeOff : EyeOn}
                    width={20}
                    height={20}
                  />
                </IconButton>
              </InputLabel>
              {isOpen == true && (
                <>
                  <TextField
                    sx={{ mb: 2 }}
                    fullWidth
                    id="encoding"
                    name="encoding"
                    label="Encoding"
                    value={formik.values.encoding}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.encoding && Boolean(formik.errors.encoding)
                    }
                    helperText={
                      formik.touched.encoding && formik.errors.encoding
                    }
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Compression</InputLabel>
                    <Select
                      labelId="compression"
                      id="compression"
                      name="compression"
                      label="compression"
                      value={formik.values.compression}
                      onChange={formik.handleChange}
                    >
                      {compressionType.map(item => {
                        return <MenuItem value={item}>{item}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>First Row As Header</InputLabel>
                    <Select
                      labelId="firstRowAsHeader"
                      id="firstRowAsHeader"
                      name="firstRowAsHeader"
                      label="firstRowAsHeader"
                      value={formik.values.firstRowAsHeader}
                      onChange={formik.handleChange}
                    >
                      {[
                        { id: true, value: 'True' },
                        { id: false, value: 'False' }
                      ].map(item => {
                        return (
                          <MenuItem value={item.id}>{item.value}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
          </>
        )}
        {formik.getFieldMeta('type').value == 'UploadedDataset' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="fileName"
              name="fileName"
              label="fileName *"
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              value={formik.values.fileName}
              onChange={formik.handleChange}
              error={formik.touched.fileName && Boolean(formik.errors.fileName)}
              helperText={formik.touched.fileName && formik.errors.fileName}
            />
          </>
        )}
        {formik.getFieldMeta('type').value == 'ParquetDataset' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="location"
              name="location"
              label="Location *"
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
            <Box>
              <InputLabel sx={{ m: 2 }}>
                Advanced Setting
                <IconButton
                  className={classes.button}
                  sx={{ ml: 1 }}
                  color={open ? 'primary' : 'default'}
                >
                  <Icon
                    onClick={() => {
                      setIsOpenAdvancedSetting(!isOpen);
                    }}
                    icon={isOpen == false ? EyeOff : EyeOn}
                    width={20}
                    height={20}
                  />
                </IconButton>
              </InputLabel>
              {isOpen == true && (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Compression</InputLabel>
                    <Select
                      labelId="compression"
                      id="compression"
                      name="compression"
                      label="compression"
                      value={formik.values.compression}
                      onChange={formik.handleChange}
                    >
                      {compressionType.map(item => {
                        return <MenuItem value={item}>{item}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
      <Box className={classes.BoxCustomButton}>
        <Button
          color="inherit"
          variant="contained"
          className="btn-cancel"
          onClick={() => {
            setIsOpen(false);
            dispatch(updateCheckEdit(false));
            funcResetForm();
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

export default FormUpdateDataset;
