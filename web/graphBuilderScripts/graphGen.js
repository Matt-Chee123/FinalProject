// Event listener for form submission
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

document.getElementById('dataQueryForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the selected values for ProfileType, X-axis, and Y-axis
  var profileType = document.getElementById('ProfileType').value;
  var incomeSource = document.getElementById('IncomeSource').value; // New dropdown value
  var xAxisAttribute = document.getElementById('xAxis').value;
  var yAxisAttribute = document.getElementById('yAxis').value;
  var uniToHighlight = document.getElementById('instHighlight').value.trim();
  var highlightRussellGroup = document.getElementById('russelHighlight').checked;


  // Fetch the full dataset
  fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items')
  .then(response => response.json())
  .then(data => {
    // Filter the data based on the selected ProfileType
    var filteredProfileData = data.filter(item => item.ProfileType === profileType);
    var filteredIncomeData = data.filter(item => item.IncomeSource === incomeSource);
    // Create a map to hold the combined data
    let combinedDataMap = new Map();

    // Add profile data to the map
    filteredProfileData.forEach(item => {
      combinedDataMap.set(item.UniversityName, item);
    });

    // Merge income data into the map
    filteredIncomeData.forEach(item => {
      if (combinedDataMap.has(item.UniversityName)) {
        // If the university already exists in the map, merge the data
        Object.assign(combinedDataMap.get(item.UniversityName), item);
      } else {
        // If it doesn't exist, add it as a new entry
        combinedDataMap.set(item.UniversityName, item);
      }
    });

    // Convert the map back to an array if you need to work with array methods or pass to a library
    let combinedDataArray = Array.from(combinedDataMap.values());
    console.log(combinedDataArray);
    // Now combinedDataArray contains combined records from both filteredProfileData and filteredIncomeData

    function calculateTotalDoctoralDegrees(record) {
      let total = 0;
      for (let year = 2013; year <= 2019; year++) {
        total += parseInt(record[`DoctoralDegrees${year}`] || 0, 10);
      }
      return total;
    }

      // Map the filtered data to the format expected by Highcharts
    var chartData = combinedDataArray.map(item => {
        // Determine the x and y values based on selected attributes
      var xValue = xAxisAttribute === 'totalDoctoralDegrees' ? calculateTotalDoctoralDegrees(item) : item[xAxisAttribute];
      var yValue = yAxisAttribute === 'totalDoctoralDegrees' ? calculateTotalDoctoralDegrees(item) : item[yAxisAttribute];
      var isRussellGroup = russellGroupUniversities.has(item.UniversityName);
      var isHighlightedUni = item.UniversityName.toLowerCase() === uniToHighlight.toLowerCase();

      return {
        x: item[xAxisAttribute],
        y: item[yAxisAttribute],
        name: item.UniversityName,
        // Set the marker color based on whether it's a highlighted uni or a Russell Group uni
        marker: {
          fillColor: isHighlightedUni ? 'red' : (highlightRussellGroup && isRussellGroup ? 'green' : 'blue'),
          lineWidth: isHighlightedUni ? 2 : 0,
          lineColor: isHighlightedUni ? 'yellow' : null
        }
      };
    });
    // Now use this chartData to plot the graph with Highcharts
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
          text: xAxisAttribute
        }
      },
      yAxis: {
        title: {
          text: yAxisAttribute
        }
      },
      tooltip: {
        formatter: function() {
          return '<b>' + this.point.name + '</b><br/>' +
                 xAxisAttribute + ': ' + this.point.x + '<br/>' +
                 yAxisAttribute + ': ' + this.point.y;
        }
      },
      series: [{
        name: 'Data',
        data: chartData.map(point => {
          // Check if this point should be highlighted
          if (point.name === uniToHighlight) {
            // Return the point with a custom marker
            return {
              x: point.x,
              y: point.y,
              name: point.name,
              marker: {
                fillColor: 'red'
              }
            };
          } else {
            // Return the point with default settings
            return point;
          }
        })
      }]
    });

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
});
