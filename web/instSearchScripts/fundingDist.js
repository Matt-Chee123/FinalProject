//function to retrieve data from the database and display it in a pie chart
function displayIncomeDist(data) {

    let filteredData = data.filter(record =>
        record.ProfileType === undefined && record.IncomeSource !== 'Total income'
    );

    // create piechart data
    let pieChartData = filteredData.map(record => {
        return {
            name: record.IncomeSource,
            y: parseFloat(record.TotalIncome1320),
            totalIncome: record.TotalIncome1320
        };
    });

    // make pie chart
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
                return `${this.point.name}<br/>Income: <b>£${parseFloat(this.point.totalIncome).toLocaleString()}</b><br/>Percentage: ${this.point.percentage.toFixed(1)}%`;
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