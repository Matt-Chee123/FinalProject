function extractQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const defaultUnitOfAssessment = 'Computer Science and Informatics'; // Set default unit of assessment
    if (query) {
        fetchSearchResults(query, defaultUnitOfAssessment);
    } else {
        document.getElementById('search-results').innerHTML = "<p>No results found.</p>";
    }
}


function fetchSearchResults(searchTerm, unitOfAssessment) {
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/search?query=${encodeURIComponent(searchTerm)}&unitOfAssessment=${encodeURIComponent(unitOfAssessment)}`)
     .then(response => {
       console.log('Response:', response); // Log the response object

       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       return response.json();
     })
     .then(data => {
       displaySearchResults(data);
       displayTitle(data);
       displayIncomeChart(data);
       displayIncomeDist(data);
       displayRankData(data);
       fetchFTEIncomeData(data);
       fetchOutputsandIncome(data);
       fetchEnvironmentAverages().then(averages => {
         // Once the averages data is retrieved, display the doctoral degrees chart
         displayDoctoralDegreesChart(data, averages);
       });
     })
     .catch(error => {
       console.error('Fetch error:', error);
     });
 }

document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('unit-of-assessment-dropdown');
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    dropdown.addEventListener('change', function() {
        const selectedUofA = this.value; // Use the value of the option rather than the text
        console.log('Selected unit of assessment:', selectedUofA);
        if (query) {
            fetchSearchResults(query, selectedUofA);
        }
    });

    // Trigger the initial load for the default selection if there's a query present.
    if (query) {
        const initialUofA = dropdown.value; // Use the value of the selected option
        fetchSearchResults(query, initialUofA);
    }
});
