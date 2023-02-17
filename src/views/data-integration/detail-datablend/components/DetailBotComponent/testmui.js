import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
  randomId
} from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NoRowsComponent from '~/components/NoRowsComponent';

function EditToolbar(props) {
  const { setRows, setRowModesModel, diDetail } = props;

  const handleClick = () => {
    const id = randomId();
    setRows(oldRows => [
      ...oldRows,
      {
        id,
        sourceName: '',
        sourceDataType: '',
        sinkName: '',
        sinkDataType: '',
        expression: '',
        isEncrypted: '',
        isNew: true
      }
    ]);
    setRowModesModel(oldModel => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'sourceName' }
    }));
  };

  return (
    <>
      {diDetail.typeLocal == 'new' && (
        <GridToolbarContainer>
          <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
            Add item
          </Button>
        </GridToolbarContainer>
      )}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  styleBoxContainer: {
    width: '100%',
    '& .actions': {
      color: 'text.secondary'
    },
    '& .textPrimary': {
      color: 'text.primary'
    }
  }
}));

const Testmui = ({ setData, defaultValue }) => {
  const classes = useStyles();
  const { diDetail, diOperatorDetail } = useSelector(state => state.project);
  //state
  const [rows, setRows] = React.useState(defaultValue);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(() => {
    if (defaultValue.length != 0) {
      return setRows(defaultValue);
    } else if (diDetail.typeLocal == 'new' && diOperatorDetail != '') {
      let newData = [];
      diOperatorDetail?.mapping?.map(item => {
        return newData.push({
          id: Math.random(),
          sourceName: item.sourceName,
          sourceDataType: item.sourceDataType,
          sinkName: item.sinkName,
          sinkDataType: item.sinkDataType,
          expression: item?.expression,
          isEncrypted: item?.encryptionKey?.value
        });
      });
      setRows(newData);
    } else {
      let newData = [];
      diOperatorDetail?.properties?.mapping?.map(item => {
        return newData.push({
          id: Math.random(),
          sourceName: item?.source?.name,
          sourceDataType: item?.source?.dataType,
          sinkName: item?.sink?.name,
          sinkDataType: item?.sink?.dataType,
          expression: item?.sink?.expression,
          isEncrypted: item?.encryptionKey?.value
        });
      });
      setRows(newData);
    }
  }, [diDetail, diOperatorDetail]);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = id => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = id => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = id => () => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleCancelClick = id => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find(row => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const processRowUpdate = newRow => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map(row => (row.id === newRow.id ? updatedRow : row)));
    setData(rows.map(row => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = React.useMemo(() => {
    if (diDetail.typeLocal == 'new') {
      return [
        {
          field: 'sourceName',
          headerName: 'Source Name',
          width: 150,
          editable: true
        },
        {
          field: 'sourceDataType',
          headerName: 'Source data type',
          editable: true,
          width: 150
        },
        {
          field: 'sinkName',
          headerName: 'Sink Name',
          width: 150,
          editable: true
        },
        {
          field: 'sinkDataType',
          headerName: 'Sink data type',
          width: 150,
          editable: true
        },
        {
          field: 'expression',
          headerName: 'Expression',
          editable: true,
          width: 150
        },
        {
          field: 'isEncrypted',
          headerName: 'Encryption Key',
          width: 150,
          editable: true,
          renderCell: data => {
            return (
              <>
                {data.value !== '' ? (
                  data.value
                ) : (
                  <TextField
                    className={classes.labelTextField}
                    disabled
                    placeholder="Unencrypted"
                    variant="standard" // <== changed this
                    margin="normal"
                  />
                )}
              </>
            );
          }
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 100,
          cellClassName: 'actions',
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />
              ];
            }

            return [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />
            ];
          }
        }
      ];
    } else
      return [
        {
          field: 'sourceName',
          headerName: 'Source Name',
          width: 150,
          editable: true
        },
        {
          field: 'sourceDataType',
          headerName: 'Source data type',
          editable: true,
          width: 150
        },
        {
          field: 'sinkName',
          headerName: 'Sink Name',
          width: 150,
          editable: true
        },
        {
          field: 'sinkDataType',
          headerName: 'Sink data type',
          width: 150,
          editable: true
        },
        {
          field: 'expression',
          headerName: 'Expression',
          editable: true,
          width: 150
        },
        {
          field: 'isEncrypted',
          headerName: 'Encryption Key',
          width: 150,
          editable: true,
          renderCell: data => {
            return (
              <>
                {data.value !== '' ? (
                  data.value
                ) : (
                  <TextField
                    className={classes.labelTextField}
                    disabled
                    placeholder="Unencrypted"
                    variant="standard" // <== changed this
                    margin="normal"
                  />
                )}
              </>
            );
          }
        }
      ];
  }, [diDetail, rows, rowModesModel]);

  return (
    <Box className={classes.styleBoxContainer}>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        autoHeight
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Footer: () => {
            return <></>;
          },
          NoRowsOverlay: () => {
            return <NoRowsComponent />;
          },
          Toolbar: EditToolbar
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel, diDetail }
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

export default React.memo(Testmui);
