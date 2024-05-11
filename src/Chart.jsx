import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const expressionRatings = {
  default: 4,
  neutral: 4,
  happy: 7,
  sad: 2,
  angry: 8,
  fearful: 5,
  disgusted: 1,
  surprised: 6,
};

const LineChart = ({ finalData }) => {
  const [data, setData] = useState({
    labels: [],
    expressionData: [],
    probabilityData: [],
  });

  useEffect(() => {
    const labels = [];
    const expressionData = [];
    const probabilityData = [];

    finalData.forEach((newData) => {
        labels.push(newData.expression)
        expressionData.push(expressionRatings[newData.expression])
        probabilityData.push(newData.probability)
    });

    setData({labels,expressionData,probabilityData})

  }, [finalData]);

  console.log(data)

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
    series: [
      {
        name: 'Expression',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data.expressionData,
        yAxisIndex: 0,
      },
      {
        name: 'Probability',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data.probabilityData,
        yAxisIndex: 1,
      },
    ],
    legend: {
      data: ['Expression', 'Probability'], 
    },
  };

  return <ReactECharts style={{width: "1000px", height: "500px"}} option={option} />;
};

export default LineChart;
