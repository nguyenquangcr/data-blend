import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import ReactECharts from '../ReactECharts';

const EBarLabelRotation = props => {
  const { chartOptions, loading, style } = props;
  const options = merge(
    {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: chartOptions.legend
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: chartOptions.labels
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: chartOptions.series
    },
    chartOptions.optional
  );
  return <ReactECharts option={options} style={style} />;
};

EBarLabelRotation.propTypes = {
  loading: PropTypes.bool,
  chartOptions: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.array,
    legend: PropTypes.arrayOf(PropTypes.string),
    optional: PropTypes.object
  }).isRequired,
  style: PropTypes.object
};

export default EBarLabelRotation;
