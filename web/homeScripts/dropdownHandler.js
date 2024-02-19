document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('unit-of-assessment-dropdown');

    dropdown.addEventListener('change', function() {
        const selectedUofA = this.options[this.selectedIndex].text;
        console.log('Selected unit of assessment:', selectedUofA);
        // Assuming fetchTopThree and fetchBottomThree are globally accessible
        // You might need to adjust based on how you've structured your code.
        fetchTopThree(selectedUofA);
        fetchBottomThree(selectedUofA);
        fetchThreeFte(selectedUofA);
        fetchIncomeData(selectedUofA);
        fetchOutputsData(selectedUofA);
        fetchAndDisplayNationalAverages(selectedUofA);


        // Add calls to other functions for different components as needed.
    });

    // Trigger the initial load for the default selection.
    const initialUofA = dropdown.options[dropdown.selectedIndex].text;
    fetchTopThree(initialUofA);
    fetchBottomThree(initialUofA);
    fetchThreeFte(initialUofA);
    fetchIncomeData(initialUofA);
    fetchOutputsData(initialUofA);
    fetchAndDisplayNationalAverages(initialUofA);
    // Initialize other components as needed.
});
