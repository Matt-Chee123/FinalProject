function fetchIncomeData(uofaName = 'Computer Science and Informatics') {
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/income?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayTopFourSources(data); // Assuming you'll adjust this function to handle the income data
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}


function calculateSumOfIncome(data, source) {
    let sumIncome = 0;
  // Accumulate sum of scores for the specified profile type
    data.forEach(item => {
        if (item.IncomeSource === source) {
        sumIncome += item.TotalIncome1320;
        }
    });
  // Calculate average score
    return sumIncome;
}

function displayTopFourSources(data) {
  const topSourcesContainer = document.getElementById('top-sources-records');
  const beisIncome = calculateSumOfIncome(data,'BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh');
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
// Assuming maxValue is the maximum income value among the top 4 incomes
  const maxValue = Math.max(...top4Incomes.map(income => income.value));
  const tickTarget = 5; // Target number of ticks
  let tickInterval = Math.ceil(maxValue / tickTarget); // Base tick interval
// Adjust to a more human-readable value
  tickInterval = adjustToReadableInterval(tickInterval);

  function adjustToReadableInterval(interval) {
      const exponent = Math.floor(Math.log10(interval)); // Find the order of magnitude of the interval
      const fraction = interval / Math.pow(10, exponent); // Normalize the interval to a fraction < 10
      let niceFraction;

      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;

      return niceFraction * Math.pow(10, exponent);
}

// Convert tickInterval back to actual scale if you're working in millions or another scale


  Highcharts.chart('top-sources-container', {
    chart: {
      type: 'column',
      marginBottom: 5 // Adjust if necessary to fit the chart
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
        text: 'Income (£M)'
      },
      tickInterval: tickInterval, // Use the dynamically calculated tick interval
      labels: {
        formatter: function() {
          return (this.value / 1000000); // Convert to M for millions
        }
      }
    },
    tooltip: {
      formatter: function() {
        // Access the name of the income source from the point's category (x-axis category)
        const incomeSourceName = this.point.category;
        // Format the income value with Highcharts' numberFormat function, including thousands separator
        const incomeValueFormatted = Highcharts.numberFormat(this.y, 0, '.', ',');
        // Construct the tooltip content, using <b> tags for bold text and including "Income:" text
        return '<b>' + incomeSourceName + '</b><br/>Income: £' + incomeValueFormatted;
      }
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
      name: 'Income',
      data: top4Incomes.map(income => income.value),
      showInLegend: false // Ensure that the series is not shown in the legend
    }]
  });
}
