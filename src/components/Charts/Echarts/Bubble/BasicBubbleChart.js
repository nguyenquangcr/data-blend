import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import ReactECharts from '../ReactECharts';
import { commonOptions } from '../config';

const EBasicBubbleChart = props => {
  const { chartOptions, ...rest } = props;
  const isEmptySeries = chartOptions.series.length === 0;

  const options = merge(
    {
      ...commonOptions(isEmptySeries),
      legend: {
        data: chartOptions.legend,
        left: 'right'
      },
      tooltip: {
        position: 'top'
        // formatter: function(params) {
        //   return (
        //     params.value[2] +
        //     ' canceled in ' +
        //     hours[params.value[0]] +
        //     ' of ' +
        //     days[params.value[1]]
        //   );
        // }
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
      xAxis: {
        type: 'category',
        data: chartOptions.labels,
        boundaryGap: false,
        splitLine: {
          show: true
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        }
      },
      series: chartOptions.series
    },
    chartOptions.optional
  );
  return <ReactECharts option={options} {...rest} />;
};

EBasicBubbleChart.propTypes = {
  loading: PropTypes.bool,
  chartOptions: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.array,
    legend: PropTypes.arrayOf(PropTypes.string),
    optional: PropTypes.object
  }).isRequired,
  style: PropTypes.object
};

export default EBasicBubbleChart;
