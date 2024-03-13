document.addEventListener('DOMContentLoaded', () => {
  const createGraphButton = document.getElementById('create-graph-button');
  const titleText = document.getElementById('title-text');
  const institutionDropdown = document.getElementById('institution-dropdown');
  const unitOfAssessmentDropdown = document.getElementById('unit-of-assessment-dropdown');
  const institutionLabel = document.querySelector('.home-content > .text:nth-child(3)'); // Assuming it is the 3rd child
  const uoaLabel = document.querySelector('.home-content > .text:nth-child(5)'); // Assuming it is the 5th child
  const homepageSection = document.getElementById('homepage-section');
  const institutionSection = document.getElementById('institution-section');
  const graphBuilderContainer = document.getElementById('graph-section'); // Assuming this is the container for the graph builder

  // Elements to hide/show
  const elementsToHide = [createGraphButton, institutionDropdown, unitOfAssessmentDropdown];

  // Back button (assuming you have an element with the ID 'back-button')
  const backButton = document.getElementById('back-button'); // Make sure to add this button in your HTML

  createGraphButton.addEventListener('click', () => {
    // Hide elements
    elementsToHide.forEach(element => element.style.display = 'none');

    // Change title text
    titleText.textContent = 'Graph Builder';

    // Show back button
    backButton.style.display = 'block';

    homepageSection.style.display = 'none';
    institutionSection.style.display = 'none';

    // Show the graph builder
    graphBuilderContainer.style.display = 'block';
  });

  // Event listener for the back button
  backButton.addEventListener('click', () => {
    // Show elements
    elementsToHide.forEach(element => element.style.display = 'block');

    // Revert title text
    titleText.textContent = 'REF2021 - Nation Overview';
    document.getElementById('unit-of-assessment-dropdown').value = "Computer Science and Informatics";
    document.getElementById('institution-dropdown').value = "Nation";

    // Hide back button
    backButton.style.display = 'none';

    // Show other sections
    homepageSection.style.display = 'block';

    // Hide the graph builder
    graphBuilderContainer.style.display = 'none';
  });

  // If you have other buttons to show other sections, add event listeners to them in a similar way
});
