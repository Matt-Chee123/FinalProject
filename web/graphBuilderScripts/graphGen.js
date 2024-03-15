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

    //ensure error message element exists
function ensureErrorMessageElement() {
  var graphContainer = document.getElementById('graph-container');
  var errorMessageElement = document.getElementById('error-message');

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
  //destroy chart if it exists
  event.preventDefault();
  if (window.myChart && window.myChart.destroy) {
      window.myChart.destroy();
      window.myChart = undefined;
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

  // if error message exists, display it and return
  if (errorMessage) {
    document.getElementById('error-message').textContent = errorMessage;
    document.getElementById('error-message').style.display = 'block';
    return;
  }

  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/UoA?uofaName=${encodeURIComponent(uofA)}`)
  .then(response => response.json())
  .then(data => {
    // filter data based on x and y axis
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


// calculate total doctoral degrees
    function calculateTotalDoctoralDegrees(record) {

      let total = 0;
      for (let year = 2013; year <= 2019; year++) {
        total += parseInt(record['DoctoralDegrees${year}'] || 0, 10);
      }
      return total;
    }

  // highlight specific university function
    function highlightUniversity(uniName) {
      chartData = chartData.map(point => {
        if (point.name.toLowerCase() === uniName.toLowerCase()) {
          return { ...point, color: 'red', zIndex: 100 };
        }
        return point;
      });
    }

  // extract attributes to be plotted
    var xAttribute = xProfOption;
    var yAttribute = yProfOption;

    let chartData = [];
    var uniNameToHighlight = document.getElementById('uniToHighlight').value;

    xAxisFilter.forEach((item) => {
     //find item using Uni name
      const yItem = yAxisFilter.find(y => y.UniversityName === item.UniversityName);
      if (yItem) {

        let xValue, yValue;

        // determine xValue based on xRadioCheck
        if (xRadioCheck === 'profile') {
          xValue = item[xAttribute];
        } else { // 'income'
          xValue = parseInt(item[xAttribute], 10);
        }

        // determine yValue based on yRadioCheck
        if (yRadioCheck === 'profile') {
          yValue = yItem[yAttribute];
        } else{ // 'income'
          console.log('yItem:', yItem);
          yValue = parseInt(yItem[yAttribute], 10);
        }

        // add combined data to chartData
        chartData.push({
          x: xValue,
          y: yValue,
          name: item.UniversityName
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

// set initial max and min values for axis
    if (xRadioCheck === 'profile' && xProfOption === 'AverageScore') {
      xAxisMax = 4;
    }
    else if (xProfOption === 'FourStar' || xProfOption === 'ThreeStar' || xProfOption ==='TwoStar' || xProfOption === 'OneStar' || xProfOption === 'Unclassified' || xProfOption === 'PercEligibleStaff'){
        xAxisMax = 100;
        xAxisMin = 0;
    }
    if (yRadioCheck === 'profile' && yProfOption === 'AverageScore') {
       yAxisMax = 4;
    }
    else if (yProfOption === 'FourStar' || yProfOption === 'ThreeStar' || yProfOption ==='TwoStar' || yProfOption === 'OneStar' || yProfOption === 'Unclassified' || yProfOption === 'PercEligibleStaff'){
        yAxisMax = 100;
        yAxisMin = 0;
    }
  // russel group highlight
    chartData = chartData.map(point => {
      if (russellGroupUniversities.has(point.name)) {

        return highlightRussell ? { ...point, color: 'green', zIndex: 10 } : point;
      }
      return point;
  });
    highlightUniversity(uniNameToHighlight);
    chartData.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

        const xProfOptionText = findOptionText(xRadioCheck === 'profile' ? optionsProfile : optionsIncome, xProfOption);
        const yProfOptionText = findOptionText(yRadioCheck === 'profile' ? optionsProfile : optionsIncome, yProfOption);

        const isProfileAndSameParam = xRadioCheck === 'profile' && yRadioCheck === 'profile' && xProfOption === yProfOption;
        const isIncomeAndSameSource = xRadioCheck === 'income' && yRadioCheck === 'income' && xAxis === yAxis;

        // define list of options for percentage based data
        const percOptionsList = ['PercEligibleStaff', 'FourStar', 'ThreeStar', 'TwoStar', 'OneStar', 'Unclassified'];

        // check if both options are in the list
        const isBothOptionsInList = percOptionsList.includes(xProfOption) && percOptionsList.includes(yProfOption);
// check if the chart should be square
        const shouldBeSquare = isProfileAndSameParam || isIncomeAndSameSource || isBothOptionsInList;

    // get container width
    const containerWidth = document.getElementById('graph-container').clientHeight;

    //
    if (isProfileAndSameParam || isIncomeAndSameSource) {
        let minValue = 0;
        let maxValue;
        let tickInterval;

        // apply specific settings when GPA picked
        if (xProfOption === 'AverageScore' || yProfOption === 'AverageScore') {
            maxValue = 4; // max value as is 0-4
            tickInterval = 1; // fixed interval as 0-4
        } else if (xRadioCheck === 'income' || yRadioCheck === 'income') {
            // handle income data
            let allValues = [...xAxisFilter.map(item => parseFloat(item[xProfOption])), ...yAxisFilter.map(item => parseFloat(item[yProfOption]))];
            maxValue = Math.max(...allValues) * 1.1; // 10% buffer to axis max
            marginBottom = 80;
            maxValue = Math.ceil(maxValue / 1e6) * 1e6; // round to nearest million

            // tick interval based off rounded max value
            tickInterval = maxValue / 5;
        } else if (xProfOption === 'FourStar' || xProfOption === 'ThreeStar' || xProfOption ==='TwoStar' || xProfOption === 'OneStar' || xProfOption === 'Unclassified' || xProfOption === 'PercEligibleStaff'){
                maxValue = 100; // max value as is % based
                minValue = 0;
                tickInterval = 20; // fixed interval as 0-100
        }

        else {
            // for other data types where axis same attribute
            let allValues = [...xAxisFilter.map(item => parseFloat(item[xProfOption])), ...yAxisFilter.map(item => parseFloat(item[yProfOption]))];
            maxValue = Math.max(...allValues) * 1.1; // 10% buffer to axis max
            // calculate tickinterval to aim for 5 ticks
            tickInterval = Math.ceil((maxValue - minValue) / 5);
        }

        // adjusted axis settings based on the conditions
        xAxisMax = maxValue;
        yAxisMax = maxValue;
        xAxisMin = minValue;
        yAxisMin = minValue;
        tickInterval = tickInterval;
    }

    window.myChart = Highcharts.chart('graph-container', {
        chart: {
          type: 'scatter',
          zoomType: 'xy',
          marginBottom: marginBottom, // dynamically adjust margin
          width: shouldBeSquare ? containerWidth : null, // set heigh = width if same params so graph square

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
          min: xAxisMin,// dynamically set max and min
          tickInterval: tickInterval, // dynamically set interval tick
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
          min: yAxisMin, // dynamically set max and min
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
            radius: 3
          }
        }]
    });
})
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

// find text of option based of value
function findOptionText(options, value) {
  const option = options.find(option => option.value === value);
  return option ? option.text : value;
}

function formatNumberAsCurrency(value) {
  return '£' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
