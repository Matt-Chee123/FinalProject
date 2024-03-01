let allUniversityNames = []; // This will hold all university names

// Fetch all university names as soon as the page is ready
document.addEventListener("DOMContentLoaded", function() {
    fetchAllUniversityNames();
});

// Function to fetch all university names
async function fetchAllUniversityNames() {
    try {
        const response = await fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/universities');
        const data = await response.json();
        allUniversityNames = data; // Assuming the API returns an array of names
    } catch (error) {
        console.error('Error fetching university names:', error);
    }
}

// Get the search input field and the results dropdown
const searchInput = document.getElementById("searchInstitution");
const suggestionsContainer = document.getElementById("suggestions-container");

// Event listener for input
searchInput.addEventListener('input', function(event) {
    updateSearchResults(event.target.value);
});

// Function to update the search results based on the fetched university names
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
