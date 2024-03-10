document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('institution-dropdown').addEventListener('change', function() {
        const currentUoA = document.getElementById('unit-of-assessment-dropdown').value;
        fetchUnitOfAssessmentNames(this.value, currentUoA);
    });

    // Pass "Computer Science and Informatics" as the initial UoA to select by default
    fetchUnitOfAssessmentNames('Nation', 'Computer Science and Informatics');
});

function fetchUnitOfAssessmentNames(universityName = 'Nation', currentUoA = 'Computer Science and Informatics') {
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/university?UniversityName=${encodeURIComponent(universityName)}`)
        .then(response => response.json())
        .then(unitOfAssessmentNames => {
            populateUoADropdown(unitOfAssessmentNames, currentUoA);
        })
        .catch(error => console.error('Failed to load unit of assessment names:', error));
}

function populateUoADropdown(unitOfAssessmentNames, currentUoA = 'Computer Science and Informatics') {
    const dropdown = document.getElementById('unit-of-assessment-dropdown');
    dropdown.length = 0; // Clear existing options
    dropdown.add(new Option('Select a Unit of Assessment', ''));

    let foundCurrentUoA = false;

    unitOfAssessmentNames.forEach(name => {
        const option = new Option(name, name);
        dropdown.add(option);

        if (name === currentUoA) {
            option.selected = true;
            foundCurrentUoA = true;
        }
    });

    // This checks if "Computer Science and Informatics" should be selected by default
    // or if another UoA was previously selected and still exists in the list, it gets selected
    if (!foundCurrentUoA && dropdown.options.length > 1) {
        for (let i = 0; i < dropdown.options.length; i++) {
            if (dropdown.options[i].value === "Computer Science and Informatics") {
                dropdown.options[i].selected = true;
                foundCurrentUoA = true;
                break;
            }
        }
    }

    // If "Computer Science and Informatics" was not found, select the first option by default
    if (!foundCurrentUoA) {
        dropdown.options[1].selected = true;
    }
}
