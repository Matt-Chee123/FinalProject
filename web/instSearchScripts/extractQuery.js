
function extractQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
        fetchSearchResults(query);
    } else {
        document.getElementById('search-results').innerHTML = "<p>No results found.</p>";
    }

}

function fetchSearchResults(searchTerm) {
   fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/search?query=${encodeURIComponent(searchTerm)}`)
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
       fetchEnvironmentAverages().then(averages => {
         // Once the averages data is retrieved, display the doctoral degrees chart
         displayDoctoralDegreesChart(data, averages);
       });
     })
     .catch(error => {
       console.error('Fetch error:', error);
     });
 }

document.addEventListener("DOMContentLoaded", extractQuery);
