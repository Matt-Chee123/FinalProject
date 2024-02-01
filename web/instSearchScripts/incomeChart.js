function displayIncomeChart(data) {
  // Find the record with InstitutionID containing "Total income"
  const totalIncomeRecord = data.find(item => item.InstitutionID.includes("Total income"));

  if (!totalIncomeRecord) {
    console.error('No total income record found');
    return;
  }

  // Calculate the incomes for the years 2016 to 2019 based on the 2015 data and average
  const averageIncome1520 = totalIncomeRecord.AverageIncome15_20 || 0;
  const income2015 = totalIncomeRecord.IncomeAcademicYear14_15 || 0;
  const income2016 = income2015 + averageIncome1520;
  const income2017 = income2015 + 2 * averageIncome1520;
  const income2018 = income2015 + 3 * averageIncome1520;
  const income2019 = income2015 + 4 * averageIncome1520;

  // Create the data array for Highcharts, using the actual data for 2014 and 2015,
  // calculated data for 2016 to 2019, and the actual total for 2020
  const chartData = [
    totalIncomeRecord.IncomeAcademicYear13_14, // Data for 2014
    income2015, // Data for 2015
    income2016, // Data for 2016
    income2017, // Data for 2017
    income2018, // Data for 2018
    income2019, // Data for 2019
    totalIncomeRecord.TotalIncome13_20 // Data for 2020
  ];

  // Initialize Highcharts
  Highcharts.chart('income-container', {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Income Data'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020']
    },
    yAxis: {
      title: {
        text: 'Income'
      }
    },
    series: [{
      name: 'Income',
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