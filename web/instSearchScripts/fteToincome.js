function fetchFTEIncomeData(specificUniRecord) {
    fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/overall-and-income')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Process and display the data using Highcharts
        processAndDisplayData(data, specificUniRecord);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
}

function processAndDisplayData(data, specificUniRecord) {

      const specificUniName = specificUniRecord[0].UniversityName;
      const incomeMapping = data
        .filter(item => item.IncomeSource === 'Total income')
        .reduce((acc, item) => {
          acc[item.UniversityName] = parseFloat(item.TotalIncome13_20);
          return acc;
        }, {});

      const fteMapping = data
        .filter(item => item.ProfileType === 'Overall')
        .reduce((acc, item) => {
          acc[item.UniversityName] = parseFloat(item.FTEOfSubmittedStaff);
          return acc;
        }, {});
      const chartData = [];

        // Iterate over the incomeMapping
      Object.keys(incomeMapping).forEach(uniName => {
          // Check if the current university in incomeMapping also exists in fteMapping
        if (fteMapping.hasOwnProperty(uniName)) {
          const isSpecificUni = uniName === specificUniName;
          const markerOptions = isSpecificUni ? {
            fillColor: 'red', // Highlight color
            lineWidth: 2, // Border width
            radius: 8 // Marker radius
          } : {};

          // Create an object with the FTE and income data
          chartData.push({
            name: uniName,
            x: fteMapping[uniName], // FTE value from fteMapping
            y: incomeMapping[uniName], // Income value from incomeMapping
            marker: markerOptions // Specific marker options for the specific university
          });
        }
      });

  // If no data points match the specific university, log an error


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
              enabled: true
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
          pointFormat: 'University: <b>{point.name}</b><br>FTE: {point.x}, Total Income: £{point.y}'
        }
      }
    },
    series: [{
      type: 'scatter',
      name: 'FTE vs Total Income',
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
