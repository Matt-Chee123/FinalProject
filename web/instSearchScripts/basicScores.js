function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById('search-results');

    if (data && data.length > 0) {
        // Define the order of ProfileTypes
        const order = ['Outputs', 'Impact', 'Environment'];

        // Sort data based on the defined order
        data.sort((a, b) => {
            let indexA = order.indexOf(a.ProfileType);
            let indexB = order.indexOf(b.ProfileType);

            indexA = indexA === -1 ? order.length : indexA;
            indexB = indexB === -1 ? order.length : indexB;

            return indexA - indexB;
        });

        let content = '<div class="score-card">';
        content += '<h3>Scores</h3>';
        content += '<ul class="score-list">';
        data.forEach(item => {
            if (item.ProfileType && order.includes(item.ProfileType)) {
                content += `<ul>${item.ProfileType}: ${item.AverageScore.toFixed(2)}</ul>`;
            }
        });
        content += '</ul></div>';
        searchResultsContainer.innerHTML = content;
    } else {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
    }
}
