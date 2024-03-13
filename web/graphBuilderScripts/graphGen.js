var optionsProfile = [
  {value: 'AverageScore', text: 'GPA'},
  {value: 'FTEOfSubmittedStaff', text: 'FTE Of Submitted Staff'},
  {value: 'PercEligibleStaff', text: '% of Eligible Staff'},
  {value: 'FourStar', text: '% of Four Star'},
  {value: 'ThreeStar', text: '% of Three Star'},
  {value: 'TwoStar', text: '% of Two Star'},
  {value: 'OneStar', text: '% of One Star'},
  {value: 'Unclassified', text: '% of Unclassified'}
];

var optionsIncome = [
  {value: 'TotalIncome1320', text: 'Total Income 2013-20'},
  {value: 'AverageIncome1320', text: 'Average Income 2013-20'},
  {value: 'AverageIncome1520', text: 'Average Income 2015-20'},
  {value: 'Income201314', text: 'Income 2013-14'},
  {value: 'Income201415', text: 'Income 2014-15'},
];

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

function ensureErrorMessageElement() {
  var graphContainer = document.getElementById('graph-container');
  var errorMessageElement = document.getElementById('error-message');

  // If the error message element does not exist, create and append it
  if (!errorMessageElement) {
    errorMessageElement = document.createElement('div');
    errorMessageElement.setAttribute('id', 'error-message');
    errorMessageElement.setAttribute('class', 'hidden');
    errorMessageElement.style.color = 'red';
    errorMessageElement.style.display = 'none';
    graphContainer.appendChild(errorMessageElement);
  }

  return errorMessageElement;
}

document.getElementById('dataForm').onsubmit = function(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  if (window.myChart && window.myChart.destroy) {
      window.myChart.destroy();
      window.myChart = undefined; // Or null
  }


  var errorMessageElement = ensureErrorMessageElement();
  errorMessageElement.style.display = 'none';
  errorMessageElement.textContent = '';

  var uofA = document.getElementById('UofA').value;
  var xAxis = document.getElementById('xAxis').value;
  var xProfOption = document.getElementById('xProfOptions').value;
  var yAxis = document.getElementById('yAxis').value;
  var yProfOption = document.getElementById('yProfOptions').value;
  var xRadioCheckElement = document.querySelector('input[name="specialOptionGroupX"]:checked');
  var yRadioCheckElement = document.querySelector('input[name="specialOptionGroupY"]:checked');
  var xRadioCheck = xRadioCheckElement ? xRadioCheckElement.value : '';
  var yRadioCheck = yRadioCheckElement ? yRadioCheckElement.value : '';

  var errorMessage = '';
  if (!uofA) {
    errorMessage = 'Please select a Unit of Assessment.';
  } else if (!xAxis || !xProfOption) {
    errorMessage = 'Please complete the X axis selections.';
  } else if (!yAxis || !yProfOption) {
    errorMessage = 'Please complete the Y axis selections.';
  }

  // If there's an error message, display it and exit the function
  if (errorMessage) {
    document.getElementById('error-message').textContent = errorMessage;
    document.getElementById('error-message').style.display = 'block'; // Show the error message
    return; // Exit the function to prevent further execution
  }

  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/UoA?uofaName=${encodeURIComponent(uofA)}`)
  .then(response => response.json())
  .then(data => {
    console.log('Data:', data);
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
          // Highlight this point by changing its color and setting its zIndex
          // Setting color to 'red' and zIndex to a high value to ensure it appears in front
          return { ...point, color: 'red', zIndex: 100 }; // Adjust zIndex value as needed
        }
        // Optionally, adjust other points to ensure they do not overlap the highlighted one
        // by setting their zIndex to a lower value than the highlighted point's zIndex.
        return point; // Ensure other points have a lower zIndex
      });
    }

  // Extract the attributes to be plotted
    var xAttribute = xProfOption;
    var yAttribute = yProfOption;

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
          xValue = parseInt(item[xAttribute], 10); // Use the 'TotalIncome1320' value for 'income'
        }

        // Determine yValue based on yRadioCheck
        if (yRadioCheck === 'profile') {
          yValue = yItem[yAttribute]; // For 'profile', use the yProfOption value
        } else{ // 'income'
          console.log('yItem:', yItem);
          yValue = parseInt(yItem[yAttribute], 10); // Use the 'TotalIncome1320' value for 'income'
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

    let xAxisMax = null;
    let yAxisMax = null;
    let xAxisMin = null;
    let yAxisMin = null;
    let tickInterval = null;
    let marginBottom = 60;

    if (xRadioCheck === 'profile' && xProfOption === 'AverageScore') {
      xAxisMax = 4; // Set the max limit for the xAxis if the condition is met
    }
    else if (xProfOption === 'FourStar' || xProfOption === 'ThreeStar' || xProfOption ==='TwoStar' || xProfOption === 'OneStar' || xProfOption === 'Unclassified' || xProfOption === 'PercEligibleStaff'){
        xAxisMax = 100; // Set the max limit for the xAxis if the condition is met
        xAxisMin = 0;
    }
    if (yRadioCheck === 'profile' && yProfOption === 'AverageScore') {
       yAxisMax = 4; // Set the max limit for the yAxis if the condition is met
    }
    else if (yProfOption === 'FourStar' || yProfOption === 'ThreeStar' || yProfOption ==='TwoStar' || yProfOption === 'OneStar' || yProfOption === 'Unclassified' || yProfOption === 'PercEligibleStaff'){
        yAxisMax = 100; // Set the max limit for the yAxis if the condition is met
        yAxisMin = 0;
    }
  // Adjust the chartData to include a marker or color change for Russell Group universities
    chartData = chartData.map(point => {
      if (russellGroupUniversities.has(point.name)) {
      // Example of highlighting: change the marker symbol or color
      // This is just one way to highlight; adjust according to your needs
        return highlightRussell ? { ...point, color: 'green', zIndex: 10 } : point;
      }
      return point;
  });
    highlightUniversity(uniNameToHighlight);
    chartData.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Log chartData to verify
        const xProfOptionText = findOptionText(xRadioCheck === 'profile' ? optionsProfile : optionsIncome, xProfOption);
        const yProfOptionText = findOptionText(yRadioCheck === 'profile' ? optionsProfile : optionsIncome, yProfOption);

        const isProfileAndSameParam = xRadioCheck === 'profile' && yRadioCheck === 'profile' && xProfOption === yProfOption;
        const isIncomeAndSameSource = xRadioCheck === 'income' && yRadioCheck === 'income' && xAxis === yAxis;

        // Define the list of specific options that would trigger the chart to be square
        const percOptionsList = ['PercEligibleStaff', 'FourStar', 'ThreeStar', 'TwoStar', 'OneStar', 'Unclassified'];

        // Check if both xProfOption and yProfOption are in the specificOptionsList
        const isBothOptionsInList = percOptionsList.includes(xProfOption) && percOptionsList.includes(yProfOption);

        // Update the shouldBeSquare condition to include this new check
        const shouldBeSquare = isProfileAndSameParam || isIncomeAndSameSource || isBothOptionsInList;

    // Get container dimensions
    const containerWidth = document.getElementById('graph-container').clientHeight;
    if (isProfileAndSameParam || isIncomeAndSameSource) {
        let minValue = 0; // Default minValue for income
        let maxValue; // Will be defined based on condition
        let tickInterval;

        // Apply specific axis settings for 'AverageScore'
        if (xProfOption === 'AverageScore' || yProfOption === 'AverageScore') {
            maxValue = 4; // Max value is explicitly set for 'AverageScore'
            tickInterval = 1; // A fixed interval makes sense for a scale of 0-4
        } else if (xRadioCheck === 'income' || yRadioCheck === 'income') {
            // Specific handling for income data
            let allValues = [...xAxisFilter.map(item => parseFloat(item[xProfOption])), ...yAxisFilter.map(item => parseFloat(item[yProfOption]))];
            maxValue = Math.max(...allValues) * 1.1; // Adding a 10% buffer
            marginBottom = 80;
            // Round maxValue up to the nearest suitable round number for income data
            maxValue = Math.ceil(maxValue / 1e6) * 1e6; // Round up to the nearest million

            // Define tickInterval based on the rounded maxValue
            tickInterval = maxValue / 5; // Example: divide the range into 5 rounded intervals
        } else if (xProfOption === 'FourStar' || xProfOption === 'ThreeStar' || xProfOption ==='TwoStar' || xProfOption === 'OneStar' || xProfOption === 'Unclassified' || xProfOption === 'PercEligibleStaff'){
                maxValue = 100; // Max value is explicitly set for star ratings
                minValue = 0;
                tickInterval = 20; // A fixed interval makes sense for a scale of 0-100
        }

        else {
            // For other data types, including when profile parameters are the same but not 'AverageScore'
            let allValues = [...xAxisFilter.map(item => parseFloat(item[xProfOption])), ...yAxisFilter.map(item => parseFloat(item[yProfOption]))];
            maxValue = Math.max(...allValues) * 1.1; // Adding a 10% buffer
            // Calculate a generic tick interval
            tickInterval = Math.ceil((maxValue - minValue) / 5); // Example strategy to aim for about 5 ticks
        }

        // Adjusted axis settings based on the conditions
        xAxisMax = maxValue;
        yAxisMax = maxValue;
        xAxisMin = minValue; // Ensuring min is set to 0 for income data
        yAxisMin = minValue;
        tickInterval = tickInterval; // Apply calculated tick interval
    }

    window.myChart = Highcharts.chart('graph-container', {
        chart: {
          type: 'scatter',
          zoomType: 'xy',
          marginBottom: marginBottom, // Adjust this value as needed
          width: shouldBeSquare ? containerWidth : null, // Set height equal to width if params are the same

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
            text: xAxis + ': ' + xProfOptionText,
          },
          max: xAxisMax,
          min: xAxisMin,// Dynamically set the max value for the xAxis
          tickInterval: tickInterval, // Set tickInterval to 1 when both are 'AverageScore', else auto
          labels: {
              style: {
              fontSize: '10px'
              }
          }
        },
        yAxis: {
          title: {
            text: yAxis + ': ' + yProfOptionText,
          },
          labels: {
            style: {
              fontSize: '10px'
            }
          },
          max: yAxisMax,
          min: yAxisMin, // Dynamically set the max value for the yAxis
          tickInterval: tickInterval
        },
        tooltip: {
            formatter: function() {
              let xValueFormatted = xRadioCheck === 'income' ? formatNumberAsCurrency(this.point.x) : this.point.x;
              let yValueFormatted = yRadioCheck === 'income' ? formatNumberAsCurrency(this.point.y) : this.point.y;

              return '<b>' + this.point.name + '</b><br/>' +
                     xAxis + ' - ' + xProfOptionText + ': ' + xValueFormatted + '<br/>' +
                     yAxis + ' - ' + yProfOptionText + ': ' + yValueFormatted;
            }
          },
        series: [{
          name: 'Data',
          data: chartData.map(point => {
            return point;
          }),
          marker: {
            radius: 3 // Adjust this value to make the points smaller or larger
          }
        }]
    });
})
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

function findOptionText(options, value) {
  const option = options.find(option => option.value === value);
  return option ? option.text : value; // Return the 'text' if found, else return the original 'value'
}

function formatNumberAsCurrency(value) {
  return '£' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
