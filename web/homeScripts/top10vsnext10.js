function fetch20(unitOfAssessment) {
    const encodedUofA = encodeURIComponent(unitOfAssessment);

    return fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/UoA?uofaName=${encodedUofA}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

// This function will be called after the data is fetched
function display10v10Data(unitOfAssessment) {
    const option = document.getElementById('10v10Option').value;
    fetch20(unitOfAssessment)
        .then(data => {

            // Filter for 'Overall' profile type and sort
            const overallData = data.filter(item => item.ProfileType === 'Overall');
            const sortedData = overallData.sort((a, b) => b.AverageScore - a.AverageScore);

            // Get top 10 and next 10 universities
            const top10Universities = sortedData.slice(0, 10);
            const next10Universities = sortedData.slice(10, 20);

            // Extract university names for further filtering
            const top10Names = top10Universities.map(u => u.UniversityName);
            const next10Names = next10Universities.map(u => u.UniversityName);

            // Filter the original dataset for these universities
            const top10Data = data.filter(item => top10Names.includes(item.UniversityName));
            const next10Data = data.filter(item => next10Names.includes(item.UniversityName));

                // Declare these outside to ensure they are accessible
                let top10 = { chartData: 0 };
                let next10 = { chartData: 0 };

                if (option === 'Doctoral') {
                    top10 = calculateGraphDoctoral(top10Data);
                    next10 = calculateGraphDoctoral(next10Data);
                    tooltipLabel = 'Doctoral Degrees';
                } else if (option === 'Overall' || option === 'Outputs' || option === 'Impact' || option === 'Environment') {
                    top10 = calculateAverageScoreByProfileType(top10Data, option);
                    next10 = calculateAverageScoreByProfileType(next10Data, option);
                    tooltipLabel = option + ' - Average GPA';
                } else if (option === 'FTEOfSubmittedStaff') {
                    top10 = calculateTotalFTE(top10Data);
                    next10 = calculateTotalFTE(next10Data);
                    tooltipLabel = 'FTE Of Submitted Staff';
                } else {
                    top10 = calculateIncome(top10Data, option);
                    next10 = calculateIncome(next10Data, option);

                    formattedTop10 = formatCurrency(top10.chartData);
                    formattedNext10 = formatCurrency(next10.chartData);
                    tooltipLabel = option === 'TotalIncome1320' ? 'Total Income (£)' : 'Average Yearly Income (£)';
                }

                let maxValue = Math.max(top10.chartData, next10.chartData); // Assuming this retrieves the max value from your data
                let yAxisMax;

                if (option === 'Doctoral' || option === 'FTEOfSubmittedStaff') {
                    yAxisMax = Math.ceil(maxValue / 200) * 200; // Find nearest multiple of 200 above maxValue
                } else if (option === 'Overall' || option === 'Impact' || option === 'Outputs' ||option === 'Environment') {
                    yAxisMax = 4; // Set max to 4 for these options
                } else {
                    yAxisMax = undefined; // Let Highcharts determine the max
                }

                Highcharts.chart('10v10container', {
                    chart: {
                        type: 'bullet',
                        inverted: true
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: ['Top 10', 'Next 10']
                    },
                    yAxis: {
                        title: {
                            text: tooltipLabel
                        },
                        labels: {
                            style: {
                                fontSize: '10px'
                            }
                        },
                        max: yAxisMax
                    },
                    tooltip: {
                        formatter: function() {
                            let tooltipValue = this.y;
                            if (option !== 'Doctoral' && option !== 'Overall' && option !== 'Outputs' && option !== 'Impact' && option !== 'Environment' && option !== 'FTEOfSubmittedStaff') {
                                tooltipValue = this.series.name === 'Top 10' ? formattedTop10 : formattedNext10;
                            }
                            return `${tooltipLabel}: <b>${tooltipValue}</b>`;
                        }
                    },
                    series: [{
                        data: [
                            {y: top10.chartData}, // Use default or specific color for top10
                            {y: next10.chartData, color: 'red'}  // Use red color for next10
                        ]
                    }],
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    }
                });
        });
    }
function formatCurrency(value) {
    return '£' + value.toLocaleString('en-UK', { maximumFractionDigits: 0 });
}


function calculateIncome(data, option) {
    console.log(option);
    let chartData = 0;
    filteredData = data.filter(item => item.IncomeSource === 'Total income');
    console.log(filteredData);
    filteredData.forEach(item => {
        chartData += Number(item[option]);
    });

    console.log(chartData);
    return {
        chartData
    };

}
function calculateTotalFTE(data) {
    let chartData = 0;

    filteredData = data.filter(item => item.ProfileType === 'Overall');
    filteredData.forEach(item => {
        chartData += Number(item.FTEOfSubmittedStaff);
    });
    chartData = parseFloat(chartData.toFixed(0));
    return {
        chartData
    };

}

function calculateGraphDoctoral(data) {
    let chartData = 0;

    data.forEach(item => {

        // Sum DoctoralDegrees from 2013 to 2019 for "Environment" profile type
        if (item.ProfileType === 'Environment') {
            chartData += Number(item.DoctoralDegrees2013) || 0;
            chartData += Number(item.DoctoralDegrees2014) || 0;
            chartData += Number(item.DoctoralDegrees2015) || 0;
            chartData += Number(item.DoctoralDegrees2016) || 0;
            chartData += Number(item.DoctoralDegrees2017) || 0;
            chartData += Number(item.DoctoralDegrees2018) || 0;
            chartData += Number(item.DoctoralDegrees2019) || 0;;
        }
    });
    chartData = parseFloat(chartData.toFixed(0));
    return {
        chartData
    };
}

function calculateAverageScoreByProfileType(data, profileType) {
    // Filter data by the specified ProfileType
    const filteredData = data.filter(item => item.ProfileType === profileType);

    // Calculate average score for each university
    let average = 0;
    let count = 0;
    filteredData.forEach(item => {
        average += Number(item.AverageScore);
        count++;
    });

    // Calculate the average from the filtered data
    let chartData = average / count;
    chartData = parseFloat(chartData.toFixed(2));
    return {
    chartData
    };

}

document.getElementById('10v10Option').addEventListener('change', function() {
    const selectedUofA = document.getElementById('unit-of-assessment-dropdown').value;
    display10v10Data(selectedUofA);
})