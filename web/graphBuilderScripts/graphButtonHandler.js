//page load event listener
document.addEventListener('DOMContentLoaded', () => {
  const createGraphButton = document.getElementById('create-graph-button');
  const titleText = document.getElementById('title-text');
  const institutionDropdown = document.getElementById('institution-dropdown');
  const unitOfAssessmentDropdown = document.getElementById('unit-of-assessment-dropdown');
  const institutionLabel = document.querySelector('.home-content > .text:nth-child(3)');
  const uoaLabel = document.querySelector('.home-content > .text:nth-child(5)');
  const homepageSection = document.getElementById('homepage-section');
  const institutionSection = document.getElementById('institution-section');
  const graphBuilderContainer = document.getElementById('graph-section');

  // elements to hide/show
  const elementsToHide = [createGraphButton, institutionDropdown, unitOfAssessmentDropdown];

  const backButton = document.getElementById('back-button');
  const clearGraphButton = document.getElementById('clear-graph-button');

  //create graph button event listener
  createGraphButton.addEventListener('click', () => {
    // hide elements
    elementsToHide.forEach(element => element.style.display = 'none');

    // change title text
    titleText.textContent = 'Graph Builder';

    // show back button and clear graph button
    backButton.style.display = 'block';
    clearGraphButton.style.display = 'block';
    createGraphButton.style.display = 'none';
    homepageSection.style.display = 'none';
    institutionSection.style.display = 'none';

    // show the graph page
    graphBuilderContainer.style.display = 'block';
  });

  // event listener for the back button
  backButton.addEventListener('click', () => {
    // Show elements
    elementsToHide.forEach(element => element.style.display = 'block');

    // change title text
    titleText.textContent = 'REF2021 - Nation Overview';
    document.getElementById('institution-dropdown').value = "Nation";

    document.getElementById('unit-of-assessment-dropdown').value = "Computer Science and Informatics";

    // hide back button
    backButton.style.display = 'none';
    clearGraphButton.style.display = 'none';
    createGraphButton.style.display = 'block';
    //show homepage section
    homepageSection.style.display = 'block';

    // hide the graph builder
    graphBuilderContainer.style.display = 'none';
  });

// event listener for the clear graph button
  clearGraphButton.addEventListener('click', () => {
      if (window.myChart && window.myChart.destroy) {
          window.myChart.destroy();
          window.myChart = undefined;
      }
      document.getElementById('UofA').selectedIndex = 0;

      //hide step2 and clear selected
      document.getElementById('graphStep2').style.display = 'none';
      document.querySelector('input[name="specialOptionGroupX"]:checked').checked = false;
      document.getElementById('xAxis').selectedIndex = 0;
      document.getElementById('xAxisLabel').style.display = 'none';
      document.getElementById('xAxis').style.display = 'none';
      document.getElementById('xProfOptions').style.display = 'none';
      document.getElementById('xProfOptionsLabel').style.display = 'none';

      //hide step3 and clear selected
      document.getElementById('graphStep3').style.display = 'none';
      document.querySelector('input[name="specialOptionGroupY"]:checked').checked = false;
      document.getElementById('yAxis').selectedIndex = 0;
      document.getElementById('yAxisLabel').style.display = 'none';
      document.getElementById('yAxis').style.display = 'none';
      document.getElementById('yProfOptions').style.display = 'none';
      document.getElementById('yProfOptionsLabel').style.display = 'none';

    //hide step4
      document.getElementById('graphStep4').style.display = 'none';
  });
});
