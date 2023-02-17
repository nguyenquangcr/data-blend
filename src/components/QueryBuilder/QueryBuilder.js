import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
import { Grid } from '@mui/material';
import throttle from 'lodash/throttle';
import {
  Query,
  Builder,
  Utils as QbUtils
} from 'react-awesome-query-builder-pd';
import defaultQbConfig from './defaultConfig';

const INITIAL_CONFIG = defaultQbConfig('material');
const DEFAULT_TREE_VALUE = {
  id: QbUtils.uuid(),
  type: 'group'
};

// ----------------------------------------------------------------------

const useStyles = makeStyles(theme => ({
  root: {},
  customQueryBuilder: {
    margin: 0,
    '& input': {
      boxSizing: 'content-box'
    },

    '& .group--actions': {
      opacity: '1 !important'
    },

    '& .group': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      border: `1px solid ${theme.palette.primary.lighter}`,
      borderRadius: theme.spacing(0.75),
      padding: theme.spacing(0.5)
    }
  },
  content: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

const QueryBuilder = props => {
  const { className, queryBuilderConfig, onQueryChange } = props;
  const classes = useStyles();

  // You can load query value from your backend storage (for saving see `Query.onChange()`)
  const [queryBuilder, setQueryBuilder] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(DEFAULT_TREE_VALUE), {
      ...INITIAL_CONFIG,
      fields: {}
    }),
    config: { ...INITIAL_CONFIG, fields: {} }
  });
  const handleGetQueryBuilderConfig = useCallback(() => {
    if (queryBuilderConfig) {
      setQueryBuilder(queryBuilderConfig);
    }
  }, [queryBuilderConfig]);

  useEffect(() => {
    handleGetQueryBuilderConfig();
  }, [handleGetQueryBuilderConfig]);

  const renderBuilder = props => (
    <div className="query-builder-container">
      <div
        className={clsx('query-builder qb-lite', classes.customQueryBuilder)}
      >
        <Builder {...props} />
      </div>
    </div>
  );

  /** TIP: Apply `throttle`  for better performance
   * `jsonTree` can be saved to backend, and later loaded to `DEFAULT_TREE_VALUE`
   * const jsonTree = QbUtils.getTree(immutableTree);
   * console.log(jsonTree);
   */
  const handleQueryBuilderChangeThrottle = throttle(
    (immutableTree, config) => {
      /** You can get query string here
       */
      setQueryBuilder({
        tree: immutableTree,
        config: config
      });
      onQueryChange({
        sqlQuery: QbUtils.sqlFormat(immutableTree, config),
        jsonTree: QbUtils.getTree(immutableTree),
        jsonLogic: QbUtils.jsonLogicFormat(immutableTree, config)
      });
    },
    100,
    { leading: false }
  ); // this says, do not run the function immediately

  const handleQueryBuilderChange = (immutableTree, config) => {
    handleQueryBuilderChangeThrottle(immutableTree, config);
  };

  if (!queryBuilder) {
    return <div>Loading</div>;
  }

  return (
    <Grid item xs={12}>
      <Query
        {...queryBuilder.config}
        value={queryBuilder.tree}
        onChange={handleQueryBuilderChange}
        renderBuilder={renderBuilder}
      />
    </Grid>
  );
};

QueryBuilder.propTypes = {
  className: PropTypes.string,
  queryBuilderConfig: PropTypes.object,
  onQueryChange: PropTypes.func.isRequired
};

export default QueryBuilder;
