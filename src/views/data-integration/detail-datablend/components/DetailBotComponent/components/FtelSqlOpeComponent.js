import React from 'react';
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
import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
  addOperatorPipelineLocal,
  getOperatorDetalLocal
} from '~/redux/slices/project';

const FtelSqlOpeComponent = () => {
  const dispatch = useDispatch();
  //state
  const [value, setValue] = React.useState(0);
  const [ftelConnectionArr, setftelConnectionArr] = React.useState([]);
  const [GitlabConnectionArr, setGitlabConnectionArr] = React.useState([]);
  //selector
  const {
    diConection,
    diDataset,
    diDetail,
    diOperatorDetail,
    diCreatePipline,
    opeSelect
  } = useSelector(state => state.project);

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
  const classes = useStyles();

  React.useEffect(() => {
    let arrFtel = [];
    let arrGitlab = [];
    diConection?.map(item => {
      if (item?.properties?.type == 'FtelLakeHouseConnection')
        return arrFtel.push(item);
      else if (item?.properties?.type == 'GitLabConnection')
        return arrGitlab.push(item);
    });
    setftelConnectionArr(arrFtel);
    setGitlabConnectionArr(arrGitlab);
  }, [diConection]);

  const validationSchema = yup.object({
    name: yup.string('Enter your Name').required('Name is required'),
    retries: yup
      .number()
      .max(1000, 'Limit time 20M')
      .required('This field is requried'),
    serviceConnection: yup
      .string('Enter your Service connection')
      .required('Service connection is required'),
    scriptConnection: yup
      .string('Enter your sink script connection')
      .required('Script connection is required'),
    scriptPath: yup
      .string('Enter your script path')
      .required('Script path is required')
  });

  const formik = useFormik({
    initialValues: {
      name: diOperatorDetail?.name,
      retries:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail?.retries
          : diOperatorDetail?.policy?.retries,
      serviceConnection:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail?.serviceConnection
          : diOperatorDetail?.properties?.serviceConnection,
      scriptConnection:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail.scriptConnection
          : diOperatorDetail?.properties?.scriptConnection,
      scriptPath:
        diDetail.typeLocal == 'new'
          ? diOperatorDetail.scriptPath
          : diOperatorDetail?.properties?.scriptPath
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const {
        scriptConnection,
        scriptPath,
        name,
        retries,
        serviceConnection
      } = values;
      let index = 0;

      diCreatePipline?.map((item, i) => {
        if (item?.id == diDetail?.id) index = i;
      });
      let beforeName = diCreatePipline[index].operators.find(
        item => item.id == diOperatorDetail.id
      ).name;
      const formatValue = {
        id: diOperatorDetail.id,
        name,
        label: name,
        retries,
        serviceConnection,
        scriptConnection,
        scriptPath,
        type: 'ftelsqlNode'
      };
      let filterObj = diCreatePipline.find((item, i) => {
        return item?.id == diDetail?.id;
      });
      let newOperators = [...filterObj.operators];
      let newOperatorsFormat = [];
      newOperators.map(item => {
        if (item.dependsOn.length == 0) {
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

  const scriptConnection = formik.getFieldProps('scriptConnection');
  const serviceConnection = formik.getFieldProps('serviceConnection');
  const scriptPath = formik.getFieldProps('scriptPath');

  const handleChangeTabs = (event, newValue) => setValue(newValue);
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
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChangeTabs}
            aria-label="basic tabs example"
          >
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Service" {...a11yProps(1)} />
            <Tab label="Script" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <Collapse in={value === 0 ? true : false} timeout="auto" unmountOnExit>
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
            // inputProps={{ maxLength: 25 }}
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
            error={formik.touched.retries && Boolean(formik.errors.retries)}
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
            <InputLabel>Service Connection</InputLabel>
            <Select
              disabled={diDetail.typeLocal != 'new'}
              id="serviceConnection"
              name="serviceConnection"
              label="Service Connection"
              value={formik.values.serviceConnection}
              onChange={formik.handleChange}
            >
              {ftelConnectionArr &&
                ftelConnectionArr?.map(item => {
                  return <MenuItem value={item.id}>{item.name}</MenuItem>;
                })}
            </Select>
          </FormControl>
        </Collapse>
        <Collapse
          in={value === 2 ? true : false}
          timeout="auto"
          unmountOnExit
          sx={{ m: 2 }}
        >
          <FormControl sx={{ mb: 2, width: '50%' }}>
            <InputLabel>Script Connection</InputLabel>
            <Select
              disabled={diDetail.typeLocal != 'new'}
              id="scriptConnection"
              name="scriptConnection"
              label="Script Connection"
              value={formik.values.scriptConnection}
              onChange={formik.handleChange}
            >
              {GitlabConnectionArr &&
                GitlabConnectionArr?.map(item => {
                  return <MenuItem value={item.id}>{item.name}</MenuItem>;
                })}
            </Select>
          </FormControl>
          <TextField
            disabled={diDetail.typeLocal != 'new'}
            sx={{ m: 2, width: '50%', ml: 0 }}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel
              }
            }}
            fullWidth
            id="scriptPath"
            name="scriptPath"
            label="Script Path *"
            value={formik.values.scriptPath}
            onChange={formik.handleChange}
            inputProps={{ maxLength: 25 }}
            // onKeyPress={event => preventSpecialCharacters(event)}
            error={
              formik.touched.scriptPath && Boolean(formik.errors.scriptPath)
            }
            helperText={formik.touched.scriptPath && formik.errors.scriptPath}
          />
          <Box>
            {diDetail.typeLocal == 'new' && (
              <Button
                sx={{ m: 5, width: '20%' }}
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={
                  scriptConnection.value != ''
                    ? serviceConnection.value != ''
                      ? scriptPath.value != ''
                        ? false
                        : true
                      : true
                    : true
                }
              >
                Save Operator
              </Button>
            )}
          </Box>
        </Collapse>
      </Box>
    </form>
  );
};

export default FtelSqlOpeComponent;
