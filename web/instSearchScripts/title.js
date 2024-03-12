function displayTitle(institutionName) {
    const titleElement = document.getElementById('title-text');

    // If an institution is selected, show its name; otherwise, show 'REF2021'
    titleElement.textContent = institutionName !== 'Nation' ? institutionName : 'REF2021 - Nation Overview';
}
document.addEventListener('DOMContentLoaded', () => {
    const institutionDropdown = document.getElementById('institution-dropdown');

    institutionDropdown.addEventListener('change', () => {
        // Get the selected value from the dropdown
        const selectedInstitution = institutionDropdown.value;

        // Update the title
        displayTitle(selectedInstitution);
    });

    // Call it once to set the initial state correctly
    displayTitle("REF2021 - Nation Overview");
});
