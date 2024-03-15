function fetchFTEIncomeData(specificUniRecord, unitOfAssessmentName) {
    const overallUrl = `https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/overall?uOfA=${encodeURIComponent(unitOfAssessmentName)}`;
    const incomeUrl = `https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/total-income?unitOfAssessment=${encodeURIComponent(unitOfAssessmentName)}`;

    Promise.all([
        fetch(overallUrl).then(response => response.json()), // fetch overall data
        fetch(incomeUrl).then(response => response.json()) // fetch income data
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
      let chartData = [];
      console.log('incomeMapping', incomeMapping);
        console.log('fteMapping', fteMapping);
        console.log('specificUniName', specificUniName);
      Object.keys(incomeMapping).forEach(uniName => {
          // check current uni in income exists in fte
        if (fteMapping.hasOwnProperty(uniName)) {
            const isSpecificUni = uniName === specificUniName;

            const zIndexValue = isSpecificUni ? 5 : 1;

            //define marker options
            const markerOptions = {
                radius: 2,
                zIndex: zIndexValue
            };

            if (isSpecificUni) {
                  // apply marker for specific uni
                markerOptions.fillColor = 'red';
                markerOptions.lineWidth = 2;
                markerOptions.radius = 5;
            }

              // format income
            const formattedIncome = incomeMapping[uniName].toLocaleString();

              // create chart data
            chartData.push({
                name: uniName,
                x: fteMapping[uniName],
                y: incomeMapping[uniName],
                formattedIncome: formattedIncome,
                marker: markerOptions
            });
        }
      });
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
            labels: {
              style: {
                fontSize: '10px'
              }
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
          },
          yAxis: {
            title: {
              text: 'Total Income (£)',
            },
            labels: {
              style: {
                fontSize: '10px'
              }
            },
            min: 0,
            tickAmount: 4
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            scatter: {
              marker: {
                radius: 4,
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
                  headerFormat: null,
                  pointFormat: 'University: <b>{point.name}</b><br>FTE: {point.x:.1f}, Total Income: £{point.formattedIncome}'
              }
            }
          },
          series: [{
            type: 'scatter',
            name: null,
            data: chartData,
            marker: {
              radius: 2
            },
            states: {
              hover: {
                lineWidthPlus: 0
              }
            },
            enableMouseTracking: true
          }]
        });
}
