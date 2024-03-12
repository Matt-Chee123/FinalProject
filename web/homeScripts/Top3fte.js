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
  // Assuming the data is an array of objects with UniversityName and FTEOfSubmittedStaff
  const chartData = data.map(item => {
    return {
      fullName: item.UniversityName, // Full name for tooltip
      name: item.UniversityName.replace(/^University of /, ''), // Modify name for category display
      y: parseFloat(item.FTEOfSubmittedStaff.toFixed(1)),
      percEligible: parseFloat(item.PercEligibleStaff)
    };
  });

  const maxFTE = Math.max(...chartData.map(item => item.y));
  let yAxisMax = Math.ceil(maxFTE / 10) * 10; // Round up to the nearest 10 for yAxisMax

  // Desired number of ticks
  const ticks = 4;

  // Calculate tick interval to distribute ticks evenly across the yAxis
  let tickInterval = yAxisMax / ticks;

  // If tick interval is not a multiple of 10, round up to the nearest 10
  tickInterval = Math.ceil(tickInterval / 10) * 10;

  // Generate tick positions based on the calculated interval
  const tickPositions = [];
  for (let i = 0; i <= yAxisMax; i += tickInterval) {
    tickPositions.push(i);
  }

  // If the last tick position is not equal to yAxisMax, adjust the last tick to yAxisMax



  Highcharts.chart('top-FTE-records', {
    chart: {
      type: 'bullet',
      inverted: true

    },
    title: {
      text: 'Top 3 Uni FTE'
    },
    credits: {
        enabled: false
    },
    xAxis: {
      categories: chartData.map(item => item.name)
    },
    yAxis: {
      gridLineWidth: 0,
      title: null,
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
        const point = this.point; // Get the current point
        const fullName = point.fullName; // Access the full university name stored in point
    // Construct the tooltip content
        return `${fullName}<br/>FTE of Submitted Staff: <b>${point.y}</b><br/>% Eligible: <b>${point.percEligible}%</b>`;
      }
    }
  });
}
