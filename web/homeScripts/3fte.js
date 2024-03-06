function fetchThreeFte(uofaName = 'Computer Science and Informatics') {
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/random3?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayThreeFte(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}


function displayThreeFte(data) {
  // Assuming the data is an array of objects with UniversityName and FTEOfSubmittedStaff
  const chartData = data.map(item => {
    return {
      name: item.UniversityName,
      y: parseFloat(item.FTEOfSubmittedStaff.toFixed(1)), // Ensures y has one digit after the decimal
      percEligible: parseFloat(item.PercEligibleStaff) // Assuming 'PercEligibleStaff' is a string that needs to be converted to a float
    };
  });
  const maxFTE = Math.max(...chartData.map(item => item.y));
  const minFTE = Math.min(...chartData.map(item => item.y));

// Calculate the range of FTE values
  const range = maxFTE - minFTE;

// Calculate the tick interval rounded to the nearest 10
  const tickInterval = Math.ceil(range / 50) * 10;
  // Create the Highcharts radial chart
  Highcharts.chart('random-FTE-records', {
      chart: {
          type: 'column',
          inverted: true,
          polar: true
      },
      credits: {
          enabled: false
      },
      title: {
          text: 'FTE of Submitted Staff'
      },
      tooltip: {
          formatter: function () {
            return `<b>${this.point.name}</b><br>FTE of Submitted Staff: ${this.y.toFixed(1)}<br>Percentage of Eligible Staff: ${this.point.percEligible.toFixed(0)}%`;
          }
      },
      pane: {
          size: '85%',
          innerSize: '20%',
          endAngle: 300
      },
      xAxis: {
          tickInterval: 1,
          labels: {
              enabled: false // Disable labels for each 'line' or category
          },
          lineWidth: 0,
          gridLineWidth: 0,
      },
      yAxis: {
          lineWidth: 0,
          tickInterval: tickInterval,
          reversedStacks: false,
          endOnTick: true,
          showLastLabel: true,
          gridLineWidth: 0
      },
      legend: {
        enabled: false
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              borderWidth: 0,
              pointPadding: 0,
              groupPadding: 0.15,
              borderRadius: '50%'
          }
      },
      series: [{
          data: chartData.map(item => {
              return {
                  name: item.name,
                  y: item.y,
                  percEligible: item.percEligible
              };
          })
      }]
  });
}



