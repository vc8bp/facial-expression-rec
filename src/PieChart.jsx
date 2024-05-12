import  { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {  ratingToData, statusData } from './data';




const PieChart = ({ finalData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const finalDataa = {}

    finalData.forEach(({expression}) => {
        if (!finalDataa[expression]) {
            finalDataa[expression] = { rating: 0, color: statusData[expression].color };
        }
        finalDataa[expression].rating += 1;
      
    });

    setData(Object.keys(finalDataa).map(expression => ({value: finalDataa[expression].rating, name: expression, itemStyle: { color: finalDataa[expression].color }})))
  }, [finalData]);


  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };

  return <ReactECharts option={option} />;
};

export default PieChart;
