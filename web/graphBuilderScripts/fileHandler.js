
function updateVisibilityY() {
  var profileSelected = document.getElementById('profileY').checked;
  var xProfOptions = document.getElementById('yProfOptions');

  // Toggle the display based on whether the "Profile" radio is selected
  xProfOptions.style.display = profileSelected ? 'block' : 'none';
}

async function updateBubbleProfIncX() {
  // Making xAxisLabel and xAxis visible
  document.getElementById('graphStep3').style.display = 'none';
  document.getElementById('graphStep4').style.display = 'none';
  document.getElementById('xAxisLabel').style.display = 'block';
  document.getElementById('xAxis').style.display = 'block';
  document.getElementById('xProfOptions').style.display = 'none';
  if (document.getElementById('xProfOptionsLabel')) {
      document.getElementById('xProfOptionsLabel').style.display = 'none';
  }
  document.getElementById('profileY').checked = false;
  document.getElementById('incomeY').checked = false;
  document.getElementById('yAxisLabel').style.display = 'none';
  document.getElementById('yAxis').selectedIndex = 0; // Resets to the first option
  document.getElementById('yAxis').style.display = 'none'; // Hides the dropdown (if you want to hide it initially)
  // Assuming the first option is your placeholder or default option
  document.getElementById('yProfOptions').selectedIndex = 0; // Resets to "Profile Options"
  if (document.getElementById('yProfOptionsLabel')) { // Checks if an option is selected
     document.getElementById('yProfOptionsLabel').style.display = 'none'; // Makes Step 3 visible
  }
  document.getElementById('yProfOptions').style.display = 'none';

  var selectedRadio = document.querySelector('input[name="specialOptionGroupX"]:checked');
  var selectedValue = selectedRadio.value;
  var label = document.getElementById('xAxisLabel');

  label.textContent = selectedValue === 'profile' ? 'Profile:' : 'Income:';

  var UofA = document.getElementById('UofA').value; // Use the value of UofA selection
  var axisOptions = document.getElementById('xAxis');
  console.log(axisOptions);
  var optionsBasedOnSelected = [];

  if (selectedValue === 'profile') {
    // For 'profile', use predefined options
    optionsBasedOnSelected = ['Overall', 'Impact', 'Outputs', 'Environment'];
    updateAxisOptions(axisOptions, optionsBasedOnSelected, selectedValue);
  } else {
    // For 'income', fetch options based on the UofA
    optionsBasedOnSelected = await fetchIncomeSources(UofA);
    updateAxisOptions(axisOptions, optionsBasedOnSelected, selectedValue);
  }
}

async function updateBubbleProfIncY() {
  document.getElementById('graphStep4').style.display = 'none';
  document.getElementById('yAxisLabel').style.display = 'block';
  document.getElementById('yAxis').style.display = 'block';
  document.getElementById('yProfOptions').style.display = 'none';
  if (document.getElementById('yProfOptionsLabel')) {
    document.getElementById('yProfOptionsLabel').style.display = 'none';
  }

  var selectedRadio = document.querySelector('input[name="specialOptionGroupY"]:checked');
  var selectedValue = selectedRadio.value;
  var label = document.getElementById('yAxisLabel');

  label.textContent = selectedValue === 'profile' ? 'Profile:' : 'Income:';

  var UofA = document.getElementById('UofA').value; // Use the value of UofA selection
  var axisOptions = document.getElementById('yAxis');
  var optionsBasedOnSelected = [];

  if (selectedValue === 'profile') {
    // For 'profile', use predefined options
    optionsBasedOnSelected = ['Overall', 'Impact', 'Outputs', 'Environment'];
    updateAxisOptions(axisOptions, optionsBasedOnSelected, selectedValue);
  } else {
    // For 'income', fetch options based on the UofA
    optionsBasedOnSelected = await fetchIncomeSources(UofA);
    updateAxisOptions(axisOptions, optionsBasedOnSelected, selectedValue);
  }
}

// Bind the update function to the change event of radio buttons
document.querySelectorAll('input[name="specialOptionGroupY"]').forEach(radio => {
  radio.addEventListener('change', updateBubbleProfIncY);
});


function updateProfileOptions(containerID, axis) {
  var profile = document.getElementById(axis);
  var container = document.getElementById(containerID);

  var labelId = containerID + 'Label';
  var label = document.getElementById(labelId);

  if (!label) {
    label = document.createElement('label');
    label.setAttribute('id', labelId);
    label.setAttribute('for', containerID);
    container.parentNode.insertBefore(label, container);
  }

  if (profile.value) {
    container.style.display = 'block';
    label.textContent = 'Attribute:';
    label.style.display = 'block';

    container.innerHTML = '';

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

    var selectedOptions;
    if (['Overall', 'Outputs', 'Impact', 'Environment'].includes(profile.value)) {
      selectedOptions = optionsProfile;
    } else {
      selectedOptions = optionsIncome;
    }

    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Please select...";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    container.appendChild(defaultOption);

    selectedOptions.forEach(function(option) {
      var optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.text = option.text;
      container.appendChild(optionElement);
    });
  } else {
    container.style.display = 'none';
    label.style.display = 'none';
  }
}


async function fetchIncomeSources(UofA) {
  try {
    const response = await fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/allIncomes?uofaName=${encodeURIComponent(UofA)}`);
    if (response.ok) {
      const items = await response.json();
      console.log(items);
      return [...new Set(items.map(item => item.IncomeSource))]; // Extract and filter unique income sources
    } else {
      console.error('Failed to fetch data:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching income sources:', error);
    return [];
  }
}

function updateAxisOptions(axisOptions, optionsBasedOnSelected, selectedValue) {
  // Clear current options in yAxis dropdown
  axisOptions.innerHTML = '';
  var placeholderOption = document.createElement('option');
  placeholderOption.value = "";
  if (selectedValue === 'profile') {
    placeholderOption.text = "Please select a profile";
  }
    else {
        placeholderOption.text = "Please select an income";
    }
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  axisOptions.appendChild(placeholderOption);

  // Populate dropdown with new options
  optionsBasedOnSelected.forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    axisOptions.appendChild(option);
  });
}