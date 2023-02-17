import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isArray } from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import SchemaCard from '../SchemaDatasetComponent';
import { projectService } from '~/api/projects';
import { PreviewDatasetContext, SchemaContext } from '.';
import PreviewDatasetComponent from '../PreviewDatasetComponent';
import { changeValueTabDataset } from '~/redux/slices/project';
import NoRowsComponent from '~/components/NoRowsComponent';
import { valueTabContext } from '~/App';

//constant
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
  labelValue: {
    overflow: 'auto',
    width: '50%',
    ['@media (max-width:900px)']: {
      width: '85%'
    },
    maxHeight: '45vh'
  }
}));

const DetailDatasetComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { typeDetail, diDetail } = useSelector(state => state.project);
  //context
  const [valueTab, setValueTab] = React.useContext(valueTabContext);
  const [schema, setSchema] = React.useContext(SchemaContext);
  const [dataPreview, setDataPreview] = React.useContext(PreviewDatasetContext);
  //state
  const [openSchemaCard, setOpenSchemaCard] = React.useState(false);
  const [openPreviewCard, setOpenPreviewCard] = React.useState(false);
  const [loadding, setLoadding] = React.useState(false);
  const [columns, setColumns] = React.useState([
    {
      field: 'columnName',
      headerName: 'Column name',
      editable: true,
      width: 150
    },
    {
      field: 'dataType',
      headerName: 'Data type',
      editable: true,
      width: 150
    }
  ]);
  const [data, setData] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [rowParameters, setRowParameters] = React.useState([]);

  React.useEffect(() => {
    let newData = [];
    if (isArray(diDetail?.schema)) {
      diDetail?.schema?.map(item => {
        return newData.push({
          id: Math.random(),
          columnName: item.columnName,
          dataType: item.dataType
        });
      });
    }
    setData(newData);

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

  const handleChangeTabs = (event, newValue) =>
    setValueTab({ ...valueTab, tabDataset: newValue });

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
          <Box className={classes.labelValue}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  return (
    <>
      <Box className={classes.labelBoxBottom}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={valueTab.tabDataset}
            onChange={handleChangeTabs}
            aria-label="basic tabs example"
          >
            <Tab label="Mirror" {...a11yProps(0)} />
            <Tab label="Schema" {...a11yProps(1)} />
            <Tab label="Parameters" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={valueTab.tabDataset} index={0}>
          <Button
            variant="contained"
            sx={{ m: 2, boxShadow: 'none' }}
            onClick={async () => {
              setOpenSchemaCard(false);
              setOpenPreviewCard(true);
              setLoadding(true);
              try {
                await projectService
                  .__getPreviewDataset(diDetail?.projectId, diDetail?.id)
                  .then(res => {
                    setDataPreview(res?.data);
                    setLoadding(false);
                  })
                  .catch(err => {
                    setLoadding(false);
                  });
              } catch (error) {
                setLoadding(false);
              }
            }}
          >
            Preview Data
          </Button>
          <List>
            <ListItemButton>
              <ListItemText primary="Name: " />
              <Typography>{diDetail?.name}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Description: " />
              <Typography>
                {diDetail?.description != undefined
                  ? diDetail?.description
                  : '-'}
              </Typography>
            </ListItemButton>
            {diDetail?.properties?.type == 'FtelLakeHouseDataset' ? (
              <>
                <ListItemButton>
                  <ListItemText primary="Location: " />
                  <Typography>{diDetail?.properties.location}</Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Partition by: " />
                  <Typography>
                    {diDetail?.properties?.partitionBy?.map(item => {
                      return `${item}, `;
                    })}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Table name: " />
                  <Typography>
                    {diDetail?.properties.tableName != undefined
                      ? diDetail?.properties.tableName
                      : '-'}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Type: " />
                  <Typography>{diDetail?.properties?.type}</Typography>
                </ListItemButton>
              </>
            ) : diDetail?.properties?.type == 'ParquetDataset' ? (
              <>
                <ListItemButton>
                  <ListItemText primary="Location: " />
                  <Typography>{diDetail?.properties.location}</Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Compression: " />
                  <Typography>
                    {diDetail?.properties?.compression || '-'}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Type: " />
                  <Typography>{diDetail?.properties?.type}</Typography>
                </ListItemButton>
              </>
            ) : diDetail?.properties?.type == 'DelimitedTextDataset' ? (
              <>
                <ListItemButton>
                  <ListItemText primary="Location: " />
                  <Typography>{diDetail?.properties.location}</Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Column delimiter: " />
                  <Typography>
                    {diDetail?.properties.columnDelimiter}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Encoding: " />
                  <Typography>
                    {diDetail?.properties?.encoding || '-'}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Compression: " />
                  <Typography>
                    {diDetail?.properties?.compression || '-'}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="First row as header: " />
                  <Typography>
                    {diDetail?.properties?.firstRowAsHeader?.toString() || '-'}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Type: " />
                  <Typography>{diDetail?.properties?.type}</Typography>
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton>
                  <ListItemText primary="Query: " />
                  <Typography>{diDetail?.properties?.query || '-'}</Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Schema: " />
                  <Typography>{diDetail?.properties?.schema || '-'}</Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Table name: " />
                  <Typography>
                    {diDetail?.properties?.tableName || '-'}
                  </Typography>
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Type: " />
                  <Typography>{diDetail?.properties?.type}</Typography>
                </ListItemButton>
              </>
            )}
          </List>
        </TabPanel>
        <TabPanel value={valueTab.tabDataset} index={1}>
          <Button
            variant="contained"
            sx={{ m: 2, boxShadow: 'none' }}
            onClick={async () => {
              setOpenSchemaCard(true);
              setOpenPreviewCard(false);
              setLoadding(true);
              try {
                const response = await projectService
                  ._getSchemaDataset(diDetail?.projectId, diDetail?.id)
                  .then(res => {
                    setSchema(res.data);
                    setLoadding(false);
                  })
                  .catch(err => {
                    setLoadding(false);
                  });
              } catch (error) {
                setLoadding(false);
              }
            }}
          >
            Import Schema
          </Button>
          <Button variant="contained" sx={{ m: 2, boxShadow: 'none' }}>
            Clear
          </Button>
          <Box sx={{ height: '24vh' }}>
            <DataGrid
              editMode="row"
              components={{
                Footer: () => {
                  return <></>;
                },
                NoRowsOverlay: () => {
                  return <NoRowsComponent />;
                }
              }}
              rows={data}
              columns={columns}
            />
          </Box>
        </TabPanel>
        <TabPanel value={valueTab.tabDataset} index={2}>
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
                let index = rowParameters.findIndex(item => item.id == row.id);
                cloneRowParam.splice(index, 1, row);
                setRowParameters(cloneRowParam);
              }}
              onSelectionModelChange={newSelectionModel =>
                setSelectionModel(newSelectionModel)
              }
              disableSelectionOnClick
            />
          </Box>
        </TabPanel>
      </Box>
      <SchemaCard
        isOpen={openSchemaCard}
        setOpenSchemaCard={setOpenSchemaCard}
        loading={loadding}
      />
      <PreviewDatasetComponent
        isOpen={openPreviewCard}
        setOpenSchemaCard={setOpenPreviewCard}
        loading={loadding}
      />
    </>
  );
};

export default React.memo(DetailDatasetComponent);
