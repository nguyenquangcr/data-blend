import React, { useRef, useEffect } from 'react';
import { init, getInstanceByDom } from 'echarts';
import PropTypes from 'prop-types';
import { defaultStyle } from './config';
function ReactECharts({ option, loading = false, style }) {
  const chartRef = useRef();

  useEffect(() => {
    // Initialize chart
    let chart;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener('resize', resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (loading) {
        chart.showLoading();
      } else {
        chart.hideLoading();
      }
    }
  }, [loading]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart.setOption(option);
    }
  });

  return <div ref={chartRef} style={Object.assign(defaultStyle, style)} />;
}

ReactECharts.propTypes = {
  style: PropTypes.object,
  option: PropTypes.object.isRequired
};

export default ReactECharts;
