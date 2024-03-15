function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById('search-results');

    if (data && data.length > 0) {
        // order and titles of the categories
        const categories = ['Outputs', 'Impact', 'Environment'];

        // map data to correct format for highcharts
        const seriesData = categories.map(category => {
            const item = data.find(d => d.ProfileType === category);
            return item ? parseFloat(item.AverageScore.toFixed(2)) : 0;
        });

        Highcharts.chart(searchResultsContainer, {
            chart: {
                type: 'bar',
                marginBottom: 50
            },
            title: {
                text: 'Profile Scores'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                },
                labels: {
                  step: 1
                }
            },
            yAxis: {
                min: 0,
                max: 4, // Max value on the axis is 4
                title: {
                    text: 'GPA'
                },
                labels: {
                  style: {
                     fontSize: '10px'
                  },
                  overflow: 'justify'
                },
            },
            tooltip: {
                pointFormat: 'GPA: <b>{point.y}</b>'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
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
                name: 'GPA',
                data: seriesData
            }]
        });
    } else {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
    }
}
