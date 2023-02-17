import { isBuffer, isEmpty } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { projectService } from '~/api/projects';
import { openNotificationWithIcon } from '~/utils/notificationComponent';

// ----------------------------------------------------------------------

const initialState = {
  countOpe: 0,
  isOpenLeftMenuHeader: true,
  userScope: null,
  arrayLogUpload: [],
  isOpenLeftMenu: false,
  isLoading: false,
  error: false,
  projects: [],
  diIdProject: '',
  diListLogPipeline: [],
  partialList: {
    partialListConnection: [],
    partialListDataset: [],
    totalConnection: 1,
    totalDataset: 1
  },
  diConection: [],
  diDataset: [
    // {
    //   id: 1,
    //   name: 'test 1',
    //   parameters: {
    //     a: {
    //       type: 'string',
    //       defaultValue: '1'
    //     },
    //     b: {
    //       type: 'string',
    //       defaultValue: '2'
    //     }
    //   }
    // },
    // {
    //   id: 2,
    //   name: 'test 2'
    // }
  ],
  diCreatePipline: [
    // {
    //   description: '1',
    //   id: 0.35109992205875584,
    //   idProject: '35',
    //   name: '1',
    //   operators: [],
    //   owner: '1',
    //   schedule_interval: '1',
    //   start_date: '2022-04-17',
    //   timeout: 1,
    //   typeLocal: 'new'
    // }
    // {
    //   description: '2',
    //   id: 321312312,
    //   idProject: '35',
    //   name: '2',
    //   operators: [],
    //   owner: '1',
    //   schedule_interval: '1',
    //   start_date: '2022-04-17',
    //   timeout: 1,
    //   typeLocal: 'new'
    // }
  ],
  diApiPipline: [],
  diDetail: '',
  diOperatorDetail: '',
  typeDetail: '',
  sortBy: null,
  message: '',
  statusCode: 0,
  diFormDirty: false,
  diPageDetail: false,
  opeSelect: '',
  checkEdit: false,
  typeEdit: null,
  checkIdProjectPageDetail: null
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    increaseCountOpe(state, action) {
      state.countOpe = state.countOpe + 1;
    },
    // change checkIdProjectPageDetail
    changeCheckIdProjectPageDetail(state, action) {
      state.checkIdProjectPageDetail = action.payload;
    },
    //change variable left menu
    changeIsOpenLeftMenuHeader(state, action) {
      const { value } = action.payload;
      state.isOpenLeftMenuHeader = value;
    },
    //update userscop
    updateUserscop(state, action) {
      state.userScope = action.payload;
    },
    //action change state checkEdit
    updateCheckEdit(state, action) {
      state.checkEdit = action.payload;
    },
    updateTypeEdit(state, action) {
      state.typeEdit = action.payload;
    },
    //upload
    updateStateListLog(state, action) {
      state.arrayLogUpload = action.payload;
    },
    changeIsOpenLeftMenu(state, action) {
      const { value } = action.payload;
      state.isOpenLeftMenu = value;
    },
    updateOpeSelect(state, action) {
      state.opeSelect = action.payload;
    },
    //UPDATEIDPROJECT
    updateIdProject(state, action) {
      state.diIdProject = action.payload;
    },
    //UPDATE FORM DIRTY
    updateFormDirty(state, action) {
      state.diFormDirty = action.payload;
    },
    updateDiPageDetail(state, action) {
      state.diPageDetail = action.payload;
    },
    //TYPE DETAIL
    updateType(state, action) {
      state.typeDetail = action.payload;
    },
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },

    //Reset detail
    resetDiDetail(state, action) {
      state.isLoading = false;
      state.diDetail = '';
      state.typeDetail = '';
    },
    resetAll(state, action) {
      state.isLoading = false;
      state.typeDetail = '';
      state.diDetail = '';
      state.diOperatorDetail = '';
      state.diCreatePipline = [];
      state.diIdProject = '';
    },
    // PROJECTS
    getProjectsSuccess(state, action) {
      state.isLoading = false;
      state.projects = action.payload;
    },
    getDetailProjectsSuccess(state, action) {
      state.isLoading = false;
    },

    createProjectSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Create project success!';
    },

    deleteProjectSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Delete project success!';
    },

    //CONNECTION
    getConnectionsSuccess(state, action) {
      state.isLoading = false;
      state.diConection = action.payload;
    },

    resetPartialList(state, payload) {
      state.partialList = {
        partialListConnection: [],
        partialListDataset: []
      };
    },

    getPartialListSuccess(state, { payload }) {
      state.isLoading = false;
      let newValue = {};
      if (payload.key == 'connections')
        newValue = {
          partialListConnection: [
            ...state.partialList.partialListConnection,
            ...payload?.value?.value
          ],
          totalConnection: payload?.value?.total
        };
      else if (payload.key == 'datasets')
        newValue = {
          partialListDataset: [
            ...state.partialList.partialListDataset,
            ...payload?.value?.value
          ],
          totalDataset: payload?.value?.total
        };
      state.partialList = { ...state.partialList, ...newValue };
    },

    createConnectionSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Create connection success!';
    },

    deleteConnectionSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Delete connection success!';
    },

    getDetailConnectionSuccess(state, action) {
      state.isLoading = false;
      state.diDetail = action.payload;
    },

    //DATASET
    getDatasetsSuccess(state, action) {
      state.isLoading = false;
      state.diDataset = action.payload;
    },

    createDatasetSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Create dataset success!';
    },

    deleteDatasetSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Delete Dataset success!';
    },

    getDetailDatasetSuccess(state, action) {
      state.isLoading = false;
      state.diDetail = action.payload;
    },

    //PIPELINE
    createPipelineLocal(state, action) {
      state.isLoading = false;
      state.diCreatePipline = [...state.diCreatePipline, action.payload];
    },
    createPipelineSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Create pipeline success!';
    },

    detailPipelineLocal(state, action) {
      state.isLoading = false;
      state.diDetail = action.payload;
    },

    getPipelinesSuccess(state, action) {
      state.isLoading = false;
      state.diApiPipline = action.payload;
    },

    getListLogPipelineSuccess(state, action) {
      state.isLoading = false;
      state.diListLogPipeline = action.payload;
    },

    addOperatorPipelineLocal(state, action) {
      state.isLoading = false;
      state.diCreatePipline = action.payload;
    },

    getOperatorDetalLocal(state, action) {
      state.isLoading = false;
      state.diOperatorDetail = action.payload;
    },
    resetOperatorDetalLocal(state, action) {
      state.isLoading = false;
      state.diOperatorDetail = '';
    },

    getDetailPipelineSuccess(state, action) {
      state.isLoading = false;
      state.diDetail = action.payload;
    },

    deletePipelineSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Delete Pipeline success!';
    },

    runPipelineSuccess(state, action) {
      state.isLoading = false;
      state.message = 'Run pipeline success!';
    },

    //update pipeline
    updateDataMirrorPipelineLocal(state, action) {
      state.isLoading = false;
      state.diCreatePipline = action.payload;
    },

    //  SORT & FILTER PROJECTS
    sortByProjects(state, action) {
      state.sortBy = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getProjectsSuccess,
  sortByProjects,
  changeIsOpenLeftMenu,
  updateCheckEdit,
  updateTypeEdit,
  updateUserscop,
  changeIsOpenLeftMenuHeader,
  changeCheckIdProjectPageDetail,
  increaseCountOpe,
  resetPartialList
} = slice.actions;

// ----------------------------------------------------------------------
//TYPE
export function updateFormDirty(data) {
  return async dispatch => {
    dispatch(slice.actions.updateFormDirty(data));
  };
}

export function updateDiPageDetail(data) {
  return async dispatch => {
    dispatch(slice.actions.updateDiPageDetail(data));
  };
}

export function updateType(key) {
  return async dispatch => {
    dispatch(slice.actions.updateType(key));
  };
}
export function resetDiDetail() {
  return async dispatch => {
    dispatch(slice.actions.resetDiDetail());
  };
}
export function resetAll() {
  return async dispatch => {
    dispatch(slice.actions.resetAll());
  };
}

export function updateIdProject(id) {
  return async dispatch => {
    dispatch(slice.actions.updateIdProject(id));
  };
}

export function updateSelectOpe(data) {
  return async dispatch => {
    dispatch(slice.actions.updateOpeSelect(data));
  };
}

updateIdProject;
//Projects
export function getProjects() {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService._getList();

      if (response.status === 200 && !isEmpty(response.data)) {
        dispatch(slice.actions.getProjectsSuccess(response.data.value));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function getDetailProjects(idProject) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService._getDetailProject(idProject);
      if (response.status === 200 && !isEmpty(response.data))
        dispatch(slice.actions.getProjectsSuccess(response.data.value));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function createProject(data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._createProject(data)
        .then(res => {
          openNotificationWithIcon(res.status, res.statusText);
          dispatch(slice.actions.createProjectSuccess());
          dispatch(getProjects());
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function updateProject(data, id) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._updateProject(data, id)
        .then(res => {
          openNotificationWithIcon(res.status, 'Update project success');
          dispatch(slice.actions.createProjectSuccess());
          dispatch(getProjects());
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function deleteProject(id) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._deleteProject(id)
        .then(res => {
          openNotificationWithIcon(res.status, res.statusText);
          dispatch(slice.actions.deleteProjectSuccess());
          dispatch(getProjects());
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

//Get Partial List
export function getPartialList(id, start, limit, key) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      await projectService
        ._getPartialList(id, start, limit, key)
        .then(({ status, data }) => {
          if (status == 200 && data) {
            dispatch(
              slice.actions.getPartialListSuccess({
                key,
                value: data
              })
            );
          }
        })
        .catch(err => {
          openNotificationWithIcon(500, 'Connection: ' + err);
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      if (error.message) {
        error = error.message;
      }
      openNotificationWithIcon(500, 'Connection: ' + error);
    }
  };
}

//Connections
export function getListConnections(id) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService._getListConnections(id);
      if (response.status === 200 && !isEmpty(response.data)) {
        dispatch(slice.actions.getConnectionsSuccess(response.data.value));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      if (error.message) {
        error = error.message;
      }
      openNotificationWithIcon(500, 'Connection: ' + error);
    }
  };
}

export function createConnection(id, data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._createConnections(id, data)
        .then(res => {
          openNotificationWithIcon(res.status, 'Success');
          dispatch(slice.actions.createConnectionSuccess());
          dispatch(getListConnections(id));
        })
        .catch(err => {
          console.log('err:', err);
          openNotificationWithIcon(500, err);
          dispatch(slice.actions.hasError(err));
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function updateConnection(projectId, connectionId, data) {
  return async dispatch => {
    try {
      await projectService
        ._updateConnections(projectId, connectionId, data)
        .then(res => {
          openNotificationWithIcon(res.status, 'Update connection success');
          dispatch(updateCheckEdit(false));
          dispatch(getDetailConnection(projectId, connectionId));
          dispatch(getListConnections(projectId));
        })
        .catch(err => {
          console.log('err:', err);
          dispatch(updateCheckEdit(false));
          openNotificationWithIcon(500, err);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      console.log('error:', error);
      dispatch(updateCheckEdit(false));
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function deleteConnection(projectId, connectionId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._deleteConnections(projectId, connectionId)
        .then(res => {
          openNotificationWithIcon(res.status, res.statusText);
          dispatch(slice.actions.deleteConnectionSuccess());
          dispatch(getListConnections(projectId));
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function getDetailConnection(projectId, connectionId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService._getDetailConnections(
        projectId,
        connectionId
      );
      if (response.status === 200 && !isEmpty(response.data)) {
        dispatch(slice.actions.getDetailConnectionSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

//Dataset
export function getListDatasets(id) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService._getListDatasets(id);
      if (response.status === 200 && !isEmpty(response.data)) {
        dispatch(slice.actions.getDatasetsSuccess(response.data.value));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      if (error.message) {
        error = error.message;
      }
      openNotificationWithIcon(500, 'Dataset: ' + error);
    }
  };
}

export function createDataset(id, data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._createDataset(id, data)
        .then(res => {
          openNotificationWithIcon(res.status, res.statusText);
          dispatch(slice.actions.createDatasetSuccess());
          dispatch(getListDatasets(id));
        })
        .catch(err => {
          openNotificationWithIcon(500, err);
          openNotificationWithIcon(500, err.message);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteDataset(projectId, datasetId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._deleteDatasets(projectId, datasetId)
        .then(res => {
          openNotificationWithIcon(res.status, res.statusText);
          dispatch(slice.actions.deleteDatasetSuccess());
          dispatch(getListDatasets(projectId));
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getDetailDataset(projectId, datasetId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService._getDetailDataset(
        projectId,
        datasetId
      );
      if (response.status === 200 && !isEmpty(response.data)) {
        dispatch(slice.actions.getDetailDatasetSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

export function updateDataset(projectId, datasetId, data) {
  return async dispatch => {
    try {
      await projectService
        ._updateDatasets(projectId, datasetId, data)
        .then(res => {
          openNotificationWithIcon(res.status, 'Update datataset success');
          dispatch(updateCheckEdit(false));
          dispatch(getDetailDataset(projectId, datasetId));
          dispatch(getListConnections(projectId));
        })
        .catch(err => {
          console.log('err:', err);
          dispatch(updateCheckEdit(false));
          openNotificationWithIcon(500, err);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      console.log('error:', error);
      dispatch(updateCheckEdit(false));
      dispatch(slice.actions.hasError(error));
      openNotificationWithIcon(500, error);
    }
  };
}

//PIPELINE
export function createPipelineLocal(data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      openNotificationWithIcon(200, 'Create success');
      dispatch(slice.actions.createPipelineLocal(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createPipeline(id, data, diCreatePipline, con) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._createPipeline(id, data)
        .then(res => {
          openNotificationWithIcon(res.status, 'Success');

          let index = '';
          index = diCreatePipline.findIndex(item => item.id == con.id);
          let dataEnd = [...diCreatePipline];
          dataEnd.splice(index, 1);
          dispatch(addOperatorPipelineLocal(dataEnd));

          setTimeout(() => {
            dispatch(updatePipelineLocal(''));
            dispatch(getOperatorDetalLocal(''));
            dispatch(updateType(''));
          }, 300);
          dispatch(slice.actions.createPipelineSuccess());
          dispatch(getListPipelines(id));
        })
        .catch(err => {
          console.log('err', err);
          openNotificationWithIcon(500, err);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListPipelines(id) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService._getListPipelines(id);
      if (response.status === 200 && !isEmpty(response.data)) {
        // setTimeout(() => {
        //   if (response.data.value.some(item => item?.status == 'Unavailable'))
        //     dispatch(getListPipelines(id));
        // }, 1500);
        dispatch(slice.actions.getPipelinesSuccess(response.data.value));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      if (error.message) {
        error = error.message;
      }
      openNotificationWithIcon(500, 'Pipeline: ' + error);
    }
  };
}

//Update pipeline
export function updatePipelineInforMirror(data, diCreatePipline) {
  return async dispatch => {
    console.log('diCreatePipline:', diCreatePipline);
    console.log('data', data);
    if (data?.typeLocal == 'new') {
      let index = '';
      index = diCreatePipline.findIndex(item => item.id == data.id);
      let dataEnd = [...diCreatePipline];
      dataEnd.splice(index, 1, data);
      dispatch(slice.actions.updateDataMirrorPipelineLocal({ dataEnd, data }));
    } else {
    }
  };
}

export function updatePipelineLocal(data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.detailPipelineLocal(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getDetailPipeline(projectId, pipelineId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._getDetailPipeline(projectId, pipelineId)
        .then(res => {
          dispatch(slice.actions.getDetailPipelineSuccess(res.data));
        })
        .catch(err => {
          console.log('err', err);
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addOperatorPipelineLocal(data, key) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      if (key == 'deletePipelineLocal')
        openNotificationWithIcon(200, 'Delete success');
      dispatch(slice.actions.addOperatorPipelineLocal(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deletePipeline(projectId, pipelineId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._deletePipeline(projectId, pipelineId)
        .then(res => {
          openNotificationWithIcon(res.status, 'Delete success');
          dispatch(slice.actions.deletePipelineSuccess());
          dispatch(getListPipelines(projectId));
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          openNotificationWithIcon(500, err);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

//UPDATE HISTORY UPLOAD
export function updateHitoryUpload(projectId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      await projectService
        ._updateLog(projectId)
        .then(res => {
          dispatch(slice.actions.updateStateListLog(res?.data));
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          openNotificationWithIcon(500, err);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

//DELETE UPLOAD
export function deleteHitoryUpload(projectId, datasetId, data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      await projectService
        ._deleteLog(projectId, datasetId, data)
        .then(res => {
          openNotificationWithIcon(200, res.data);
          dispatch(updateHitoryUpload(projectId));
          // dispatch(slice.actions.updateStateListLog(res?.data));
        })
        .catch(err => {
          openNotificationWithIcon(500, err.message);
          openNotificationWithIcon(500, err);
          dispatch(slice.actions.hasError(error));
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getOperatorDetalLocal(data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.getOperatorDetalLocal(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function resetOperatorDetalLocal() {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.resetOperatorDetalLocal());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

//RUN PIPELINE
export function changeStatusPipeline(projectId, pipelineId, data) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._changeStatusPipeline(projectId, pipelineId, data)
        .then(res => {
          console.log('res:', res);
          openNotificationWithIcon(res.status, 'Success');
          dispatch(slice.actions.runPipelineSuccess());
          dispatch(getListPipelines(projectId));
        })
        .catch(err => {
          openNotificationWithIcon(500, err);
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function triggerRunPipeline(projectId, pipelineId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._triggerRunPipeline(projectId, pipelineId)
        .then(res => {
          openNotificationWithIcon(res.status, res.statusText);
          dispatch(slice.actions.runPipelineSuccess());
          dispatch(getListPipelines(projectId));
        })
        .catch(err => {
          openNotificationWithIcon(500, err);
        });
    } catch (error) {
      openNotificationWithIcon(500, error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListLogMonitor(projectId, pipelineId) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await projectService
        ._getListLogPipeline(projectId, pipelineId)
        .then(res => {
          if (res.status === 200 && !isEmpty(res.data)) {
            dispatch(slice.actions.getListLogPipelineSuccess(res.data.value));
          }
        })
        .catch(err => {
          console.log('err', err);
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
