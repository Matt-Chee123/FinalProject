document.addEventListener('DOMContentLoaded', function() {
    fetchUniversities();
});

function fetchUniversities() {
    fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/uniNames')
        .then(response => response.json())
        .then(data => {
            const sortedUniversities = data.sort((a, b) => {
                // Adjust names for sorting if they start with 'University of'
                const nameA = adjustUniversityName(a);
                const nameB = adjustUniversityName(b);

                return nameA.localeCompare(nameB);
            });
            populateUniDropdown(sortedUniversities);
        })
        .catch(error => console.error('Error fetching university names:', error));
}

function adjustUniversityName(name) {
    if (name.startsWith('University of ')) {
        return name.substring(14); // 'University of ' has 14 characters
    }
    return name;
}

function populateUniDropdown(universities) {
    const dropdown = document.getElementById('institution-dropdown');
    // Remove existing options (except for the first default option)
    for (let i = dropdown.options.length - 1; i > 0; i--) {
        dropdown.remove(i);
    }
    // Add universities as new options
    universities.forEach(university => {
        const option = new Option(university, university); // new Option(text, value)
        dropdown.add(option);
    });
}