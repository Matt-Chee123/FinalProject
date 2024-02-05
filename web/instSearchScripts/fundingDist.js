function displayIncomeDist(data) {
    // Filter out records without 'ProfileType' and where 'IncomeSource' is not 'total income'
    let filteredData = data.filter(record =>
        record.ProfileType === undefined && record.IncomeSource !== 'Total income'
    );

    // Prepare the data for the Highcharts pie chart
    let pieChartData = filteredData.map(record => {
        return {
            name: record.IncomeSource,
            y: parseFloat(record.TotalIncome13_20),
            totalIncome: record.TotalIncome13_20
        };
    });

    // Initialize the Highcharts pie chart
    Highcharts.chart('income-chart-dist', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Income Distribution'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return `<b>${this.point.name}</b><br/>Income: £${parseFloat(this.point.totalIncome).toLocaleString()}<br/>Percentage: ${this.point.percentage.toFixed(1)}%`;
            }
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Income',
            colorByPoint: true,
            data: pieChartData
        }]
    });
}