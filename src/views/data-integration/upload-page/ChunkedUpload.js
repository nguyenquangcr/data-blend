import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { actionSetPreview } from '~/redux/slices/upload';
import { updateHitoryUpload } from '~/redux/slices/project';
import { CSVToArray } from '~/utils/CSVtoArray';
import { linkImage } from '../detail-datablend/constant';

const chunkSize = 10000 * 1024;

const useStyle = makeStyles(theme => ({
  dropzoneActive: {
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main
  },
  dropzone: {},
  labelHidden: {
    opacity: '0',
    position: 'absolute',
    zIndex: '-1'
  }
}));

function ChunkedUpload({
  currentChunkIndex,
  setCurrentChunkIndex,
  setIsFetching,
  setProgress,
  formik,
  isFetching,
  setCheckFile
}) {
  const { connection } = formik.values;
  const classes = useStyle();
  const dispatch = useDispatch();
  const { idProject } = useParams();
  //state
  const [files, setFiles] = useState([]);
  const [dropzoneActive, setDropzoneActive] = useState(false);

  useEffect(() => {
    setCheckFile(files);
  }, [files]);

  const checkNameField = name => {
    if (name === '.csv' || name === 'xlsx' || name === '.xls') return true;
    else return false;
  };

  function handleDrop(e) {
    e.preventDefault();
    if (
      !files.length &&
      e.dataTransfer.files?.length > 0 &&
      checkNameField(e.dataTransfer.files[0]?.name.slice(-4)) === true
    ) {
      setFiles([...files, ...e.dataTransfer.files]);
      setProgress(0);
      setDropzoneActive(true);
    }
  }

  function readAndUploadCurrentChunk() {
    const reader = new FileReader();
    const file = files[0];
    if (!file) {
      return;
    }
    const from = currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = e => uploadChunk(e);
    reader.readAsDataURL(blob);
  }

  function uploadPreview() {
    const previewReader = new FileReader();
    previewReader.onload = e => {
      const preview = e.target.result;
      dispatch(
        actionSetPreview(
          CSVToArray(preview).slice(
            0,
            CSVToArray(preview).length > 50
              ? 50
              : CSVToArray(preview).length - 1
          )
        )
      );
    };
    previewReader.readAsText(files[0].slice(0, 1000000));
  }

  async function uploadChunk(readerEvent) {
    const file = files[0];
    const data = new FormData();
    data.append('file', file);
    const headers = {
      authorization: `Bearer ${localStorage.getItem('accessToken')}`
    };
    const url = `${process.env.REACT_API_DATA_BLEND}/projects/${idProject}/connections/${connection}/upload`;
    await fetch(url, { method: 'POST', headers, body: data })
      .then(res => {
        if (res?.status == 200) {
          toast.success('successful');
          dispatch(updateHitoryUpload(idProject));
          setProgress(100);
          setIsFetching(false);
          setFiles([]);
          setDropzoneActive(false);
          document.getElementById('uploadFile').value = '';
          formik.resetForm();
        } else if (res?.status == 500) {
          toast.error('Internal server error');
          dispatch(updateHitoryUpload(idProject));
          setProgress(100);
          setIsFetching(false);
          setFiles([]);
          setDropzoneActive(false);
          document.getElementById('uploadFile').value = '';
          formik.resetForm();
        } else {
          res?.json().then(body => {
            toast.error(body.message);
            dispatch(updateHitoryUpload(idProject));
            setProgress(100);
            setIsFetching(false);
            setFiles([]);
            setDropzoneActive(false);
            document.getElementById('uploadFile').value = '';
            formik.resetForm();
          });
        }
      })
      .catch(err => {
        setIsFetching(false);
        setFiles([]);
        toast.error('failed');
        document.getElementById('uploadFile').value = '';
      });
  }

  const handleDeleteBtnClick = () => {
    setFiles([]);
    setDropzoneActive(false);
    setCurrentChunkIndex(null);
    dispatch(actionSetPreview([]));
    document.getElementById('uploadFile').value = '';
  };

  useEffect(() => {
    if (files.length > 0) {
      uploadPreview();
    }
  }, [files.length]);

  useEffect(() => {
    if (isFetching == true) readAndUploadCurrentChunk();
  }, [isFetching]);

  return (
    <Box>
      <Box
        sx={{
          border: '1px solid #e8e8e8',
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: '#fcfcfc',
          padding: 2,
          height: 300
        }}
        onDragOver={e => e.preventDefault()}
        onDragLeave={e => {
          if (!files.length) setDropzoneActive(false);
          e.preventDefault();
        }}
        onDrop={e => handleDrop(e)}
        className={dropzoneActive ? classes.dropzoneActive : classes.dropzone}
      >
        {!dropzoneActive && (
          <>
            <label style={{ cursor: 'pointer' }} for="uploadFile">
              <img
                for={'avatar'}
                alt="Upload"
                src={`${linkImage}/upload.png`}
                width="40%"
                style={{ margin: '0 auto' }}
                onDragStart={e => e.preventDefault()}
              />
            </label>
          </>
        )}
        {'Drop a file'} (*.csv, *.xlsx, *xls)
        <input
          type="file"
          id="uploadFile"
          name="avatar"
          accept=".xlsx, .xls, .csv"
          className={classes.labelHidden}
          onChange={e => {
            if (
              !files.length &&
              e.target.files?.length > 0 &&
              checkNameField(e.target.files[0]?.name.slice(-4)) === true
            ) {
              setFiles([...files, ...e.target.files]);
              setProgress(0);
              setDropzoneActive(true);
            }
          }}
        />
        {files.length > 0 && (
          <Card sx={{ textAlign: 'left', mt: 1, position: 'relative' }}>
            <CardContent>
              <Typography variant="body1">File: {files[0]?.name}</Typography>
              <Typography variant="body1">
                {files[0].size > 10 ** 9
                  ? `Size: ${(files[0].size / 10 ** 9).toPrecision(3)}GB`
                  : files[0].size > 10 ** 6
                  ? `Size: ${(files[0].size / 1000 ** 2).toPrecision(4)}MB`
                  : `Size: ${(files[0].size / 1000).toPrecision(4)}KB`}
              </Typography>
              <IconButton
                sx={{ position: 'absolute', top: 10, right: 10 }}
                onClick={handleDeleteBtnClick}
              >
                <ClearIcon />
              </IconButton>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default ChunkedUpload;
