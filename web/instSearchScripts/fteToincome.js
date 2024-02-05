// Fetch the combined data for 'Overall' and 'Total income'
fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/overall-and-income')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process and display the data using Highcharts
    processAndDisplayData(data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

function processAndDisplayData(data) {
  // Filter the data based on 'IncomeSource' and 'ProfileType'
  const totalIncomeData = data.filter(item => item.IncomeSource === 'Total income').map(item => parseFloat(item.TotalIncome13_20));
  const fteData = data.filter(item => item.ProfileType === 'Overall').map(item => parseFloat(item.FTEOfSubmittedStaff));

  // Check that we have the same number of 'Total income' and 'FTE' records
  if (totalIncomeData.length !== fteData.length) {
    console.error('Mismatch in the number of Total Income and FTE records');
    return;
  }

  // Combine the data into a format suitable for Highcharts
  const chartData = fteData.map((fte, index) => {
    return [fte, totalIncomeData[index]];
  });

  // Display the data using Highcharts
  Highcharts.chart('fte-income-container', {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      spacingBottom: 0
    },
    title: {
      text: 'FTE vs Total Income 2013-2020'
    },

    credits: {
        enabled: false
        },
    xAxis: {
      title: {
        enabled: true,
        text: 'FTE'
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true
    },
    yAxis: {
      title: {
        text: 'Total Income'
      },
      min: 0,
      tickInterval: 50000000,
      labels: {
        formatter: function () {
          return '£' + Highcharts.numberFormat(this.value, 0);
        }
      }
    },
    legend: {
      enabled: false,
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
      borderWidth: 1
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)'
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.x} FTE, {point.y} Total Income'
        }
      }
    },
    series: [{
      type: 'line',
      name: 'Best Fit Line',
      data: chartData,
      marker: {
        enabled: false
      },
      states: {
        hover: {
          lineWidth: 0
        }
      },
      enableMouseTracking: false
    }, {
      type: 'scatter',
      name: 'Observations',
      data: chartData,
      marker: {
        radius: 4
      }
    }]
  });
}
