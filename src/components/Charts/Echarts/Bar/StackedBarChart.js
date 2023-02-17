import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import ReactECharts from '../ReactECharts';
import { commonOptions } from '../config';

const EStackedBarChart = props => {
  const { chartOptions, ...rest } = props;
  const isEmptySeries = chartOptions.series.length === 0;

  const options = merge(
    {
      ...commonOptions(isEmptySeries),
      tooltip: {
        trigger: 'item',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
          z: 100
        }
      },
      legend: {
        data: chartOptions.legend
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: chartOptions.labels
      },
      series: chartOptions.series
    },
    chartOptions.optional
  );
  return <ReactECharts option={options} {...rest} />;
};

EStackedBarChart.propTypes = {
  loading: PropTypes.bool,
  chartOptions: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.array,
    legend: PropTypes.arrayOf(PropTypes.string),
    optional: PropTypes.object
  }).isRequired,
  style: PropTypes.object
};

export default EStackedBarChart;
