function displayIncomeChart(data) {
  // find record with instID as total incme
  const totalIncomeRecord = data.find(item => item.InstitutionID.includes("Total income"));

  if (!totalIncomeRecord) {
    console.error('No total income record found');
    return;
  }

  // calculate incomes for 2015-2019
  const averageIncome1520 = totalIncomeRecord.AverageIncome1520 || 0;
  const income2015 = totalIncomeRecord.Income201314 + totalIncomeRecord.Income201415 || 0;
  const income2016 = income2015 + averageIncome1520;
  const income2017 = income2015 + 2 * averageIncome1520;
  const income2018 = income2015 + 3 * averageIncome1520;
  const income2019 = income2015 + 4 * averageIncome1520;

// create chart data
  const chartData = [
    totalIncomeRecord.Income201314,
    income2015,
    income2016,
    income2017,
    income2018,
    income2019,
    totalIncomeRecord.TotalIncome1320
  ];

  // calculate incomes for tooltip
  const incomeChanges = chartData.map((value, index, array) => {
    if (index === 0) return null;
    return value - array[index - 1];
  });

  // Initialize Highcharts
  Highcharts.chart('income-container', {
    chart: {
      type: 'spline',
      marginBottom: 50
    },
    legend: {
      enabled: false
    },
    title: {
      text: 'Income Data'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      labels: {
        style: {
          fontSize: '10px'
        }
      },
      title: {
        text: 'Year'
      },
      categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020']
    },
    yAxis: {
      labels: {
        style: {
          fontSize: '10px'
        }
      },
      tickAmount: 4,
      title: {
        text: 'Income (£)'
      }
    },
    tooltip: {
      formatter: function() {
        const incomeChange = incomeChanges[this.point.index];
        let tooltipText = `Year: ${this.x}<br>Income: <b>£${this.y.toLocaleString()}</b>`;
        if (incomeChange !== null) {
          tooltipText += `<br>Change: £${incomeChange.toLocaleString()}`;
        }
        return tooltipText;
      }
    },
    series: [{
      name: 'Income (£)',
      data: chartData,
      marker: {
        enabled: true,
        radius: 4
      }
    }],
    plotOptions: {
      series: {
        enableMouseTracking: true
      }
    }
  });
}
