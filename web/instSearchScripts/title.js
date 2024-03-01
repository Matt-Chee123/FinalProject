function displayTitle(data) {
    const searchResultsContainer = document.getElementById('search-title');
    if(data && data.length > 0) {
        const item = data[0];
        searchResultsContainer.innerHTML = item.UniversityName;
    } else {
        searchResultsContainer.innerHTML = "No data for this UofA";
    }
}
