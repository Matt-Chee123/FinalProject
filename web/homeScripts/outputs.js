//fetch data and call function to display chart
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
  let sumFourStar = 0, sumThreeStar = 0, sumTwoStar = 0, sumOneStar = 0;

  // sums for each field
  data.forEach(item => {
    sumFourStar += item.FourStar;
    sumThreeStar += item.ThreeStar;
    sumTwoStar += item.TwoStar;
    sumOneStar += item.OneStar;
  });

  // calculate averages
  const avgFourStar = Number((sumFourStar / data.length).toFixed(1));
  const avgThreeStar = Number((sumThreeStar / data.length).toFixed(1));
  const avgTwoStar = Number((sumTwoStar / data.length).toFixed(1));
  const avgOneStar = Number((sumOneStar / data.length).toFixed(1));
  const maxAvgValue = Math.max(avgFourStar, avgThreeStar, avgTwoStar, avgOneStar);
  // round up to the nearest 10 for yAxisMax
  const yAxisMax = Math.ceil(maxAvgValue / 10) * 10;
//make the chart
  Highcharts.chart('outputs-records', {
    chart: {
      type: 'column',
      marginBottom: 40
    },
    title: {
      text: 'National Output Profile'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [
        '4*',
        '3*',
        '2*',
        '1*'
      ],
      labels: {
        enabled: true
      }
    },
    yAxis: {
      min: 0,
      max: yAxisMax,
      title: {
        text: '% of Outputs'
      },
      labels: {
        style: {
           fontSize: '10px'
        }
      },
      endOnTick: false,
      tickInterval: 10
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="padding:0">% of Outputs: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
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
      enabled: false
    },
    series: [{
      name: 'Average Star Rating',
      data: [
        { y: avgFourStar, name: '4*' },
        { y: avgThreeStar, name: '3*' },
        { y: avgTwoStar, name: '2*' },
        { y: avgOneStar, name: '1*' }
      ]
    }]
  });
}