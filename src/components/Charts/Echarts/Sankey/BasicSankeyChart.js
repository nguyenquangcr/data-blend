import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import ReactECharts from '../ReactECharts';
import { commonOptions } from '../config';

const EBasicSankeyChart = props => {
  const { chartOptions, ...rest } = props;
  const isEmptySeries = chartOptions.data.length === 0;
  const options = merge(
    {
      ...commonOptions(isEmptySeries),
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: {
        type: 'sankey',
        data: chartOptions.data,
        links: chartOptions.links,
        emphasis: {
          focus: 'adjacency'
        },
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: '#fbb4ae'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          },
          {
            depth: 1,
            itemStyle: {
              color: '#b3cde3'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          },
          {
            depth: 2,
            itemStyle: {
              color: '#ccebc5'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          },
          {
            depth: 3,
            itemStyle: {
              color: '#decbe4'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          }
        ],
        lineStyle: {
          curveness: 0.5
        }
      }
    },
    chartOptions.optional
  );
  return <ReactECharts option={options} {...rest} />;
};

EBasicSankeyChart.propTypes = {
  loading: PropTypes.bool,
  chartOptions: PropTypes.shape({
    links: PropTypes.array,
    data: PropTypes.array,
    optional: PropTypes.object
  }).isRequired,
  style: PropTypes.object
};

export default EBasicSankeyChart;
