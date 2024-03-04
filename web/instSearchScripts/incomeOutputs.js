function fetchOutputsandIncome(specificUniRecord, unitOfAssessment) {
    // Encode the UnitOfAssessment for URL parameters
    const encodedUofA = encodeURIComponent(unitOfAssessment);

    // Fetch Outputs
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/outputs?uofaName=${encodedUofA}`)
      .then(response => response.json())
      .then(outputsData => {
        // Fetch Income after successfully fetching Outputs
        fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/total-income?unitOfAssessment=${encodedUofA}`)
          .then(response => response.json())
          .then(incomeData => {
            // Now you have both outputsData and incomeData
            // You can process or combine these datasets as required
            const combinedData = [...outputsData, ...incomeData];
            processAndDisplayOutputsIncome(combinedData, specificUniRecord);
          })
          .catch(error => console.error('Fetch error with income:', error));
      })
      .catch(error => console.error('Fetch error with outputs:', error));
}


function processAndDisplayOutputsIncome(data, specificUniRecord) {
    // Assume specificUniRecord is an object with a UniversityName property
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

        // If this record is the specific university, customize the marker
        if (record.UniversityName === specificUniversityName) {
            markerOptions = {
                fillColor: 'red', // or any color that stands out
                radius: 4,
                zIndex: 90
            };
        }

        return {
            x: record.TotalIncome,
            y: record.AverageScore,
            name: record.UniversityName,
            marker: markerOptions
        };
    });

    // Now, we have the scatterData ready for plotting with Highcharts.
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
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Average Research Quality Score'
            },
            min: 1, // Set the minimum value of y-axis to 1
            max: 4, // Set the maximum value of y-axis to 4
            tickInterval: 1 // This ensures that ticks are placed at every integer interval
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
                    pointFormat: '<b>{point.name}</b><br>£{point.x:,.0f} income, {point.y} score'
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
