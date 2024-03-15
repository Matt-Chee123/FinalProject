document.addEventListener('DOMContentLoaded', function() {
    fetchUniversities();
});

function fetchUniversities() {
    fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/uniNames')
        .then(response => response.json())
        .then(data => {
            const sortedUniversities = data.sort((nameA, nameB) => {
                // adjust university namess
                return nameA.localeCompare(nameB);
            });
            populateUniDropdown(sortedUniversities);
        })
        .catch(error => console.error('Error fetching university names:', error));
}

//if university name starts with 'University of', remove it
function adjustUniversityName(name) {
    if (name.startsWith('University of ')) {
        return name.substring(14);
    }
    return name;
}

function populateUniDropdown(universities) {
    const dropdown = document.getElementById('institution-dropdown');
    // remove existing optinos
    for (let i = dropdown.options.length - 1; i > 0; i--) {
        dropdown.remove(i);
    }
    // add unis as options
    universities.forEach(university => {
        const option = new Option(university, university);
        dropdown.add(option);
    });
}