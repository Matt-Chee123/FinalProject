// Get the search input field and the results dropdown
const searchInput = document.getElementById("searchInstitution");
const suggestionsContainer = document.getElementById("suggestions-container");

// Event listener for input
searchInput.addEventListener('input', function(event) {
    updateSearchResults(event.target.value);
});

// Function to update the search results
function updateSearchResults(searchTerm) {
    if (searchTerm.length < 3) { // Optional: start searching after 2 characters
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Call your API endpoint with the current search term
    fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/autocomplete?query=' + encodeURIComponent(searchTerm))
        .then(response => response.json())
        .then(data => {
            suggestionsContainer.innerHTML = ''; // Clear previous suggestions

            // Sort and slice the top 3 results if necessary
            const topResults = data.sort((a, b) => b.score - a.score).slice(0, 3);
            console.log('Top results:', topResults);
            topResults.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item;
                div.className = 'suggestion';
                div.onclick = function() {
                    window.location.href = `uniAnalytics.html?query=${encodeURIComponent(item)}`;
                };
                suggestionsContainer.appendChild(div);
            });

            suggestionsContainer.style.display = 'block'; // Show the suggestions
        })
        .catch(error => {
            console.error('Error during search:', error);
        });
}
