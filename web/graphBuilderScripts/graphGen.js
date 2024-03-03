const russellGroupUniversities = new Set([
  "University of Birmingham",
  "University of Bristol",
  "University of Cambridge",
  "Cardiff University",
  "Durham University",
  "University of Edinburgh",
  "University of Exeter",
  "University of Glasgow",
  "Imperial College London",
  "King's College London",
  "University of Leeds",
  "University of Liverpool",
  "London School of Economics & Political Science",
  "University of Manchester",
  "University of Newcastle",
  "University of Nottingham",
  "University of Oxford",
  "Queen Mary University",
  "Queen's University Belfast",
  "University of Sheffield",
  "University of Southampton",
  "University College London",
  "University of Warwick",
  "University of York"
]);

document.getElementById('dataForm').onsubmit = function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  var uofA = document.getElementById('UofA').value;
  var xAxis = document.getElementById('xAxis').value;
  var xProfOption = document.getElementById('xProfOptions').value;
  var yAxis = document.getElementById('yAxis').value;
  var yProfOption = document.getElementById('yProfOptions').value;
  var xRadioCheck = document.querySelector('input[name="specialOptionGroupX"]:checked').value;
  var yRadioCheck = document.querySelector('input[name="specialOptionGroupY"]:checked').value;

  console.log('X axis:', xAxis);
    console.log('Y axis:', yAxis);
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/all?uofaName=${encodeURIComponent(uofA)}`)
  .then(response => response.json())
  .then(data => {

    if (xRadioCheck == 'profile') {
      var xAxisFilter = data.filter(item => item.ProfileType === xAxis);
    }
    else if (xRadioCheck == 'income') {
      var xAxisFilter = data.filter(item => item.IncomeSource === xAxis);
    }

    if (yRadioCheck == 'profile') {
      var yAxisFilter = data.filter(item => item.ProfileType === yAxis);
    } else if (yRadioCheck == 'income') {
        var yAxisFilter = data.filter(item => item.IncomeSource === yAxis);
    }
    console.log('X axis filter:', xAxisFilter);
    console.log('Y axis filter:', yAxisFilter);

    function calculateTotalDoctoralDegrees(record) {

      let total = 0;
      for (let year = 2013; year <= 2019; year++) {
        total += parseInt(record['DoctoralDegrees${year}'] || 0, 10);
      }
      return total;
    }
    function highlightUniversity(uniName) {
      // Assuming chartData is already prepared and contains all universities
      chartData = chartData.map(point => {
        if (point.name.toLowerCase() === uniName.toLowerCase()) {
          // Highlight this point, e.g., by changing its color or adding a marker
          return { ...point, color: 'red' }; // Customize as needed
        }
        return point;
      });
    }
  // Extract the attributes to be plotted
    var xAttribute = xRadioCheck === 'profile' ? xProfOption : 'TotalIncome1320';
    var yAttribute = yRadioCheck === 'profile' ? yProfOption : 'TotalIncome1320'

    let chartData = [];
    var uniNameToHighlight = document.getElementById('uniToHighlight').value;

    xAxisFilter.forEach((item) => {
      // Find the corresponding item in yAxisFilter by matching the UniversityName
      const yItem = yAxisFilter.find(y => y.UniversityName === item.UniversityName);
      if (yItem) {
        // Initialize xValue and yValue
        let xValue, yValue;

        // Determine xValue based on xRadioCheck
        if (xRadioCheck === 'profile') {
          xValue = item[xAttribute]; // For 'profile', use the xProfOption value
        } else { // 'income'
          xValue = parseInt(item['TotalIncome1320'], 10); // Use the 'TotalIncome1320' value for 'income'
        }

        // Determine yValue based on yRadioCheck
        if (yRadioCheck === 'profile') {
          yValue = yItem[yAttribute]; // For 'profile', use the yProfOption value
        } else { // 'income'
          yValue = parseInt(yItem['TotalIncome1320'], 10); // Use the 'TotalIncome1320' value for 'income'
        }

        // Add the combined data to chartData
        chartData.push({
          x: xValue,
          y: yValue,
          name: item.UniversityName // Use the university name as the point name
        });
      }
    });
    const highlightRussell = document.getElementById('highlightRussellGroup').checked;

  // Adjust the chartData to include a marker or color change for Russell Group universities
    chartData = chartData.map(point => {
      if (russellGroupUniversities.has(point.name)) {
      // Example of highlighting: change the marker symbol or color
      // This is just one way to highlight; adjust according to your needs
        return highlightRussell ? { ...point, color: 'green' } : point;
      }
      return point;
  });
    if (xAttribute === 'TotalIncome1320') {
        xAttribute = xAxis;
    }
    if (yAttribute === 'TotalIncome1320') {
        yAttribute = yAxis;
    }
    highlightUniversity(uniNameToHighlight);

  // Log chartData to verify
    console.log('chartData:', chartData);

    Highcharts.chart('graph-container', {
        chart: {
          type: 'scatter',
          zoomType: 'xy',
          marginBottom: 100 // Adjust this value as needed
        },
        credits: {
          enabled: false
        },

        legend: {
          enabled: false
        },
        title: {
          text: 'Graph based on selected attributes'
        },
        xAxis: {
          title: {
            text: xAttribute
          }
        },
        yAxis: {
          title: {
            text: yAttribute
          }
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.point.name + '</b><br/>' +
                   xAttribute + ': ' + this.point.x + '<br/>' +
                   yAttribute + ': ' + this.point.y;
          }
        },
        series: [{
          name: 'Data',
          data: chartData.map(point => {
            // Check if this point should be highlighted
            return point;
          })
        }]
      });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

