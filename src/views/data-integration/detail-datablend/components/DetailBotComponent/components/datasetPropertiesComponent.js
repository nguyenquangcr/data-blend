import React from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  TextField,
  ListItem,
  Typography
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';

const DatasetPropertiesComponent = ({
  typeParam,
  formik,
  dataset,
  setWatchDataParams
}) => {
  const {
    diDataset,
    diDetail,
    diOperatorDetail,
    diCreatePipline
  } = useSelector(state => state.project);

  const datasetChoose = diDataset.find(item => item.id == dataset);
  //state
  const [open, setOpen] = React.useState(true);
  const [arrParams, setArrParams] = React.useState([]);

  React.useEffect(() => {
    if (datasetChoose?.parameters) {
      let newArrParam = [];
      for (var key in datasetChoose?.parameters) {
        newArrParam.push({
          name: key,
          type: datasetChoose?.parameters[key].type,
          defaultValue: datasetChoose?.parameters[key].defaultValue
        });
      }
      setArrParams(newArrParam);
    } else setArrParams([]);
  }, [datasetChoose]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List>
      {arrParams.length != 0 ? (
        <>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              {open ? <ExpandLess /> : <ExpandMore />}{' '}
            </ListItemIcon>
            <ListItemText primary="Dataset properties" />
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary="Name" />
                <ListItemText primary="Type" />
                <ListItemText primary="Value" />
              </ListItem>

              {arrParams.map(item => {
                return (
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemText>
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          maxWidth: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.name}
                      </Typography>
                    </ListItemText>
                    <ListItemText primary={item.type} />
                    <ListItemText>
                      <TextField
                        disabled={diDetail.typeLocal != 'new'}
                        id={`${item.name}${typeParam}`}
                        name={`${item.name}${typeParam}`}
                        sx={{ width: '150px' }}
                        value={formik.values[`${item.name}${typeParam}`]}
                        placeholder={item.defaultValue}
                        onChange={formik.handleChange}
                      />
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </>
      ) : (
        ''
      )}
    </List>
  );
};

export default React.memo(DatasetPropertiesComponent);
