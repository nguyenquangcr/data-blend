import * as React from 'react';
import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { SchemaContext } from './DetailBotComponent';
import { DataGrid } from '@mui/x-data-grid';
import LoadingScreen from '~/components/LoadingScreen';
import NoRowsComponent from '~/components/NoRowsComponent';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626'
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959'
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343'
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c'
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff'
  }
}));

const useStyles = makeStyles(theme => ({
  cardStyle: {
    zIndex: 1000,
    position: 'fixed',
    right: '-100%',
    top: '7%',
    borderRadius: '8px 0px 0px 8px',
    backgroundColor: theme.palette.background.default,
    transition: 'all .7s'
  },
  openCardRight: {
    right: '0'
  },
  boxCustomForm: {
    maxHeight: '90vh',
    height: '90vh',
    overflowY: 'auto',
    marginBottom: '20px',
    paddingRight: '10px',
    paddingTop: '10px'
  }
}));
const columnsParameters = [
  { field: 'nameColumn', headerName: 'Name', editable: true, width: 150 },
  {
    field: 'typeColumn',
    headerName: 'Type',
    width: 150,
    editable: true
  }
];

export default function SchemaCard({ isOpen, setOpenSchemaCard, loading }) {
  const classes = useStyles();
  //context
  const [schema, setSchema] = React.useContext(SchemaContext);
  //state
  const [rowParameters, setRowParameters] = React.useState([]);

  React.useEffect(() => {
    let newArrParam = [];
    if (schema != null) {
      schema?.schema?.map(item => {
        newArrParam.push({
          id: Math.random(),
          nameColumn: item?.columnName,
          typeColumn: item?.dataType
        });
      });
      setRowParameters(newArrParam);
    }
  }, [schema]);

  return (
    <Card
      sx={{ width: '30vw' }}
      className={clsx(
        classes.cardStyle,
        classes.boxCustomForm,
        isOpen ? classes.openCardRight : ''
      )}
    >
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography
            // className={classes.customTitle}
            id="keep-mounted-modal-title"
            variant="h5"
            sx={{
              mb: 3,
              padding: '10px 5px 10px 5px',
              borderBottom: 'solid 1px'
            }}
          >
            Schema dataset
          </Typography>
        </Box>
        <Box sx={{ height: '65vh', mt: 2 }}>
          {loading == true ? (
            <LoadingScreen />
          ) : (
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
              rows={rowParameters}
              columns={columnsParameters}
            />
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          sx={{ m: 2, boxShadow: 'none' }}
          onClick={() => setOpenSchemaCard(false)}
        >
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
}
