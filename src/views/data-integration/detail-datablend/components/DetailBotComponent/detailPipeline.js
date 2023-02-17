import {
  Tab,
  Tabs,
  Typography,
  TextField,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOperatorPipelineLocal,
  getOperatorDetalLocal
} from '~/redux/slices/project';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';
import DatasetPropertiesComponent from './components/datasetPropertiesComponent';
import { isEmpty } from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import FtelSqlOpeComponent from './components/FtelSqlOpeComponent';
import Testmui from './testmui';
import NoRowsComponent from '~/components/NoRowsComponent';
import { valueTabContext } from '~/App';
//constant
const enumFormat = [{ title: 'Append' }, { title: 'Overwrite' }];
const columnsParameters = [
  { field: 'name', headerName: 'Name', editable: true, width: 150 },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
    type: 'singleSelect',
    valueOptions: ['String'],
    editable: true
  },
  {
    field: 'defaultValue',
    width: 150,
    headerName: 'Default value',
    editable: true
  }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  labelBoxBottom: {
    width: '100%',
    padding: '10px',
    height: '100%',
    overflow: 'auto'
  },
  cssLabel: {
    color: '#3853c8'
  }
}));

const DetailPipelineComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    diDataset,
    diDetail,
    diOperatorDetail,
    diCreatePipline,
    opeSelect
  } = useSelector(state => state.project);
  //context
  const [valueTab, setValueTab] = React.useContext(valueTabContext);
  //ref
  const refData = React.useRef([]);
  //state
  const [value, setValue] = React.useState(0);
  const [rowParameters, setRowParameters] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);

  React.useEffect(() => {
    if (diDetail?.parameters) {
      let newArrParam = [];
      for (var key in diDetail?.parameters) {
        newArrParam.push({
          id: Math.random(),
          name: key,
          type: diDetail?.parameters[key].type,
          defaultValue: diDetail?.parameters[key].defaultValue
        });
      }
      setRowParameters(newArrParam);
    } else {
      setRowParameters([]);
    }
  }, [diDetail]);

  React.useEffect(() => {
    if (diDetail.typeLocal == 'new' && diOperatorDetail != '') {
      if (diOperatorDetail.source?.parameters) {
        for (var key in diOperatorDetail.source?.parameters) {
          if (diOperatorDetail.source?.parameters[key])
            formik.setFieldValue(
              `${key}source`,
              diOperatorDetail.source?.parameters[key]
            );
        }
      }
      if (diOperatorDetail.sink?.parameters) {
        for (var key in diOperatorDetail.sink?.parameters) {
          if (diOperatorDetail.sink?.parameters[key])
            formik.setFieldValue(
              `${key}sink`,
              diOperatorDetail.sink?.parameters[key]
            );
        }
      }
    } else {
      if (diOperatorDetail?.properties?.source?.parameters) {
        for (var key in diOperatorDetail?.properties?.source?.parameters) {
          if (diOperatorDetail?.properties?.source?.parameters[key])
            formik.setFieldValue(
              `${key}source`,
              diOperatorDetail?.properties?.source?.parameters[key]
            );
        }
      }
      if (diOperatorDetail?.properties?.sink?.parameters) {
        for (var key in diOperatorDetail?.properties?.sink?.parameters) {
          if (diOperatorDetail?.properties?.sink?.parameters[key])
            formik.setFieldValue(
              `${key}sink`,
              diOperatorDetail?.properties?.sink?.parameters[key]
            );
        }
      }
    }
  }, [diOperatorDetail]);

  const validationSchema = yup.object({
    name: yup.string('Enter your Name').required('Name is required'),
    retries: yup
      .number()
      .max(1000, 'Limit time 20M')
      .required('This field is requried'),
    datasetIdSource: yup
      .string('Enter your source dataset')
      .required('Source dataset is required'),
    datasetIdSink: yup
      .string('Enter your sink dataset')
      .required('Sink dataset is required'),
    saveMode: yup
      .string('Enter your save mode')
      .required('Save mode is required')
  });

  const formik = useFormik({
    initialValues: {
      name: diOperatorDetail?.name,
      retries:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail?.retries
          : diOperatorDetail?.policy?.retries,
      datasetIdSource:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail?.source?.datasetId
          : diOperatorDetail?.properties?.source?.datasetId,
      datasetIdSink:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail.sink?.datasetId
          : diOperatorDetail?.properties?.sink?.datasetId,
      saveMode:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail.sink?.saveMode
          : diOperatorDetail?.properties?.sink?.saveMode
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const {
        datasetIdSink,
        datasetIdSource,
        name,
        retries,
        saveMode
      } = values;
      const dataSink = diDataset.find(item => item.id == datasetIdSink);
      const dataSource = diDataset.find(item => item.id == datasetIdSource);
      let paramSink = {};
      let paramSource = {};
      if (dataSink.parameters)
        for (var key in dataSink?.parameters) {
          paramSink = Object.assign(paramSink, { [key]: values[`${key}sink`] });
        }
      if (dataSource?.parameters)
        for (var key in dataSource?.parameters) {
          paramSource = Object.assign(paramSource, {
            [key]: values[`${key}source`]
          });
        }
      let index = 0;
      diCreatePipline?.map((item, i) => {
        if (item?.id == diDetail?.id) index = i;
      });
      let beforeName = diCreatePipline[index].operators.find(
        item => item.id == diOperatorDetail.id
      ).name;
      let arrMapping = [];
      refData.current?.map(item => {
        return arrMapping.push({
          sourceName: item.sourceName,
          sourceDataType: item.sourceDataType,
          sinkName: item.sinkName,
          sinkDataType: item.sinkDataType,
          expression: item?.expression,
          encryptionKey: {
            value: item?.isEncrypted,
            secretType: 'StringSecret'
          }
        });
      });
      const formatValue = {
        id: diOperatorDetail.id,
        name,
        label: name,
        retries,
        source: {
          datasetId: datasetIdSource,
          parameters: isEmpty(paramSource) ? null : paramSource
        },
        sink: {
          datasetId: datasetIdSink,
          saveMode: saveMode,
          parameters: isEmpty(paramSink) ? null : paramSink
        },
        mapping: arrMapping
      };

      let filterObj = diCreatePipline.find((item, i) => {
        return item?.id == diDetail?.id;
      });
      let newOperators = [...filterObj.operators];
      let newOperatorsFormat = [];
      newOperators.map(item => {
        if (item.dependsOn?.length == 0) {
          return newOperatorsFormat.push(item);
        } else {
          let obj = { ...item };
          let itemTrong = item.dependsOn.map(dep => {
            if (dep == beforeName) return name;
            else return dep;
          });
          return newOperatorsFormat.push({ ...obj, dependsOn: itemTrong });
        }
      });
      let indexOperator = 0;
      filterObj.operators?.map((item, i) => {
        if (item?.id == diOperatorDetail?.id) indexOperator = i;
      });

      newOperatorsFormat.splice(indexOperator, 1, {
        ...newOperatorsFormat[indexOperator],
        ...formatValue
      });
      let dataEnd = [...diCreatePipline];
      dataEnd.splice(index, 1, {
        ...filterObj,
        operators: newOperatorsFormat
      });
      dispatch(addOperatorPipelineLocal(dataEnd));
      dispatch(getOperatorDetalLocal(formatValue));
    }
  });

  const handleChangeTabs = (event, newValue) => setValue(newValue);

  const handleChangeTabsGeneral = (event, newValue) =>
    setValueTab({ ...valueTab, tabDataset: newValue });

  const handleChangeFormat = event =>
    formik.setFieldValue('saveMode', event.target.value);

  const testFunc = value => (refData.current = value);

  return (
    <>
      {opeSelect == '' ? (
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={valueTab.tabDataset}
              onChange={handleChangeTabsGeneral}
              aria-label="basic tabs example"
            >
              <Tab label="Mirror" {...a11yProps(0)} />
              <Tab label="Parameters" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <Collapse
            in={valueTab.tabDataset === 0 ? true : false}
            timeout="auto"
            unmountOnExit
          >
            <TextField
              disabled={true}
              sx={{ m: 2, width: '50%' }}
              fullWidth
              label="Name"
              value={diDetail?.name}
            />
            <TextField
              disabled={true}
              sx={{ m: 2, width: '50%' }}
              fullWidth
              label="Owner"
              value={diDetail?.owner}
            />
            <TextField
              disabled={true}
              sx={{ m: 2, width: '50%' }}
              fullWidth
              id="name"
              name="name"
              label="Description"
              value={
                diDetail?.description != undefined ? diDetail?.description : '-'
              }
            />
          </Collapse>
          <Collapse
            in={valueTab.tabDataset === 1 ? true : false}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ height: '24vh' }}>
              <DataGrid
                editMode="row"
                checkboxSelection
                components={{
                  Footer: () => {
                    return <></>;
                  },
                  NoRowsOverlay: () => {
                    return <NoRowsComponent />;
                  }
                }}
                rows={rowParameters}
                columns={columnsParameters}
                selectionModel={selectionModel}
                onRowEditStop={({ row }) => {
                  let cloneRowParam = [...rowParameters];
                  let index = rowParameters.findIndex(
                    item => item.id == row.id
                  );
                  cloneRowParam.splice(index, 1, row);
                  setRowParameters(cloneRowParam);
                }}
                onSelectionModelChange={newSelectionModel =>
                  setSelectionModel(newSelectionModel)
                }
                disableSelectionOnClick
              />
            </Box>
          </Collapse>
        </Box>
      ) : (
        <>
          {diOperatorDetail?.type == 'ftelsqlNode' ? (
            <FtelSqlOpeComponent />
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={value}
                    onChange={handleChangeTabs}
                    aria-label="basic tabs example"
                  >
                    <Tab label="General" {...a11yProps(0)} />
                    <Tab label="Source" {...a11yProps(1)} />
                    <Tab label="Sink" {...a11yProps(2)} />
                    <Tab label="Mapping" {...a11yProps(3)} />
                  </Tabs>
                </Box>
                <Collapse
                  in={value === 0 ? true : false}
                  timeout="auto"
                  unmountOnExit
                >
                  <TextField
                    disabled={diDetail.typeLocal != 'new'}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel
                      }
                    }}
                    sx={{ m: 2, width: '50%' }}
                    fullWidth
                    id="name"
                    name="name"
                    label="Name *"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onKeyPress={event => preventSpecialCharacters(event)}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    disabled={diDetail.typeLocal != 'new'}
                    sx={{ m: 2, width: '50%' }}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel
                      }
                    }}
                    fullWidth
                    type={'number'}
                    id="retries"
                    name="retries"
                    label="Retries *"
                    value={formik.values.retries}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.retries && Boolean(formik.errors.retries)
                    }
                    helperText={formik.touched.retries && formik.errors.retries}
                  />
                </Collapse>
                <Collapse
                  in={value === 1 ? true : false}
                  timeout="auto"
                  unmountOnExit
                  sx={{ m: 2 }}
                >
                  <FormControl sx={{ mb: 2, width: '50%' }}>
                    <InputLabel>Dataset</InputLabel>
                    <Select
                      disabled={diDetail.typeLocal != 'new'}
                      id="datasetIdSource"
                      name="datasetIdSource"
                      label="Datasource"
                      value={formik.values.datasetIdSource}
                      onChange={formik.handleChange}
                    >
                      {diDataset &&
                        diDataset?.map(item => {
                          return (
                            <MenuItem value={item.id}>{item.name}</MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  <Box sx={{ width: '50%' }}>
                    <DatasetPropertiesComponent
                      typeParam={'source'}
                      formik={formik}
                      dataset={formik.values.datasetIdSource}
                    />
                  </Box>
                </Collapse>
                <Collapse
                  in={value === 2 ? true : false}
                  timeout="auto"
                  unmountOnExit
                  sx={{ m: 2 }}
                >
                  <FormControl sx={{ m: 2, width: '50%' }}>
                    <InputLabel>Dataset</InputLabel>
                    <Select
                      disabled={diDetail.typeLocal != 'new'}
                      id="datasetIdSink"
                      name="datasetIdSink"
                      label="Datasource"
                      value={formik.values.datasetIdSink}
                      onChange={formik.handleChange}
                    >
                      {diDataset &&
                        diDataset?.map(item => {
                          return (
                            <MenuItem value={item.id}>{item.name}</MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  <Box sx={{ width: '50%' }}>
                    <DatasetPropertiesComponent
                      typeParam={'sink'}
                      formik={formik}
                      dataset={formik.values.datasetIdSink}
                    />
                  </Box>
                  <FormControl sx={{ m: 2, width: '50%' }}>
                    <InputLabel id="demo-simple-select-label">
                      Save mode
                    </InputLabel>
                    <Select
                      disabled={diDetail.typeLocal != 'new'}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formik.values.saveMode}
                      label="Save mode"
                      onChange={handleChangeFormat}
                    >
                      {enumFormat?.map(item => {
                        return (
                          <MenuItem value={item.title}>{item.title}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Collapse>
                <TabPanel value={value} index={3}>
                  <Testmui setData={testFunc} defaultValue={refData.current} />
                  {diDetail.typeLocal == 'new' && (
                    <Button
                      sx={{ m: 5, width: '20%' }}
                      color="primary"
                      variant="contained"
                      fullWidth
                      type="submit"
                      disabled={
                        formik.getFieldProps('datasetIdSource').value != ''
                          ? formik.getFieldProps('datasetIdSink').value != ''
                            ? false
                            : true
                          : true
                      }
                    >
                      Save Operator
                    </Button>
                  )}
                </TabPanel>
              </Box>
            </form>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(DetailPipelineComponent);
