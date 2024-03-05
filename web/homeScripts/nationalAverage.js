function fetchAndDisplayNationalAverages(uofaName = 'Computer Science and Informatics') {
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/?uofaName=${encodeURIComponent(uofaName)}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    displayNationalAverageScore(data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

function calculateNationalAverageScore(data, profileType) {
  let sumScore = 0;
  let count = 0;

  // Accumulate sum of scores for the specified profile type
  data.forEach(item => {
    if (item.ProfileType === profileType) {
      sumScore += item.AverageScore;
      count++;
    }
  });

  // Calculate average score
  return (count > 0) ? (sumScore / count) : 0;
}

function displayNationalAverageScore(data) {
  const averageOverallScore = Number(calculateNationalAverageScore(data, 'Overall'));
  const averageOutputsScore = Number(calculateNationalAverageScore(data, 'Outputs'));
  const averageImpactScore = Number(calculateNationalAverageScore(data, 'Impact'));
  const averageEnvironmentScore = Number(calculateNationalAverageScore(data, 'Environment'));

  Highcharts.chart('bullet-graph-container', {
    chart: {
      type: 'bullet',
      inverted: true
    },
    title: {
      text: 'National Average GPA'
    },
    credits: {
        enabled: false
    },
    xAxis: {
      categories: [
        '<span class="hc-cat-title">Overall</span>',
        '<span class="hc-cat-title">Outputs</span>',
        '<span class="hc-cat-title">Impact</span>',
        '<span class="hc-cat-title">Environment</span>'
      ]
    },
    yAxis: {
      gridLineWidth: 0,
      title: null,
      max: 4, // Set the maximum scale value for the yAxis
      tickPositions: [0, 1, 2, 3, 4] // Define specific tick positions
    },
    legend: {
      enabled: false // This will remove the legend
    },
    series: [{
      data: [
        {
          y: averageOverallScore,
          target: 4 // Your target value for Overall Score
        },
        {
          y: averageOutputsScore,
          target: 4 // Your target value for Outputs Score
        },
        {
          y: averageImpactScore,
          target: 4 // Your target value for Impact Score
        },
        {
          y: averageEnvironmentScore,
          target: 4 // Your target value for Environment Score
        }
      ]
    }],
    tooltip: {
      pointFormat: '<b>{point.y:.2f}</b> (with target at {point.target})'
    }
  });
}