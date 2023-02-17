import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import { PATH_DATA_INTEGRATION } from '~/routes/paths';
import DocsLayout from '~/layouts/DataIntegrationLayout';

const DataIntegrationRoutes = {
  path: PATH_DATA_INTEGRATION.root,
  layout: DocsLayout,
  routes: [
    {
      exact: true,
      path: PATH_DATA_INTEGRATION.log,
      component: lazy(() => import('src/views/data-integration/monitor-log'))
    },
    {
      exact: true,
      path: PATH_DATA_INTEGRATION.monitor,
      component: lazy(() =>
        import('src/views/data-integration/monitor-datablend')
      )
    },
    {
      exact: true,
      path: PATH_DATA_INTEGRATION.detail,
      component: lazy(() => import('src/views/data-integration/upload-page'))
    },
    {
      exact: true,
      path: PATH_DATA_INTEGRATION.orchestrate,
      component: lazy(() =>
        import('src/views/data-integration/detail-datablend')
      )
    },
    {
      exact: true,
      path: PATH_DATA_INTEGRATION.uploadfile,
      component: lazy(() =>
        import('src/views/data-integration/upload-page/UploadFile')
      )
    },
    {
      exact: true,
      path: PATH_DATA_INTEGRATION.list,
      component: lazy(() => import('src/views/data-integration/list-datablend'))
    }
  ]
};

export default DataIntegrationRoutes;
