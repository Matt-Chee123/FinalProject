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
  let content = '<ul>';

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
  content += '<h3>National Output Profile</h3>';
  content += `<ul>World Leading: ${avgFourStar}%</ul>`;
  content += `<ul>Internationally Excellent: ${avgThreeStar}%</ul>`;
  content += `<ul>Internationally Recognized: ${avgTwoStar}%</ul>`;
  content += `<ul>Nationally Recognized: ${avgOneStar}%</ul>`;

  content += '</ul>';
  OutputsContainer.innerHTML = content;
}
