import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import ReactECharts from '../ReactECharts';

const EBarChart = props => {
  const { chartOptions, loading, style } = props;
  const options = merge(
    {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: chartOptions.series
    },
    chartOptions.optional
  );
  return <ReactECharts option={options} style={style} />;
};

EBarChart.propTypes = {
  loading: PropTypes.bool,
  chartOptions: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.array,
    legend: PropTypes.arrayOf(PropTypes.string),
    optional: PropTypes.object
  }).isRequired,
  style: PropTypes.object
};

export default EBarChart;
