import {
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
import { useSelector } from 'react-redux';

const DetailConnectionComponent = () => {
  const { typeDetail, diDetail } = useSelector(state => state.project);
  //state
  const [value, setValue] = React.useState(0);

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
        width: '80%'
      },
      maxHeight: '45vh'
    }
  }));
  const classes = useStyles();

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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  const handleChangeTabs = (event, newValue) => setValue(newValue);

  const renderInfoConnection = () => {
    switch (diDetail?.properties?.type) {
      case 'FtelSharedStorageConnection':
        return (
          <>
            <ListItemButton>
              <ListItemText primary="Username " />
              <Typography>{diDetail.properties.username}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Password: " />
              <Typography>*******</Typography>
            </ListItemButton>
          </>
        );
      case 'FtelLakeHouseConnection':
        return (
          <>
            <ListItemButton>
              <ListItemText primary="Location " />
              <Typography>{diDetail.properties.location}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Database " />
              <Typography>{diDetail.properties.database}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Username " />
              <Typography>{diDetail.properties.username}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Password: " />
              <Typography>*******</Typography>
            </ListItemButton>
          </>
        );
      case 'PostgreSqlConnection':
        return (
          <>
            <ListItemButton>
              <ListItemText primary="Host: " />
              <Typography>{diDetail.properties?.host}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Port: " />
              <Typography>{diDetail.properties?.port}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Database: " />
              <Typography>{diDetail.properties?.database}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Username: " />
              <Typography>{diDetail.properties?.username}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Password: " />
              <Typography>*******</Typography>
            </ListItemButton>
          </>
        );
      case 'GitLabConnection':
        return (
          <>
            <ListItemButton>
              <ListItemText primary="Host " />
              <Typography>{diDetail.properties.host}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Reposistory " />
              <Typography>{diDetail.properties.reposistory}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Apikey " />
              {/* <Typography>{diDetail.properties.apiKey?.value}</Typography> */}
              <Typography>*******</Typography>
            </ListItemButton>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      <Box className={classes.labelBoxBottom}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChangeTabs}
            aria-label="basic tabs example"
          >
            <Tab label="Mirror" {...a11yProps(0)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <List>
            <ListItemButton>
              <ListItemText primary="Name: " />
              <Typography>{diDetail.name}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Description: " />
              <Typography>{diDetail.description || '-'}</Typography>
            </ListItemButton>
            {renderInfoConnection()}
          </List>
        </TabPanel>
      </Box>
    </>
  );
};

export default DetailConnectionComponent;
