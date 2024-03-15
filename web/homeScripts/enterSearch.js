
// fetch all university names as soon as form starts loading
document.getElementById('UofA').addEventListener('change', function() {
    fetchAllUniversityNames(document.getElementById('UofA').value);
});
// function to fetch all university names
async function fetchAllUniversityNames(uofaName) {
    try {
        const response = await fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/uoaUniNames?uofaName=${encodeURIComponent(uofaName)}`);
        const data = await response.json();
        allUniversityNames = data;
    } catch (error) {
        console.error('Error fetching university names:', error);
    }
}

// get search input field and results container
const highlightInput = document.getElementById("uniToHighlight");
const highlightSuggestionsContainer = document.getElementById("highlightSuggestionsContainer");



// add input event listener to the search input field
highlightInput.addEventListener('input', function(event) {
    updateHighlightUniSearch(event.target.value);
});

//function to update the suggestions based on the search term
function updateHighlightUniSearch(highlightSearchTerm) {
    if (highlightSearchTerm.length < 3) {
        highlightSuggestionsContainer.style.display = 'none';
        return;
    }
    console.log('highlightSearchTerm:', highlightSearchTerm);
    // filter matching unis based of search term
    const filteredResults = allUniversityNames
        .filter(name => name && name.toLowerCase().includes(highlightSearchTerm.toLowerCase()))
        .slice(0, 5);
    console.log('filteredResults:', filteredResults);
    highlightSuggestionsContainer.innerHTML = ''; // clear previous suggestions

// create a div for each matching result
    filteredResults.forEach(name => {
        const div = document.createElement('div');
        div.textContent = name;
        div.className = '';
        div.onclick = function() {
            highlightInput.value = name;
            highlightSuggestionsContainer.style.display = 'none';
        };
        highlightSuggestionsContainer.appendChild(div);
    });

// show the suggestions container if there are any matching results
    if (filteredResults.length > 0) {
        highlightSuggestionsContainer.style.display = 'block';
    } else {
        highlightSuggestionsContainer.style.display = 'none';
    }
}

