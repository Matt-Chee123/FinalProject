document.getElementById('UofA').addEventListener('change', function() {
    if (this.value) { // checks if an option is selected
        document.getElementById('graphStep2').style.display = 'block'; // makes Step 2 visible
        document.getElementById('graphStep3').style.display = 'none'; // hide Step 3
        document.getElementById('graphStep4').style.display = 'none'; // hide Step 4

        // Reset Radio Buttons for Step 2
        document.getElementById('profileX').checked = false;
        document.getElementById('incomeX').checked = false;

        // reset dropdowns for Step 2 and hide
        document.getElementById('xAxisLabel').style.display = 'none';
        document.getElementById('xAxis').selectedIndex = 0;
        document.getElementById('xAxis').style.display = 'none';
        document.getElementById('xProfOptions').selectedIndex = 0;
        if (document.getElementById('xProfOptionsLabel')) {
            document.getElementById('xProfOptionsLabel').style.display = 'none';
        }

        document.getElementById('xProfOptions').style.display = 'none';

        //reset for step 3
        document.getElementById('profileY').checked = false;
        document.getElementById('incomeY').checked = false;

        document.getElementById('yAxisLabel').style.display = 'none';
        document.getElementById('yAxis').selectedIndex = 0;
        document.getElementById('yAxis').style.display = 'none';
        document.getElementById('yProfOptions').selectedIndex = 0;
        if (document.getElementById('yProfOptionsLabel')) {
            document.getElementById('yProfOptionsLabel').style.display = 'none';
        }
        document.getElementById('yProfOptions').style.display = 'none';

        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;
        document.getElementById('uniToHighlight').value = '';
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
    }
});


document.getElementById('xProfOptions').addEventListener('change', function() {
  if (this.value) { // checks if an option is selected
        document.getElementById('graphStep3').style.display = 'block'; // make Step 3 visible
        document.getElementById('graphStep4').style.display = 'none'; // hide Step 4
        //reset for step 3
        document.getElementById('profileY').checked = false;
        document.getElementById('incomeY').checked = false;

        document.getElementById('yAxisLabel').style.display = 'none';
        document.getElementById('yAxis').selectedIndex = 0;
        document.getElementById('yAxis').style.display = 'none';
        document.getElementById('yProfOptions').selectedIndex = 0;
        if (document.getElementById('yProfOptionsLabel')) {
            document.getElementById('yProfOptionsLabel').style.display = 'none';
        }
        document.getElementById('yProfOptions').style.display = 'none';

        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;
        document.getElementById('uniToHighlight').value = '';
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
  }
});

document.getElementById('xAxis').addEventListener('change', function() {
  if (this.value) { // Checks if an option is selected

        //reset step 3 and 4
        document.getElementById('graphStep3').style.display = 'none';
        document.getElementById('graphStep4').style.display = 'none';
        document.getElementById('profileY').checked = false;
        document.getElementById('incomeY').checked = false;

        document.getElementById('yAxisLabel').style.display = 'none';
        document.getElementById('yAxis').selectedIndex = 0;
        document.getElementById('yAxis').style.display = 'none';
        document.getElementById('yProfOptions').selectedIndex = 0;
        if (document.getElementById('yProfOptionsLabel')) {
            document.getElementById('yProfOptionsLabel').style.display = 'none';
        }
        document.getElementById('yProfOptions').style.display = 'none';

        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;
        document.getElementById('uniToHighlight').value = '';
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
  }
});

document.getElementById('yAxis').addEventListener('change', function() {
  if (this.value) { // checks if an option is selected
    document.getElementById('graphStep4').style.display = 'none'; // makes Step 4 invisible
        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;
        document.getElementById('uniToHighlight').value = '';

        // hide suggestions container
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
  }
});

document.getElementById('yProfOptions').addEventListener('change', function() {
  if (this.value) { // checks if an option is selected
    document.getElementById('graphStep4').style.display = 'block'; //  Step 4 visible
        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;
  }
});

