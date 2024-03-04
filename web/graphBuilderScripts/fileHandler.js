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

  // Check if a valid profile or income source is selected
  if (profile.value) {
    // Make the container visible if a valid option is selected
    container.style.display = 'block';

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
    ]

    // Example condition to add additional options for a specific profile
    if (profile.value == 'Environment') {
      optionsProfile = optionsProfile.concat(['Total Doctoral Degrees']);
    }

    if (profile.value == 'Overall' || profile.value == 'Outputs' || profile.value == 'Impact' || profile.value == 'Environment') {
      var selectedOptions = optionsProfile;
    } else {
      var selectedOptions = optionsIncome;
    }
    // Add a default "Please select" option or similar as the first option
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
    // Hide the container if no valid profile or income source is selected
    container.style.display = 'none';
  }
}

