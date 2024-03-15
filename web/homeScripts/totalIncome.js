//fetching total income data
function fetchIncomeData(uofaName = 'Computer Science and Informatics') {
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/income?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayTopFourSources(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

// calculate sum of income for a specific source
function calculateSumOfIncome(data, source) {
    let sumIncome = 0;
    data.forEach(item => {
        if (item.IncomeSource === source) {
        sumIncome += item.TotalIncome1320;
        }
    });
    return sumIncome;
}

function displayTopFourSources(data) {
  //specify income sources names
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
// sort incomes by value
  incomes.sort((a, b) => b.value - a.value);
// get top 4 incomes
  const top4Incomes = incomes.slice(0, 4);
  // calculating tick interval
  const maxValue = Math.max(...top4Incomes.map(income => income.value));
  const tickTarget = 5;
  let tickInterval = Math.ceil(maxValue / tickTarget);
// make tick interval more standard
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

  Highcharts.chart('top-sources-container', {
    chart: {
      type: 'column',
      marginBottom: 55,
    },
    title: {
      text: 'Top 4 Income Sources'
    },
    xAxis: {
      categories: top4Incomes.map(income => income.name),
      labels: {
          rotation: -30,
          style: {
              fontSize: '10px'
          }
        }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Income (£M)'
      },
      tickInterval: tickInterval,
      labels: {
        formatter: function() {
          return (this.value / 1000000);
        },
        style: {
          fontSize: '10px'
        }
      }
    },
    tooltip: {
      formatter: function() {
        const incomeSourceName = this.point.category;
        const incomeValueFormatted = Highcharts.numberFormat(this.y, 0, '.', ',');
        return '' + incomeSourceName + '<br/>Income: <b>£' + incomeValueFormatted + '</b>'
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        marker: {
          enabled: false
        }
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Income',
      data: top4Incomes.map(income => income.value),
      showInLegend: false
    }]
  });
}
