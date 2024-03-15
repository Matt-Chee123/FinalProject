document.addEventListener('DOMContentLoaded', function() {
    const institutionDropdown = document.getElementById('institution-dropdown');
    const unitOfAssessmentDropdown = document.getElementById('unit-of-assessment-dropdown');

    // function to execute when nation is selected
    function executeForNation() {
        if (institutionDropdown.value === 'Nation') {
            const selectedUofA = unitOfAssessmentDropdown.value;
            console.log('Nation selected, executing operations for unit of assessment:', selectedUofA);

            // call component functions
            fetchTopAndBottomThree(selectedUofA);
            fetchTopThreeFte(selectedUofA);
            fetchIncomeData(selectedUofA);
            fetchOutputsData(selectedUofA);
            fetchAndDisplayNationalAverages(selectedUofA);
            display10v10Data(selectedUofA);
        }
    }
    //function to handle nation uoa changes
    function handleUoAChange() {
        const selectedUofA = unitOfAssessmentDropdown.value;
        if (institutionDropdown.value === 'Nation') {

            // call component functions
            fetchTopAndBottomThree(selectedUofA);
            fetchTopThreeFte(selectedUofA);
            fetchIncomeData(selectedUofA);
            fetchOutputsData(selectedUofA);
            fetchAndDisplayNationalAverages(selectedUofA);
            display10v10Data(selectedUofA);
        }
    }


    // listen for uoa dropdown change
    unitOfAssessmentDropdown.addEventListener('change', handleUoAChange);

//listen for inst dropdown change
    institutionDropdown.addEventListener('change', executeForNation);
    //execute on load as natio is default
    executeForNation();
});
