function fetchOutputsandIncome(specificUniRecord, unitOfAssessment) {

    const encodedUofA = encodeURIComponent(unitOfAssessment);

    // fetch Outputs
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/outputs?uofaName=${encodedUofA}`)
      .then(response => response.json())
      .then(outputsData => {
        // fetch income
        fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/total-income?unitOfAssessment=${encodedUofA}`)
          .then(response => response.json())
          //comvine data and process
          .then(incomeData => {
            const combinedData = [...outputsData, ...incomeData];
            processAndDisplayOutputsIncome(combinedData, specificUniRecord);
          })
          .catch(error => console.error('Fetch error with income:', error));
      })
      .catch(error => console.error('Fetch error with outputs:', error));
}


function processAndDisplayOutputsIncome(data, specificUniRecord) {
    const specificUniversityName = specificUniRecord[0].UniversityName;

    const outputsData = data.filter(item => item.ProfileType === 'Outputs');
    const incomeData = data.filter(item => item.IncomeSource === 'Total income');

    const joinedData = outputsData.map(output => {
        const incomeRecord = incomeData.find(income => income.UniversityName === output.UniversityName);
        return {
            UniversityName: output.UniversityName,
            AverageScore: output.AverageScore,
            TotalIncome: incomeRecord ? incomeRecord.TotalIncome1320 : null
        };
    }).filter(item => item.TotalIncome !== null);

    const scatterData = joinedData.map(record => {
        let markerOptions = {};

        // if record is the specific university, change marker color
        if (record.UniversityName === specificUniversityName) {
            markerOptions = {
                fillColor: 'red',
                radius: 4,
                zIndex: 90
            };
        }

        // Format TotalIncome with commas
        const formattedIncome = record.TotalIncome !== null ? record.TotalIncome.toLocaleString() : null;

        return {
            x: record.TotalIncome,
            y: record.AverageScore,
            formattedIncome: formattedIncome,
            name: record.UniversityName,
            marker: markerOptions
        };
    });


    Highcharts.chart('income-outputs', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Research Quality Score vs Total Income'
        },
        xAxis: {
            title: {
                text: 'Total Income (£)'
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
                text: 'Outputs GPA'
            },
            labels: {
                style: {
                    fontSize: '10px'
                }
            },
            min: 1,
            max: 4,
            tickInterval: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 2,
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
                    headerFormat: '<br>',
                    pointFormat: '<b>{point.name}</b><br>Income: £{point.formattedIncome}, Score: {point.y:.2f}'
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },

        series: [{
            data: scatterData
        }]
    });

}
