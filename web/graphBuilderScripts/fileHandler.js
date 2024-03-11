function updateBubbleProfIncX() {
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

  if (selectedValue == 'profile') {
    label.textContent = 'Profile:';
  } else if (selectedValue == 'income') {
    label.textContent = 'Income:';
  }

  var UofA = document.getElementById('UofA').value; // Assuming you have a select element with id 'UofA'
  console.log(UofA);
  var axisOptions = document.getElementById('xAxis');

  // Clear current options in xAxis
  axisOptions.innerHTML = '';

  // Determine the options based on the selection
  var optionsBasedOnSelected = [];
  console.log(selectedRadio.value);
  if(selectedRadio.value == 'profile') {
    optionsBasedOnSelected = ['Overall', 'Impact', 'Outputs', 'Environment'];
  } else if(UofA == 'Computer Science and Informatics') {
    optionsBasedOnSelected = [
      'Total income',
      'BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh',
      'UK-based charities (open competitive process)',
      'UK-based charities (other)',
      'UK central government bodies/local authorities, health and hospital authorities',
      'UK central government tax credits for research and development expenditure',
      'UK industry, commerce and public corporations',
      'UK other sources',
      'EU government bodies',
      'EU-based charities (open competitive process)',
      'EU industry, commerce and public corporations',
      'EU (excluding UK) other',
      'Non-EU-based charities (open competitive process)',
      'Non-EU industry commerce and public corporations',
      'Non-EU other'
    ];
  } else if(UofA == 'Clinical Medicine') {
    optionsBasedOnSelected = [
      "BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh",
      "UK-based charities (open competitive process)",
      "UK-based charities (other)",
      "UK central government bodies/local authorities, health and hospital authorities",
      "Health research funding bodies",
      "UK central government tax credits for research and development expenditure",
      "UK industry, commerce and public corporations",
      "UK other sources",
      "EU government bodies",
      "EU-based charities (open competitive process)",
      "EU industry, commerce and public corporations",
      "EU (excluding UK) other",
      "Non-EU-based charities (open competitive process)",
      "Non-EU industry commerce and public corporations",
      "Non-EU other",
      "Total income"
    ];
  } else if(UofA == 'Law') {
    optionsBasedOnSelected = [
      "BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh",
      "UK-based charities (open competitive process)",
      "UK-based charities (other)",
      "UK central government bodies/local authorities, health and hospital authorities",
      "UK central government tax credits for research and development expenditure",
      "UK industry, commerce and public corporations",
      "UK other sources",
      "EU government bodies",
      "EU-based charities (open competitive process)",
      "EU industry, commerce and public corporations",
      "EU (excluding UK) other",
      "Non-EU-based charities (open competitive process)",
      "Non-EU industry commerce and public corporations",
      "Non-EU other",
      "Total income"
    ];
  }
  var placeholderOption = document.createElement('option');
  placeholderOption.value = "";
  placeholderOption.text = selectedValue === 'profile' ? 'Pick Profile' : 'Pick Income Source';
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  axisOptions.appendChild(placeholderOption);
  console.log(optionsBasedOnSelected);
  // Add new options
  optionsBasedOnSelected.forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    axisOptions.appendChild(option);
  });
}
function updateVisibilityY() {
  var profileSelected = document.getElementById('profileY').checked;
  var xProfOptions = document.getElementById('yProfOptions');

  // Toggle the display based on whether the "Profile" radio is selected
  xProfOptions.style.display = profileSelected ? 'block' : 'none';
}


function updateBubbleProfIncY() {
  // Make yAxisLabel and yAxis visible upon selection
  document.getElementById('graphStep4').style.display = 'none';
  document.getElementById('yAxisLabel').style.display = 'block';
  document.getElementById('yAxis').style.display = 'block';
  document.getElementById('yProfOptions').style.display = 'none'; // Assuming there's a yProfOptions similar to xProfOptions
  if (document.getElementById('yProfOptionsLabel')) {
      document.getElementById('yProfOptionsLabel').style.display = 'none';
  }

  var selectedRadio = document.querySelector('input[name="specialOptionGroupY"]:checked');
  var selectedValue = selectedRadio.value;
  var label = document.getElementById('yAxisLabel');

  // Update label text based on the selected radio button
  if (selectedValue == 'profile') {
    label.textContent = 'Profile:';
  } else if (selectedValue == 'income') {
    label.textContent = 'Income:';
  }

  var UofA = document.getElementById('UofA').value; // Use the value of UofA selection
  var axisOptions = document.getElementById('yAxis');

  // Clear current options in yAxis dropdown
  axisOptions.innerHTML = '';
  // Determine the options based on bubble1's selection
  var optionsBasedOnSelected = []; // You would fill this array based on bubble1's value
  if(selectedRadio.value == 'profile') {
    optionsBasedOnSelected = ['Overall', 'Impact', 'Outputs', 'Environment'];
  } else if(UofA == 'Computer Science and Informatics') {
    optionsBasedOnSelected = [
      'Total income',
      'BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh',
      'UK-based charities (open competitive process)',
      'UK-based charities (other)',
      'UK central government bodies/local authorities, health and hospital authorities',
      'UK central government tax credits for research and development expenditure',
      'UK industry, commerce and public corporations',
      'UK other sources',
      'EU government bodies',
      'EU-based charities (open competitive process)',
      'EU industry, commerce and public corporations',
      'EU (excluding UK) other',
      'Non-EU-based charities (open competitive process)',
      'Non-EU industry commerce and public corporations',
      'Non-EU other'
    ];
  } else if(UofA == 'Clinical Medicine') {
    optionsBasedOnSelected = [
      "BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh",
      "UK-based charities (open competitive process)",
      "UK-based charities (other)",
      "UK central government bodies/local authorities, health and hospital authorities",
      "Health research funding bodies",
      "UK central government tax credits for research and development expenditure",
      "UK industry, commerce and public corporations",
      "UK other sources",
      "EU government bodies",
      "EU-based charities (open competitive process)",
      "EU industry, commerce and public corporations",
      "EU (excluding UK) other",
      "Non-EU-based charities (open competitive process)",
      "Non-EU industry commerce and public corporations",
      "Non-EU other",
      "Total income"
    ];
  } else if(UofA == 'Law') {
    optionsBasedOnSelected = [
      "BEIS Research Councils, The Royal Society, British Academy and The Royal Society of Edinburgh",
      "UK-based charities (open competitive process)",
      "UK-based charities (other)",
      "UK central government bodies/local authorities, health and hospital authorities",
      "UK central government tax credits for research and development expenditure",
      "UK industry, commerce and public corporations",
      "UK other sources",
      "EU government bodies",
      "EU-based charities (open competitive process)",
      "EU industry, commerce and public corporations",
      "EU (excluding UK) other",
      "Non-EU-based charities (open competitive process)",
      "Non-EU industry commerce and public corporations",
      "Non-EU other",
      "Total income"
    ];
  }
  var placeholderOption = document.createElement('option');
  placeholderOption.value = "";
  placeholderOption.text = selectedValue === 'profile' ? 'Pick Profile' : 'Pick Income Source';
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

// Assuming you have radio buttons similar to those for X axis, with 'specialOptionGroupY' as their name
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
