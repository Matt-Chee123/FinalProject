function fetchFTEIncomeData(specificUniRecord, unitOfAssessmentName) {
    const overallUrl = `https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/overall?unitOfAssessment=${encodeURIComponent(unitOfAssessmentName)}`;
    const incomeUrl = `https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/total-income?unitOfAssessment=${encodeURIComponent(unitOfAssessmentName)}`;

    // Fetch data concurrently from both endpoints
    Promise.all([
        fetch(overallUrl).then(response => response.json()), // Fetch overall data
        fetch(incomeUrl).then(response => response.json()) // Fetch income data
    ])
    .then(([overallData, incomeData]) => {
        const combinedData = [...overallData, ...incomeData];
        processAndDisplayData(combinedData, specificUniRecord);
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
          acc[item.UniversityName] = parseFloat(item.TotalIncome1320);
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

            // Format the income value with commas
              const formattedIncome = incomeMapping[uniName].toLocaleString();

            // Create an object with the FTE, formatted income, and original income data
              chartData.push({
                  name: uniName,
                  x: fteMapping[uniName], // FTE value from fteMapping
                  y: incomeMapping[uniName], // Original income value from incomeMapping
                  formattedIncome: formattedIncome, // Formatted income value with commas
                  marker: markerOptions // Specific marker options for the specific university
              });
          }
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
      tickInterval: 50000000
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
            pointFormat: 'University: <b>{point.name}</b><br>FTE: {point.x:.1f}, Total Income: £{point.formattedIncome}'
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
