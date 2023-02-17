import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import ReactECharts from '../ReactECharts';
import { commonOptions } from '../config';

const EBasicPieChart = props => {
  const { chartOptions, ...rest } = props;
  const isEmptySeries = chartOptions.series.length === 0;

  const options = merge(
    {
      ...commonOptions(isEmptySeries),
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        left: 'top',
        type: 'scroll',
        top: 20,
        data: chartOptions.legend
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: chartOptions.series,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    },
    chartOptions.optional
  );
  return <ReactECharts option={options} {...rest} />;
};

EBasicPieChart.propTypes = {
  loading: PropTypes.bool,
  chartOptions: PropTypes.shape({
    legend: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.array,
    optional: PropTypes.object
  }).isRequired,
  style: PropTypes.object
};

export default EBasicPieChart;
