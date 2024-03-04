function updateBubbleProfIncX() {
  var selectedRadio = document.querySelector('input[name="specialOptionGroupX"]:checked');
  var selectedValue = document.querySelector('input[name="specialOptionGroupX"]:checked').value;
  var label = document.getElementById('xAxisLabel');
  if (selectedValue == 'profile') {
    label.textContent = 'Profile:';
    } else if (selectedValue == 'income') {
    label.textContent = 'Income Source:';
    }
  var UofA = document.getElementById('UofA');
  var axisOptions = document.getElementById('xAxis');
  // Clear current options in bubble2
  axisOptions.innerHTML = '';
  // Determine the options based on bubble1's selection
  var optionsBasedOnSelected = []; // You would fill this array based on bubble1's value
  if(selectedRadio.value == 'profile') {
    optionsBasedOnSelected = ['Overall', 'Impact', 'Outputs', 'Environment'];
  } else if(UofA.value == 'Computer Science and Informatics') {
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
  } else if(UofA.value == 'Clinical Medicine') {
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
  } else if(UofA.value == 'Law') {
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

  // Add new options to bubble2
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
  var selectedRadio = document.querySelector('input[name="specialOptionGroupY"]:checked');
  var selectedValue = document.querySelector('input[name="specialOptionGroupY"]:checked').value;
  var label = document.getElementById('yAxisLabel');
  if (selectedValue == 'profile') {
    label.textContent = 'Profile:';
    } else if (selectedValue == 'income') {
    label.textContent = 'Income Source:';
    }
  var UofA = document.getElementById('UofA');
  var axisOptions = document.getElementById('yAxis');
  // Clear current options in bubble2
  axisOptions.innerHTML = '';
  // Determine the options based on bubble1's selection
  var optionsBasedOnSelected = []; // You would fill this array based on bubble1's value
  if(selectedRadio.value == 'profile') {
    optionsBasedOnSelected = ['Overall', 'Impact', 'Outputs', 'Environment'];
  } else if(UofA.value == 'Computer Science and Informatics') {
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
  } else if(UofA.value == 'Clinical Medicine') {
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
  } else if(UofA.value == 'Law') {
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

  // Add new options to bubble2
  optionsBasedOnSelected.forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    axisOptions.appendChild(option);
  });
}

function updateProfileOptions(containerID, axis) {
  var profile = document.getElementById(axis);
  var container = document.getElementById(containerID);

  // Identify or create the label element for the dropdown
  var labelId = containerID + 'Label'; // Construct a label ID based on the container ID
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
    label.textContent = 'Plot Attribute:';
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
