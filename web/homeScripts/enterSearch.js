let allUniversityNames = []; // This will hold all university names

// Fetch all university names as soon as the page is ready
document.addEventListener("DOMContentLoaded", function() {
    fetchAllUniversityNames();
});

// Function to fetch all university names
async function fetchAllUniversityNames() {
    try {
        const response = await fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/uniNames');
        const data = await response.json();
        allUniversityNames = data; // Assuming the API returns an array of names
    } catch (error) {
        console.error('Error fetching university names:', error);
    }
}

// Get the search input field and the results dropdown
const searchInput = document.getElementById("searchInstitution");
const highlightInput = document.getElementById("uniToHighlight");
const suggestionsContainer = document.getElementById("suggestions-container");
const highlightSuggestionsContainer = document.getElementById("highlightSuggestionsContainer");

// Event listener for input
searchInput.addEventListener('input', function(event) {
    updateSearchResults(event.target.value);
});

// Correct the reference to the highlightSuggestionsContainer

highlightInput.addEventListener('input', function(event) {
    updateHighlightUniSearch(event.target.value);
}); // Missing closing parenthesis fixed

function updateHighlightUniSearch(highlightSearchTerm) {
    if (highlightSearchTerm.length < 3) {
        highlightSuggestionsContainer.style.display = 'none';
        return;
    }
    console.log('highlightSearchTerm:', highlightSearchTerm);
    // Filter matching university names based on the search term
    const filteredResults = allUniversityNames
        .filter(name => name && name.toLowerCase().includes(highlightSearchTerm.toLowerCase()))
        .slice(0, 5);
    console.log('filteredResults:', filteredResults);
    highlightSuggestionsContainer.innerHTML = ''; // Clear previous suggestions

    filteredResults.forEach(name => {
        const div = document.createElement('div');
        div.textContent = name;
        div.className = '';
        div.onclick = function() {
            highlightInput.value = name; // Set the input's value to the selected name
            highlightSuggestionsContainer.style.display = 'none'; // Optionally hide suggestions after selection
        };
        highlightSuggestionsContainer.appendChild(div);
    });

    if (filteredResults.length > 0) {
        highlightSuggestionsContainer.style.display = 'block'; // Show the suggestions
    } else {
        highlightSuggestionsContainer.style.display = 'none'; // Hide the suggestions if no match
    }
}


function updateSearchResults(searchTerm) {
    if (searchTerm.length < 3) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Filter matching university names based on the search term
    const filteredResults = allUniversityNames
        .filter(name => name && name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5);


    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    filteredResults.forEach(name => {
        const div = document.createElement('div');
        div.textContent = name;
        div.className = 'suggestion';
        div.onclick = function() {
            // Redirect to uniAnalytics.html with the selected university name
            window.location.href = `uniAnalytics.html?query=${encodeURIComponent(name)}`;
        };
        suggestionsContainer.appendChild(div);
    });


    if (filteredResults.length > 0) {
        suggestionsContainer.style.display = 'block'; // Show the suggestions
    } else {
        suggestionsContainer.style.display = 'none'; // Hide the suggestions if no match
    }
}
