import React, { useEffect, useState } from 'react';
import './analiticsStyle.css';
import { statusData } from './data';

const AnalyticsUI = ({ facialExpressionData }) => {
  // State to store analytics data
  const [analyticsData, setAnalyticsData] = useState(null);

  // Function to calculate analytics data
  const calculateAnalyticsData = () => {
    const expressionCounts = {};
    let totalProbability = 0;

    // Count occurrences of each expression and calculate total probability
    facialExpressionData.forEach(({ expression, probability }) => {
      expressionCounts[expression] = expressionCounts[expression] ? expressionCounts[expression] + 1 : 1;
      totalProbability += probability;
    });

    // Calculate average probability
    const averageProbability = totalProbability / facialExpressionData.length;

    // Find the most frequent expression
    let mostFrequentExpression = null;
    let maxCount = 0;
    Object.keys(expressionCounts).forEach(expression => {
      if (expressionCounts[expression] > maxCount) {
        mostFrequentExpression = expression;
        maxCount = expressionCounts[expression];
      }
    });

    // Set analytics data
    setAnalyticsData({
      totalDataPoints: facialExpressionData.length,
      expressionCounts,
      averageProbability,
      mostFrequentExpression,
    });
  };

  // Use effect to calculate analytics data on component mount
  useEffect(() => {
    calculateAnalyticsData();
  }, [facialExpressionData]);

  if (!analyticsData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="a-ui">
      <div className="a-card total-data-points">
        <div className="a-value">{analyticsData.totalDataPoints}</div>
        <div className="a-title">Total Data Points</div>
      </div>
      <div className="a-card average-probability">
        <div className="a-value">{(analyticsData.averageProbability * 100).toFixed(2)}%</div>
        <div className="a-title">Average Probability</div>
      </div>
      <div className="a-card most-frequent-expression" style={{ backgroundColor: statusData[analyticsData.mostFrequentExpression]?.color }}>
        <div className="emoji">{statusData[analyticsData.mostFrequentExpression]?.emoji}</div>
        <div className="a-value">{analyticsData.mostFrequentExpression}</div>
        <div className="a-title">Most Frequent Expression</div>
      </div>
      <div className="a-card expression-counts">
        <div className="a-title">Expression Counts</div>
        <div className="counts">
          {Object.keys(analyticsData.expressionCounts).map(expression => (
            <div key={expression} className="expression-count">
              <span className="emoji">{statusData[expression]?.emoji}</span>
              <span className="count">{analyticsData.expressionCounts[expression]}</span> 
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsUI;
