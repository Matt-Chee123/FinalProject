//function to fetch the top 3 universities with the highest FTE of submitted staff
function fetchTopThreeFte(uofaName = 'Computer Science and Informatics') {
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/top3?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayTopThreeFte(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}


function displayTopThreeFte(data) {
  // create chart data
  const chartData = data.map(item => {
    return {
      fullName: item.UniversityName,
      name: item.UniversityName.replace(/^University of /, ''),
      y: parseFloat(item.FTEOfSubmittedStaff.toFixed(1)),
      percEligible: parseFloat(item.PercEligibleStaff)
    };
  });

  const maxFTE = Math.max(...chartData.map(item => item.y));
  let yAxisMax = Math.ceil(maxFTE / 10) * 10; // axis max rounded up to nearest 10

  // specify 4 ticks
  const ticks = 4;

  // distribute ticks evenly
  let tickInterval = yAxisMax / ticks;

  // if tick interval not multiple of 10, round up to the nearest 10
  tickInterval = Math.ceil(tickInterval / 10) * 10;

  //calculate tick positionso that the ticks are evenly distributed
  const tickPositions = [];
  for (let i = 0; i <= yAxisMax; i += tickInterval) {
    tickPositions.push(i);
  }

  Highcharts.chart('top-FTE-records', {
    chart: {
      type: 'bullet',
      inverted: true

    },
    title: {
      text: 'FTE of the Top 3 Unis'
    },
    credits: {
        enabled: false
    },
    xAxis: {
      categories: chartData.map(item => item.name)
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        text: 'FTE'
      },
      labels: {
          style: {
          fontSize: '10px'
          }
      },
      max: yAxisMax,
      tickPositions: tickPositions
    },
    legend: {
      enabled: false
    },
    series: [{
      data: chartData
    }],
    tooltip: {
      useHTML: true,
      formatter: function() {
        const point = this.point;
        const fullName = point.fullName;
        return `${fullName}<br/>FTE of Submitted Staff: <b>${point.y}</b><br/>% Eligible: <b>${point.percEligible}%</b>`;
      }
    }
  });
}
