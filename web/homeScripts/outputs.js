function fetchOutputsData(uofaName = 'Computer Science and Informatics') {
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/outputs?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayOutputAverages(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}


function displayOutputAverages(data) {
  const OutputsContainer = document.getElementById('outputs-records');

  // Initialize sums
  let sumFourStar = 0, sumThreeStar = 0, sumTwoStar = 0, sumOneStar = 0;

  // Accumulate sums for each field
  data.forEach(item => {
    sumFourStar += item.FourStar;
    sumThreeStar += item.ThreeStar;
    sumTwoStar += item.TwoStar;
    sumOneStar += item.OneStar;
  });

  // Calculate averages
  const avgFourStar = Number((sumFourStar / data.length).toFixed(1));
  const avgThreeStar = Number((sumThreeStar / data.length).toFixed(1));
  const avgTwoStar = Number((sumTwoStar / data.length).toFixed(1));
  const avgOneStar = Number((sumOneStar / data.length).toFixed(1));
  const maxAvgValue = Math.max(avgFourStar, avgThreeStar, avgTwoStar, avgOneStar);
  // Round up to the nearest 10
  const yAxisMax = Math.ceil(maxAvgValue / 10) * 10;

  Highcharts.chart('outputs-records', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'National Output Profile'
    },
    credits: {
      enabled: false // Removes the Highcharts link from the chart
    },
    xAxis: {
      categories: [
        'World Leading',
        'Internationally Excellent',
        'Internationally Recognized',
        'Nationally Recognized'
      ],
      labels: {
        enabled: false // Disables the labels on the x-axis
      }
    },
    yAxis: {
      min: 0,
      max: yAxisMax, // Set the dynamically calculated max for the yAxis
      title: {
        text: 'Average Score'
      },
      endOnTick: false, // Ensures the axis doesn't extend beyond the max value
      tickInterval: 10 // Sets the interval of the tick marks to 10
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">Average Star Rating: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },

    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    legend: {
      enabled: false // Hides the legend
    },
    series: [{
      name: 'Average Star Rating',
      data: [
        { y: avgFourStar, name: 'World Leading' },
        { y: avgThreeStar, name: 'Internationally Excellent' },
        { y: avgTwoStar, name: 'Internationally Recognized' },
        { y: avgOneStar, name: 'Nationally Recognized' }
      ]
    }]
  });
}