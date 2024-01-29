fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/income')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    displayTopThreeSources(data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

function calculateSumOfIncome(data, source) {
    let sumIncome = 0;
  // Accumulate sum of scores for the specified profile type
    data.forEach(item => {
        if (item.IncomeSource === source) {
        sumIncome += item.TotalIncome13_20;
        }
    });
  // Calculate average score
    return sumIncome;
}

function displayTopThreeSources(data) {
  const topSourcesContainer = document.getElementById('top-sources-records');
  const beisIncome = calculateSumOfIncome(data, 'BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh');
  const charityOpenIncome = calculateSumOfIncome(data, 'UK-based charities (open competitive process)');
  const charityOtherIncome = calculateSumOfIncome(data, 'UK-based charities (other)');
  const govCentraIncome = calculateSumOfIncome(data, 'UK central government bodies/local authorities, health and hospital authorities');
  const govTaxIncome = calculateSumOfIncome(data, 'UK central government tax credits for research and development expenditure');
  const corpIncome = calculateSumOfIncome(data, 'UK industry, commerce and public corporations');
  const ukOtherIncome = calculateSumOfIncome(data, 'UK other sources');
  const euGovIncome = calculateSumOfIncome(data, 'EU government bodies');
  const euCharIncome = calculateSumOfIncome(data, 'EU-based charities (open competitive process)');
  const euIndIncome = calculateSumOfIncome(data, 'EU industry, commerce and public corporations');
  const euOtherIncome = calculateSumOfIncome(data, 'EU (excluding UK) other');
  const nonEuCharIncome = calculateSumOfIncome(data, 'Non-EU-based charities (open competitive process)');
  const nonEuIndIncome = calculateSumOfIncome(data, 'Non-EU industry commerce and public corporations');
  const nonEuOtherIncome = calculateSumOfIncome(data, 'Non-EU other');

  const incomes = [
  { name: 'BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh', value: beisIncome },
  { name: 'UK-based charities (open competitive process)', value: charityOpenIncome },
  { name: 'UK-based charities (other)', value: charityOtherIncome },
  { name: 'UK central government bodies/local authorities, health and hospital authorities', value: govCentraIncome },
  { name: 'UK central government tax credits for research and development expenditure', value: govTaxIncome },
  { name: 'UK industry, commerce and public corporations', value: corpIncome },
  { name: 'UK other sources', value: ukOtherIncome },
  { name: 'EU government bodies', value: euGovIncome },
  { name: 'EU-based charities (open competitive process)', value: euCharIncome },
  { name: 'EU industry, commerce and public corporations', value: euIndIncome },
  { name: 'EU (excluding UK) other', value: euOtherIncome },
  { name: 'Non-EU-based charities (open competitive process)', value: nonEuCharIncome },
  { name: 'Non-EU industry commerce and public corporations', value: nonEuIndIncome },
  { name: 'Non-EU other', value: nonEuOtherIncome }
  ];

// Sort the incomes in descending order based on the value
  incomes.sort((a, b) => b.value - a.value);

// Get the top 4 highest figures
  const top4Incomes = incomes.slice(0, 4);
Highcharts.chart('top-sources-records', {
    chart: {
        type: 'column',
        marginBottom: 20 // Adjust if necessary to fit the chart
    },
    title: {
        text: 'Top 4 Income Sources'
    },
    xAxis: {
        categories: top4Incomes.map(income => income.name),
        labels: {
            enabled: false // Disables the labels on the x-axis
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Income (£)'
        },
        tickInterval: 200000000, // Set the tick interval to 200 million
        labels: {
            formatter: function() {
                return (this.value / 1000000) + 'M'; // Convert to M for millions
            }
        }
    },
    tooltip: {
        valuePrefix: '£'
    },
    plotOptions: {
        column: {
            dataLabels: {
                enabled: false // Disable data labels on the columns
            },
            marker: {
                enabled: false // Disable markers
            }
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Amount',
        data: top4Incomes.map(income => income.value),
        showInLegend: false // Ensure that the series is not shown in the legend
    }]
});

}
