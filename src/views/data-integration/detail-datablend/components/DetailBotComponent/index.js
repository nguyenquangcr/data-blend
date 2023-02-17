import { makeStyles } from '@mui/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import DetailConnectionComponent from './detailConnection';
import DetailDatasetComponent from './detailDataset';
import DetailPipelineComponent from './detailPipeline';

export const SchemaContext = React.createContext();

function SchemaProvider({ children }) {
  const [schema, setSchema] = React.useState(null);
  return (
    <SchemaContext.Provider value={[schema, setSchema]}>
      {children}
    </SchemaContext.Provider>
  );
}

export const PreviewDatasetContext = React.createContext();

function PreviewDatasetProvider({ children }) {
  const [dataPreview, setDataPreview] = React.useState(null);
  return (
    <PreviewDatasetContext.Provider value={[dataPreview, setDataPreview]}>
      {children}
    </PreviewDatasetContext.Provider>
  );
}

const DetailBotComponent = () => {
  const { typeDetail } = useSelector(state => state.project);

  const useStyles = makeStyles(theme => ({}));
  const classes = useStyles();

  const obj = {
    connection: <DetailConnectionComponent />,
    dataset: (
      <PreviewDatasetProvider>
        <SchemaProvider>
          <DetailDatasetComponent />
        </SchemaProvider>
      </PreviewDatasetProvider>
    ),
    pipeline: <DetailPipelineComponent />
  };

  return <div>{obj[typeDetail]}</div>;
};

export default React.memo(DetailBotComponent);
