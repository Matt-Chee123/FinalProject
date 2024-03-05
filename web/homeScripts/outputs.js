function fetchOutputsData(uofaName = 'Computer Science and Informatics') {
    fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/outputs?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayOutputAverages(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}


function displayOutputAverages(data) {
  const OutputsContainer = document.getElementById('outputs-records');

  // Initialize sums
  let sumFourStar = 0, sumThreeStar = 0, sumTwoStar = 0, sumOneStar = 0;

  // Accumulate sums for each field
  data.forEach(item => {
    sumFourStar += item.FourStar;
    sumThreeStar += item.ThreeStar;
    sumTwoStar += item.TwoStar;
    sumOneStar += item.OneStar;
  });

  // Calculate averages
  const avgFourStar = Number((sumFourStar / data.length).toFixed(1));
  const avgThreeStar = Number((sumThreeStar / data.length).toFixed(1));
  const avgTwoStar = Number((sumTwoStar / data.length).toFixed(1));
  const avgOneStar = Number((sumOneStar / data.length).toFixed(1));

  // Add averages to the list
  let content = '<div class="output-profile">';  // Start a wrapper div for styling
  content += '<h3 class="output-title">National Output Profile</h3>';  // Apply a class for the title
  content += `<ul><li>World Leading: ${avgFourStar}%</li>`;  // Use list items for each line
  content += `<li>Internationally Excellent: ${avgThreeStar}%</li>`;
  content += `<li>Internationally Recognized: ${avgTwoStar}%</li>`;
  content += `<li>Nationally Recognized: ${avgOneStar}%</li></ul>`;
  content += '</div>';  // Close the wrapper div
  OutputsContainer.innerHTML = content;
}
