//fetch data and call function
function fetchAndDisplayNationalAverages(uofaName = 'Computer Science and Informatics') {
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/all?uofaName=${encodeURIComponent(uofaName)}`)
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

  // sum of scores for the given profile type
  data.forEach(item => {
    if (item.ProfileType === profileType) {
      sumScore += item.AverageScore;
      count++;
    }
  });

  // calculate average score
  return (count > 0) ? (sumScore / count) : 0;
}
//create a bullet graph to display the national average score
function displayNationalAverageScore(data) {
  const averageOverallScore = Number(calculateNationalAverageScore(data, 'Overall'));
  const averageOutputsScore = Number(calculateNationalAverageScore(data, 'Outputs'));
  const averageImpactScore = Number(calculateNationalAverageScore(data, 'Impact'));
  const averageEnvironmentScore = Number(calculateNationalAverageScore(data, 'Environment'));

  Highcharts.chart('bullet-graph-container', {
    chart: {
      type: 'bullet',
      marginBottom: 53,
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
      ],
      labels: {
        step: 1,
      }
    },
    yAxis: {
      gridLineWidth: 0,
      labels: {
        style: {
            fontSize: '10px'
        }
      },
      title: {
        text: 'GPA',
        fontSize: '10px'
      },
      max: 4,
      tickPositions: [0, 1, 2, 3, 4]
    },
    legend: {
      enabled: false
    },
    series: [{
      data: [
        {
          y: averageOverallScore,
          target: 4
        },
        {
          y: averageOutputsScore,
          target: 4
        },
        {
          y: averageImpactScore,
          target: 4
        },
        {
          y: averageEnvironmentScore,
          target: 4
        }
      ]
    }],
    tooltip: {
      pointFormat: 'GPA: <b>{point.y:.2f}</b>'
    }
  });
}