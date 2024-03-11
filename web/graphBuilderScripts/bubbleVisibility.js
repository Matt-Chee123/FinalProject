document.getElementById('UofA').addEventListener('change', function() {
    if (this.value) { // Checks if an option is selected
        // Show/Hide Steps
        document.getElementById('graphStep2').style.display = 'block'; // Makes Step 2 visible
        document.getElementById('graphStep3').style.display = 'none'; // Hide Step 3
        document.getElementById('graphStep4').style.display = 'none'; // Hide Step 4

        // Reset Radio Buttons for Step 2
        document.getElementById('profileX').checked = false;
        document.getElementById('incomeX').checked = false;

        // Reset Dropdowns for Step 2
        document.getElementById('xAxisLabel').style.display = 'none'; // Hides the label (if you want to hide it initially)
        document.getElementById('xAxis').selectedIndex = 0; // Resets to the first option
        document.getElementById('xAxis').style.display = 'none'; // Hides the dropdown (if you want to hide it initially)
        // Assuming the first option is your placeholder or default option
        document.getElementById('xProfOptions').selectedIndex = 0; // Resets to "Profile Options"
        if (document.getElementById('xProfOptionsLabel')) { // Checks if an option is selected
            document.getElementById('xProfOptionsLabel').style.display = 'none'; // Makes Step 3 visible
        }

        // Optionally, if you want to hide 'xProfOptions' dropdown initially
        document.getElementById('xProfOptions').style.display = 'none';

        //reset for step 3
        document.getElementById('profileY').checked = false;
        document.getElementById('incomeY').checked = false;


        document.getElementById('yAxisLabel').style.display = 'none'; // Hides the label (if you want to hide it initially)
        document.getElementById('yAxis').selectedIndex = 0; // Resets to the first option
        document.getElementById('yAxis').style.display = 'none'; // Hides the dropdown (if you want to hide it initially)
        // Assuming the first option is your placeholder or default option
        document.getElementById('yProfOptions').selectedIndex = 0; // Resets to "Profile Options"
        if (document.getElementById('yProfOptionsLabel')) { // Checks if an option is selected
            document.getElementById('yProfOptionsLabel').style.display = 'none'; // Makes Step 3 visible
        }
        document.getElementById('yProfOptions').style.display = 'none';

        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;

        // Reset Input Field for Step 4
        document.getElementById('uniToHighlight').value = '';

        // Hide suggestions container if you're using it dynamically
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
    }
});


document.getElementById('xProfOptions').addEventListener('change', function() {
  if (this.value) { // Checks if an option is selected
        document.getElementById('graphStep3').style.display = 'block'; // Makes Step 3 visible
        document.getElementById('graphStep4').style.display = 'none'; // Hide Step 4
        //reset for step 3
        document.getElementById('profileY').checked = false;
        document.getElementById('incomeY').checked = false;

        document.getElementById('yAxisLabel').style.display = 'none'; // Hides the label (if you want to hide it initially)
        document.getElementById('yAxis').selectedIndex = 0; // Resets to the first option
        document.getElementById('yAxis').style.display = 'none'; // Hides the dropdown (if you want to hide it initially)
        // Assuming the first option is your placeholder or default option
        document.getElementById('yProfOptions').selectedIndex = 0; // Resets to "Profile Options"
        if (document.getElementById('yProfOptionsLabel')) { // Checks if an option is selected
            document.getElementById('yProfOptionsLabel').style.display = 'none'; // Makes Step 3 visible
        }
        document.getElementById('yProfOptions').style.display = 'none';

        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;

        // Reset Input Field for Step 4
        document.getElementById('uniToHighlight').value = '';

        // Hide suggestions container if you're using it dynamically
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
  }
});

document.getElementById('xAxis').addEventListener('change', function() {
  if (this.value) { // Checks if an option is selected
        document.getElementById('graphStep3').style.display = 'none';
        document.getElementById('graphStep4').style.display = 'none';
        document.getElementById('profileY').checked = false;
        document.getElementById('incomeY').checked = false;

        document.getElementById('yAxisLabel').style.display = 'none'; // Hides the label (if you want to hide it initially)
        document.getElementById('yAxis').selectedIndex = 0; // Resets to the first option
        document.getElementById('yAxis').style.display = 'none'; // Hides the dropdown (if you want to hide it initially)
        // Assuming the first option is your placeholder or default option
        document.getElementById('yProfOptions').selectedIndex = 0; // Resets to "Profile Options"
        if (document.getElementById('yProfOptionsLabel')) { // Checks if an option is selected
            document.getElementById('yProfOptionsLabel').style.display = 'none'; // Makes Step 3 visible
        }
        document.getElementById('yProfOptions').style.display = 'none';

        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;

        // Reset Input Field for Step 4
        document.getElementById('uniToHighlight').value = '';

        // Hide suggestions container if you're using it dynamically
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
  }
});

document.getElementById('yAxis').addEventListener('change', function() {
  if (this.value) { // Checks if an option is selected
    document.getElementById('graphStep4').style.display = 'none'; // Makes Step 4 visible
        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;
        // Reset Input Field for Step 4
        document.getElementById('uniToHighlight').value = '';

        // Hide suggestions container if you're using it dynamically
        document.getElementById('highlightSuggestionsContainer').style.display = 'none';
  }
});

document.getElementById('yProfOptions').addEventListener('change', function() {
  if (this.value) { // Checks if an option is selected
    document.getElementById('graphStep4').style.display = 'block'; // Makes Step 4 visible
        //reset step 4
        document.getElementById('highlightRussellGroup').checked = false;
  }
});

// Note: No listener for step4Select as it's the last step and there's nothing to unhide afterwards
