function updateBubbleProfIncX() {
  var selectedRadio = document.querySelector('input[name="specialOptionGroupX"]:checked');
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

  // Add new options to bubble2
  optionsBasedOnSelected.forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    axisOptions.appendChild(option);
  });
}

function updateBubbleProfIncY() {
  var selectedRadio = document.querySelector('input[name="specialOptionGroupY"]:checked');
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

  // Add new options to bubble2
  optionsBasedOnSelected.forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    axisOptions.appendChild(option);
  });
}

function updateProfileOptions(containerID,axis) {
  var profile = document.getElementById(axis);
  var container = document.getElementById(containerID);
  // Clear current options in bubble2
  container.innerHTML = '';

  // Determine the options based on bubble1's selection
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
  if(profile.value == 'Environment') {
    optionsProfile = optionsProfile.concat(['Total Doctoral Degrees']);
  }

  // Add new options to bubble2
  optionsProfile.forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    container.appendChild(option);
  });
}
