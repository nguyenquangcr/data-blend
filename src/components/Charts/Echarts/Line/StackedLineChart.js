import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';

import ReactECharts from '../ReactECharts';
import { commonOptions } from '../config';

const EStackedLineChart = props => {
  const { chartOptions, ...rest } = props;
  const isEmptySeries = chartOptions.series.length === 0;

  const options = merge(
    {
      ...commonOptions(isEmptySeries),
      tooltip: {
        trigger: 'axis'
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      toolbox: {
        show: !isEmptySeries,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        data: chartOptions.legend,
        type: 'scroll',
        top: 20
      },
      // grid: {
      //   left: '3%',
      //   right: '4%',
      //   bottom: '3%',
      //   containLabel: true
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartOptions.labels
      },
      yAxis: {
        type: 'value'
      },
      series: chartOptions.series
    },
    chartOptions.optional
  );
  return <ReactECharts option={options} {...rest} />;
};

EStackedLineChart.propTypes = {
  loading: PropTypes.bool,
  chartOptions: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.array,
    legend: PropTypes.arrayOf(PropTypes.string),
    optional: PropTypes.object
  }).isRequired,
  style: PropTypes.object
};

export default EStackedLineChart;
