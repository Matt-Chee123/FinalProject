

document.addEventListener('DOMContentLoaded', () => {
  const institutionDropdown = document.getElementById('institution-dropdown');
  const unitOfAssessmentDropdown = document.getElementById('unit-of-assessment-dropdown');
  const homepageSection = document.getElementById('homepage-section');
  const institutionSection = document.getElementById('institution-section');
  const defaultUnitOfAssessment = 'Computer Science and Informatics';

  // Listen for changes on the institution dropdown
  institutionDropdown.addEventListener('change', () => {
    const selectedUniversity = institutionDropdown.value;
  // Only proceed if the selected university is not "Nation"
    if (selectedUniversity !== 'Nation') {
      manageSectionsDisplay(selectedUniversity);
      fetchUnitOfAssessmentNames(selectedUniversity, unitOfAssessmentDropdown.value, () => {
        const newSelectedUoA = unitOfAssessmentDropdown.value;
      // Fetch and display results for the newly validated UoA
        fetchAndDisplayResults(selectedUniversity, newSelectedUoA);
      });
    } else {
    // Handle the case where "Nation" is selected, for example:
      manageSectionsDisplay(selectedUniversity); // This might show the homepage section and hide the institution section
    // Optionally, reset the unit of assessment dropdown or perform other necessary clean-up
    // You may want to fetch the default or initial set of data for "Nation" if needed here
    }
  });
  unitOfAssessmentDropdown.addEventListener('change', handleUoAChange);

});
function manageSectionsDisplay(selectedUniversity) {
  const homepageSection = document.getElementById('homepage-section');
  const institutionSection = document.getElementById('institution-section');
  if (selectedUniversity === 'Nation') {
    homepageSection.style.display = 'block';
    institutionSection.style.display = 'none';
  } else {
    homepageSection.style.display = 'none';
    institutionSection.style.display = 'block';
  }
}

function handleUoAChange() {
  const selectedUniversity = document.getElementById('institution-dropdown').value;
  // Proceed only if the selected university is not "Nation"
  if (selectedUniversity !== 'Nation') {
    const newSelectedUoA = document.getElementById('unit-of-assessment-dropdown').value;
    // Fetch and display results for the newly selected UoA
    fetchAndDisplayResults(selectedUniversity, newSelectedUoA);
  }
}

function fetchUnitOfAssessmentNames(universityName, currentUoA, callback) {
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/university?UniversityName=${encodeURIComponent(universityName)}`)
    .then(response => response.json())
    .then(unitOfAssessmentNames => {
      populateUoADropdown(unitOfAssessmentNames, currentUoA);
      if (callback) callback();
    })
    .catch(error => console.error('Failed to load unit of assessment names:', error));
}

function populateUoADropdown(unitOfAssessmentNames, currentUoA) {
  const dropdown = document.getElementById('unit-of-assessment-dropdown');
  dropdown.length = 0; // Clear existing options
  let foundCurrentUoA = false;

  unitOfAssessmentNames.forEach(name => {
    const option = new Option(name, name);
    dropdown.add(option);
    if (name === currentUoA) {
      option.selected = true;
      foundCurrentUoA = true;
    }
  });

    // If the current UoA wasn't found, select the first available UoA
  if (!foundCurrentUoA && dropdown.options.length > 1) {
    dropdown.options[1].selected = true; // This selects the first available UoA
  }
}

function fetchAndDisplayResults(universityName, unitOfAssessment) {
  return fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/search?query=${encodeURIComponent(universityName)}&unitOfAssessment=${encodeURIComponent(unitOfAssessment)}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      displaySearchResults(data);
      displayIncomeChart(data);
      displayIncomeDist(data);
      displayRankData(data,unitOfAssessment);
      fetchFTEIncomeData(data,unitOfAssessment);
      fetchOutputsandIncome(data,unitOfAssessment);
      fetchEnvironmentAverages(unitOfAssessment).then(averages => {
       // Once the averages data is retrieved, display the doctoral degrees chart
        displayDoctoralDegreesChart(data, averages);
      });
    })
    .catch(error => console.error('Error fetching search results:', error));
}
