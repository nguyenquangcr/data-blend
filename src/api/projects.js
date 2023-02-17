import axios from '../utils/httpServices';

import { GETLIST_PROJECT } from './endpoint';

/**
 * LOGIN
 */
export const projectService = {
  //Project
  _getList: () => {
    const endpoint = GETLIST_PROJECT;
    return axios.get(endpoint);
  },
  _getDetailProject: idProject => {
    const endpoint = `${GETLIST_PROJECT}/${idProject}`;
    return axios.get(endpoint);
  },
  _createProject: data => {
    const endpoint = `${GETLIST_PROJECT}`;
    return axios.post(endpoint, data);
  },
  _updateProject: (data, id) => {
    const endpoint = `${GETLIST_PROJECT}/${id}`;
    return axios.put(endpoint, data);
  },
  _deleteProject: id => {
    const endpoint = `${GETLIST_PROJECT}/${id}`;
    return axios.delete(endpoint, null);
  },
  // get partial list
  _getPartialList: (projectId, start, limit, key) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/${key}?start=${start}&limit=${limit}`;
    return axios.get(endpoint);
  },
  //Connection
  _getListConnections: projectId => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/connections`;
    return axios.get(endpoint);
  },
  _createConnections: (projectId, data) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/connections`;
    return axios.post(endpoint, data);
  },
  _updateConnections: (projectId, connectionId, data) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/connections/${connectionId}`;
    return axios.put(endpoint, data);
  },
  _deleteConnections: (projectId, connectionId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/connections/${connectionId}`;
    return axios.delete(endpoint, null);
  },
  _getDetailConnections: (projectId, connectionId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/connections/${connectionId}`;
    return axios.get(endpoint, null);
  },
  //Dataset
  _getListDatasets: projectId => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets`;
    return axios.get(endpoint);
  },
  _createDataset: (projectId, data) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets`;
    return axios.post(endpoint, data);
  },
  _updateDatasets: (projectId, datasetId, data) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets/${datasetId}`;
    return axios.put(endpoint, data);
  },
  _deleteDatasets: (projectId, datasetId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets/${datasetId}`;
    return axios.delete(endpoint, null);
  },
  _getDetailDataset: (projectId, datasetId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets/${datasetId}`;
    return axios.get(endpoint, null);
  },
  _getSchemaDataset: (projectId, datasetId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets/${datasetId}/schema`;
    return axios.get(endpoint, null);
  },
  __getPreviewDataset: (projectId, datasetId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets/${datasetId}/preview`;
    return axios.get(endpoint, null);
  },
  //Pipeline
  _getListPipelines: projectId => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/pipelines`;
    return axios.get(endpoint);
  },
  _getDetailPipeline: (projectId, pipelineId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/pipelines/${pipelineId}`;
    return axios.get(endpoint, null);
  },
  _createPipeline: (projectId, data) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/pipelines`;
    return axios.post(endpoint, data);
  },
  _deletePipeline: (projectId, pipelineId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/pipelines/${pipelineId}`;
    return axios.delete(endpoint, null);
  },
  //RUNPIPLINE
  _changeStatusPipeline: (projectId, pipelineId, data) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/pipelines/${pipelineId}`;
    return axios.patch(endpoint, data);
  },
  _triggerRunPipeline: (projectId, pipelineId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/pipelines/${pipelineId}/pipelineruns`;
    return axios.post(endpoint, null);
  },
  _getListLogPipeline: (projectId, pipelineId) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/pipelines/${pipelineId}/pipelineruns`;
    return axios.get(endpoint);
  },
  //upload
  _updateLog: projectId => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/uploadHistory`;
    return axios.get(endpoint);
  },
  _deleteLog: (projectId, datasetId, data) => {
    const endpoint = `${GETLIST_PROJECT}/${projectId}/datasets/${datasetId}?purge=true`;
    return axios.delete(endpoint, data);
  }
};
