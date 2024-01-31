function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById('search-results');

    if (data && data.length > 0) {
        // Define the order of ProfileTypes
        const order = ['Overall', 'Outputs', 'Impact', 'Environment'];

        // Sort data based on the defined order
        data.sort((a, b) => {
            let indexA = order.indexOf(a.ProfileType);
            let indexB = order.indexOf(b.ProfileType);

            // If ProfileType is not found in the order array, it gets lowest priority
            indexA = indexA === -1 ? order.length : indexA;
            indexB = indexB === -1 ? order.length : indexB;

            return indexA - indexB;
        });

        let content = '<ul>';
        content += '<h3>Search Results</h3>';

        data.forEach(item => {
            if (item.ProfileType && order.includes(item.ProfileType)) {
                content += `<ul>${item.ProfileType} - ${item.AverageScore}</ul>`;
            }
        });

        content += '</ul>';
        searchResultsContainer.innerHTML = content;
    } else {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
    }
}

