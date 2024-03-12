
// Fetch all university names as soon as the page is ready
document.getElementById('UofA').addEventListener('change', function() {
    fetchAllUniversityNames(document.getElementById('UofA').value);
});
// Function to fetch all university names
async function fetchAllUniversityNames(uofaName) {
    try {
        const response = await fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/uoaUniNames?uofaName=${encodeURIComponent(uofaName)}`);
        const data = await response.json();
        allUniversityNames = data; // Assuming the API returns an array of names
    } catch (error) {
        console.error('Error fetching university names:', error);
    }
}

// Get the search input field and the results dropdown
const highlightInput = document.getElementById("uniToHighlight");
const highlightSuggestionsContainer = document.getElementById("highlightSuggestionsContainer");


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

