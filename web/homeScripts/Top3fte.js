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
  let yAxisMax = Math.ceil(maxFTE / 20) * 20; // Round up to the nearest 10

  // Adjust yAxisMax if needed to ensure it's more than the max y value and adjust for a maximum of 5 ticks
  const ticks = 5; // Maximum number of ticks
  let tickInterval = Math.ceil((yAxisMax / ticks) / 20) * 20; // Calculate tick interval, rounding up to the nearest 10
  console.log('tickInterval:', tickInterval);
  // Ensure there are always a maximum of 5 ticks and adjust yAxisMax if necessary
  if (yAxisMax / tickInterval < ticks - 1) {
    yAxisMax = tickInterval * (ticks - 1);
  }

  // Generate tick positions based on the calculated interval and yAxisMax
  const tickPositions = [];
  for (let i = 0; i <= yAxisMax; i += tickInterval) {
    tickPositions.push(i);
  }
  if (tickPositions[tickPositions.length - 1] < yAxisMax) { // Ensure the last tick is more than maxFTE
    tickPositions.push(tickPositions[tickPositions.length - 1] + tickInterval);
  }

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
