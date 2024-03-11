document.addEventListener('DOMContentLoaded', function() {
    const institutionDropdown = document.getElementById('institution-dropdown'); // Assuming you have this dropdown
    const unitOfAssessmentDropdown = document.getElementById('unit-of-assessment-dropdown');
    const heatmapIframe = document.querySelector('.heatmap-iframe'); // Select the iframe element

    // Function to execute when "Nation" is selected
    function executeForNation() {
        // Check if "Nation" is the selected option
        if (institutionDropdown.value === 'Nation') {
            const selectedUofA = unitOfAssessmentDropdown.value;
            console.log('Nation selected, executing operations for unit of assessment:', selectedUofA);
            const formattedUofA = encodeURIComponent(selectedUofA.replace(/\s+/g, '')) + '_heatmap.html';
            // Set the iframe src here if needed, uncomment the next line if the heatmap should change based on UofA
            // heatmapIframe.src = 'path/to/heatmap/directory/' + formattedUofA;

            // Call your functions here
            fetchTopAndBottomThree(selectedUofA);
            fetchTopThreeFte(selectedUofA);
            fetchIncomeData(selectedUofA);
            fetchOutputsData(selectedUofA);
            fetchAndDisplayNationalAverages(selectedUofA);
            display10v10Data(selectedUofA);
        }
    }
    function handleUoAChange() {
        const selectedUofA = unitOfAssessmentDropdown.value; // Use the value of the option
        if (institutionDropdown.value === 'Nation') {
            console.log('Selected unit of assessment:', selectedUofA);
            const formattedUofA = encodeURIComponent(selectedUofA.replace(/\s+/g, '')) + '_heatmap.html';
            // Set the iframe src here if needed
            // heatmapIframe.src = 'path/to/heatmap/directory/' + formattedUofA;

            // Call your functions here
            fetchTopAndBottomThree(selectedUofA);
            fetchTopThreeFte(selectedUofA);
            fetchIncomeData(selectedUofA);
            fetchOutputsData(selectedUofA);
            fetchAndDisplayNationalAverages(selectedUofA);
            display10v10Data(selectedUofA);
        }
    }


    // Listen for changes in the UoA dropdown
    unitOfAssessmentDropdown.addEventListener('change', handleUoAChange);

    // Listen for changes in the institution dropdown to re-execute operations if "Nation" is selected again
    institutionDropdown.addEventListener('change', executeForNation);

    // Since "Nation" is the default, execute operations on page load
    executeForNation();
});
