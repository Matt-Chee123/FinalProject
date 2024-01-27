// Fetch and process the CSV data
fetch('../../server/data/sorted_data.csv')
  .then(response => response.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        const records = results.data;
        calculateStatistics(records);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching CSV file:', error);
  });

function calculateStatistics(records) {
  let totalScore = 0;
  let minScore = Infinity;
  let maxScore = -Infinity;
  let scores = [];

  for (const record of records) {
    if(record.Score !== undefined && record.Score !== null) {
      totalScore += record.Score;
      minScore = Math.min(minScore, record.Score);
      maxScore = Math.max(maxScore, record.Score);
      scores.push(record.Score);
    }
  }

  const averageScore = totalScore / scores.length;
  const range = maxScore - minScore;
  const stdDev = calculateStandardDeviation(scores, averageScore);

  // Display the results
 document.getElementById('average-score').innerHTML = `<strong>Average:</strong> ${averageScore.toFixed(2)}`;
 document.getElementById('range-score').innerHTML = `<strong>Range:</strong> ${range.toFixed(2)}`;
 document.getElementById('std-deviation').innerHTML = `<strong>Standard Deviation:</strong> ${stdDev.toFixed(2)}`;
}

// Function to calculate standard deviation
function calculateStandardDeviation(values, mean) {
  const squareDiffs = values.map(value => {
    const diff = value - mean;
    return diff * diff;
  });

  const avgSquareDiff = squareDiffs.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}
