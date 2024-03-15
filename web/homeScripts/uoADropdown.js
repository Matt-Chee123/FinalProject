document.addEventListener('DOMContentLoaded', function() {
// fetch uoas for a uni
    document.getElementById('institution-dropdown').addEventListener('change', function() {
        const currentUoA = document.getElementById('unit-of-assessment-dropdown').value;
        fetchUnitOfAssessmentNames(this.value, currentUoA);
    });

    // nation and comp sci are the default values
    fetchUnitOfAssessmentNames('Nation', 'Computer Science and Informatics');
});

// on back button click, fetch UoAs for "Nation"
document.getElementById('back-button').addEventListener('click', function() {
    const UoA = 'Computer Science and Informatics';
    const institution = 'Nation';
    fetchUnitOfAssessmentNames(institution, UoA);
});

//fetch uoas for a uni
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
    dropdown.length = 0; // clear existing options

    let foundCurrentUoA = false;

// populate the dropdown with the fetched UoA names
    unitOfAssessmentNames.forEach(name => {
        const option = new Option(name, name);
        dropdown.add(option);

        if (name === currentUoA) {
            option.selected = true;
            foundCurrentUoA = true;
        }
    });

// checks if the current UoA wasn't found, select the first available UoA
    if (!foundCurrentUoA && dropdown.options.length > 1) {
        for (let i = 0; i < dropdown.options.length; i++) {
            if (dropdown.options[i].value === "Computer Science and Informatics") {
                dropdown.options[i].selected = true;
                foundCurrentUoA = true;
                break;
            }
        }
    }

    // if comp sci not found, pick the first available UoA
    if (!foundCurrentUoA) {
        dropdown.options[1].selected = true;
    }
}
