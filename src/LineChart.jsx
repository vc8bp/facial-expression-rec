import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { ratingToData, statusData } from './data';




const LineChart = ({ finalData }) => {
  const [data, setData] = useState({ labels: [], expressionData: [], });


  useEffect(() => {
    const labels = [];
    const expressionData = [];

    finalData.forEach((newData) => {
        labels.push(newData.time)
        expressionData.push(statusData[newData.expression].rating)
    });

    setData({labels,expressionData})
  }, [finalData]);


  const option = {
    xAxis: {
      type: 'category',
      data: data.labels,
    },
    yAxis: [
      {
        type: 'value',
        name: 'Expression',
        scale: true,
      },
      {
        type: 'value',
        name: 'Probability',
        scale: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        console.log({params})
        return ratingToData[params[0].value].emotion;
      }
    },
    series: [
      {
        name: 'Expression',
        type: 'bar',
        smooth: true,
        showSymbol: false,
        data: data.expressionData.map((value) => ({
          value,
          itemStyle: {
            color: ratingToData[value].color,
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
            }
          },
        })),
        label: {
          show: true,
          position: 'inside',
          formatter: d => ratingToData[d.value].emoji
        },
        yAxisIndex: 0,
        
      },
    ],
    legend: {
      data: ['Expression', 'Probability'], 
    },
    dataZoom: [
      {
        type: 'inside', 
        xAxisIndex: [0],
      },
      {
        type: 'slider',
        xAxisIndex: [0], 
        start: 0, 
        end: 100, 
        maxValueSpan: 10, 
      },
    ],
  };

  return <ReactECharts  option={option} />;
};

export default LineChart;
