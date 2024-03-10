document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('unit-of-assessment-dropdown');
    const heatmapIframe = document.querySelector('.heatmap-iframe'); // Select the iframe element

    dropdown.addEventListener('change', function() {
        const selectedUofA = this.value; // Use the value of the option
        console.log('Selected unit of assessment:', selectedUofA);
        // Convert the selected text to a format that matches the heatmap file names
       const formattedUofA = encodeURIComponent(selectedUofA.replace(/\s+/g, '')) + '_heatmap.html';
  //      heatmapIframe.src = formattedUofA; // Set the correct path to the heatmap file

        fetchTopThree(selectedUofA);
        fetchBottomThree(selectedUofA);
        fetchThreeFte(selectedUofA);
        fetchIncomeData(selectedUofA);
        fetchOutputsData(selectedUofA);
        fetchAndDisplayNationalAverages(selectedUofA);


    });

    // Trigger the initial load for the default selection.
    const initialUofA = dropdown.value; // Use the value of the initial option
    const formattedInitialUofA = encodeURIComponent(initialUofA.replace(/\s+/g, '')) + '_heatmap.html';
//    heatmapIframe.src = formattedInitialUofA;
    fetchTopThree(initialUofA);
    fetchBottomThree(initialUofA);
    fetchThreeFte(initialUofA);
    fetchIncomeData(initialUofA);
    fetchOutputsData(initialUofA);
    fetchAndDisplayNationalAverages(initialUofA);
    // Initialize other components as needed.
});
