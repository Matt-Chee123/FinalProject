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

  // Your code to process and use the form data goes here.
  // You can access form values using document.getElementById('elementId').value

  // For example:
  var uofA = document.getElementById('UofA').value;
  var xAxis = document.getElementById('xAxis').value;
  var xProfOption = document.getElementById('xProfOptions').value;
  var yAxis = document.getElementById('yAxis').value;
  var yProfOption = document.getElementById('yProfOptions').value;
  var xRadioCheck = document.querySelector('input[name="specialOptionGroupX"]:checked').value;
  var yRadioCheck = document.querySelector('input[name="specialOptionGroupY"]:checked').value;

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
    let combinedDataMap = new Map();
    xAxisFilter.forEach(item => {
      combinedDataMap.set(item.UniversityName, item);
    });

    // Merge income data into the map
    yAxisFilter.forEach(item => {
      if (combinedDataMap.has(item.UniversityName)) {
        // If the university already exists in the map, merge the data
        Object.assign(combinedDataMap.get(item.UniversityName), item);
      } else {
        // If it doesn't exist, add it as a new entry
        combinedDataMap.set(item.UniversityName, item);
      }
    });
    console.log(combinedDataMap);
    function calculateTotalDoctoralDegrees(record) {
      let total = 0;
      for (let year = 2013; year <= 2019; year++) {
        total += parseInt(record[`DoctoralDegrees${year}`] || 0, 10);
      }
      return total;
    }
  // Extract the attributes to be plotted
    var xAttribute = xRadioCheck === 'profile' ? xProfOption : 'TotalIncome1320';
    var yAttribute = yRadioCheck === 'profile' ? yProfOption : 'TotalIncome1320'

    let combinedDataArray = Array.from(combinedDataMap.values());

    var chartData = combinedDataArray.map(item => {
        // Determine the x and y values based on selected attributes
      var xValue = xAttribute === 'totalDoctoralDegrees' ? calculateTotalDoctoralDegrees(item) : item[xAttribute];
      var yValue = yAttribute === 'totalDoctoralDegrees' ? calculateTotalDoctoralDegrees(item) : item[yAttribute];
      return {
        x: item[xAttribute],
        y: item[yAttribute],
        name: item.UniversityName,
      };
    });
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

