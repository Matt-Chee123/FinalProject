function displayDoctoralDegreesChart(uniData, averages) {

  relevantDataArray = uniData.filter(item => item.ProfileType === "Environment");

//filtering returns array so return first item to get the relevant data
  let relevantData = relevantDataArray[0];

  // Data for the selected university
  let uniDegreeData = relevantData ? {
    name: relevantData.UniversityName,
    data: [
      parseInt(relevantData.DoctoralDegrees2013, 10),
      parseInt(relevantData.DoctoralDegrees2014, 10),
      parseInt(relevantData.DoctoralDegrees2015, 10),
      parseInt(relevantData.DoctoralDegrees2016, 10),
      parseInt(relevantData.DoctoralDegrees2017, 10),
      parseInt(relevantData.DoctoralDegrees2018, 10),
      parseInt(relevantData.DoctoralDegrees2019, 10)
    ]
  } : null;

  // series data for bar chart
  let seriesData = [
    uniDegreeData,
    {
      name: 'National Average',
      data: averages,
      color: '#FF0000' // red color for averages
    }
  ];

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
      tickPositioner: function () {
        const max = this.dataMax; //ensure 3 ticks and starts from 0
        const roundedMax = Math.ceil(max / 10) * 10;

        const min = 0;
        const interval = roundedMax / 2;

        return [min, min + interval, roundedMax];
      },
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

// Fetch the data for the selected university and the national averages
function fetchEnvironmentAverages(unitOfAssessment) {
  const url = `https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/environment?unitOfAssessmentName=${encodeURIComponent(unitOfAssessment)}`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      let sumDegrees = {};
      let countDegrees = {};

      // calcaulte sum for each year
      data.forEach(record => {
        for (let year = 2013; year <= 2019; year++) {
          const degrees = parseInt(record[`DoctoralDegrees${year}`], 10) || 0;
          if (degrees > 0) {
            sumDegrees[year] = (sumDegrees[year] || 0) + degrees;
            countDegrees[year] = (countDegrees[year] || 0) + 1;
          }
        }
      });
      // calcualte the average degrees for each year
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
      return []; //return empty array if error
    });
}