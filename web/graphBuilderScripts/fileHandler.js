
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

  // Identify or create the label element for the dropdown
  var labelId = containerID + 'Label'; // Construct a label ID based on the container ID
  console.log(labelId);
  var label = document.getElementById(labelId);

  // If the label doesn't exist, create it
  if (!label) {
    label = document.createElement('label');
    label.setAttribute('id', labelId);
    label.setAttribute('for', containerID); // Ensure the 'for' attribute matches the container's ID for accessibility
    // Place the label before the container or wherever it fits best in your layout
    container.parentNode.insertBefore(label, container);
  }

  // Check if a valid profile or income source is selected
  if (profile.value) {
    // Make the container visible if a valid option is selected
    container.style.display = 'block';
    // Update the label text to "Attribute to Plot:"
    label.textContent = 'Attribute:';
    label.style.display = 'block'; // Ensure the label is visible

    // Clear current options in the container
    container.innerHTML = '';

    // Determine the options based on the selected profile or income source
    console.log(profile.value);
    var optionsProfile = [
      'AverageScore',
      'FTEOfSubmittedStaff',
      'PercEligibleStaff',
      'FourStar',
      'ThreeStar',
      'TwoStar',
      'OneStar',
      'Unclassified'
    ];

    var optionsIncome = [
      'TotalIncome1320',
      'AverageIncome1320',
      'AverageIncome1520',
      'Income201314',
      'Income201415',
    ];

    var selectedOptions;
    if (['Overall', 'Outputs', 'Impact', 'Environment'].includes(profile.value)) {
      selectedOptions = optionsProfile;
    } else {
      selectedOptions = optionsIncome;
    }

    // Add a default "Please select" option
    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Please select...";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    container.appendChild(defaultOption);

    // Populate the container with the new options
    selectedOptions.forEach(function(optionText) {
      var option = document.createElement('option');
      option.value = optionText;
      option.text = optionText;
      container.appendChild(option);
    });
  } else {
    // Hide the container and the label if no valid profile or income source is selected
    container.style.display = 'none';
    label.style.display = 'none'; // Hide the label as well
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