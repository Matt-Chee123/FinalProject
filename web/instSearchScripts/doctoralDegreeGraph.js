function displayDoctoralDegreesChart(uniData, averages) {

  const relevantData = uniData.find(item => item.ProfileType.includes("Environment"));

  let uniDegreeData = {
    name: relevantData.UniversityName, // Replace with actual property if different
    data: [
      parseInt(relevantData.DoctoralDegrees2013, 10),
      parseInt(relevantData.DoctoralDegrees2014, 10),
      parseInt(relevantData.DoctoralDegrees2015, 10),
      parseInt(relevantData.DoctoralDegrees2016, 10),
      parseInt(relevantData.DoctoralDegrees2017, 10),
      parseInt(relevantData.DoctoralDegrees2018, 10),
      parseInt(relevantData.DoctoralDegrees2019, 10)
    ]
  };

  // Prepare the series data for the bar chart
  let seriesData = [
    uniDegreeData,
    {
      name: 'National Average',
      data: averages,
      color: '#FF0000' // Different color for averages
    }
  ];

  // Initialize the Highcharts bar chart
  Highcharts.chart('doctoral-degrees-container', {
    chart: {
      type: 'column',
      marginBottom: 50
    },
    title: {
      text: 'Doctoral Degrees Awarded Per Year'
    },

    credits: {
        enabled: false
        },
    legend: {
      enabled: false
    },

    xAxis: {
      categories: ['2013', '2014', '2015', '2016', '2017', '2018', '2019'],
      labels: {
        style: {
          fontSize: '10px'
        }
      },
      title: {
        text: 'Year'
      },
      crosshair: true
    },
    yAxis: {
      min: 0,
      labels: {
        style: {
          fontSize: '10px'
        }
      },
      title: {
        text: 'Number of Degrees'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} degrees</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: seriesData
  });
}

function fetchEnvironmentAverages(unitOfAssessment) {
  return fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/environment')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      let sumDegrees = {};
      let countDegrees = {};
      const filteredData = data.filter(item => item.UnitOfAssessmentName === unitOfAssessment);

      // Calculate the sum and count for each year to find the average later
      filteredData.forEach(record => {
        for (let year = 2013; year <= 2019; year++) {
          const degrees = parseInt(record[`DoctoralDegrees${year}`], 10) || 0;
          if (degrees > 0) { // Only count years with data
            sumDegrees[year] = (sumDegrees[year] || 0) + degrees;
            countDegrees[year] = (countDegrees[year] || 0) + 1;
          }
        }
      });
      // Compute the average for each year
      let averageDegreesPerYear = [];
      for (let year = 2013; year <= 2019; year++) {
        averageDegreesPerYear.push(
          countDegrees[year] ? Math.round(sumDegrees[year] / countDegrees[year]) : 0
        );
      }
      return averageDegreesPerYear;
    })
    .catch(error => {
      console.error('Error fetching environment data:', error);
      return []; // Return an empty array if there was an error
    });
}