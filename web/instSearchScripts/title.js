function displayTitle(institutionName) {
    const titleElement = document.getElementById('title-text');

    // if the institution is not the nation, display the institution name
    titleElement.textContent = institutionName !== 'Nation' ? institutionName : 'REF2021 - Nation Overview';
}
document.addEventListener('DOMContentLoaded', () => {
    const institutionDropdown = document.getElementById('institution-dropdown');

    institutionDropdown.addEventListener('change', () => {

        const selectedInstitution = institutionDropdown.value;

        // update title
        displayTitle(selectedInstitution);
    });

    // default
    displayTitle("REF2021 - Nation Overview");
});
