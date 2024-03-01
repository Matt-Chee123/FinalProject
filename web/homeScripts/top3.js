function fetchTopThree(uofaName = 'Computer Science and Informatics') {
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/top3?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayTopThreeRecords(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

function displayTopThreeRecords(data) {
  const topThreeContainer = document.getElementById('top-three-records');
  let content = '<h3>Top 3 Universities</h3><ul>';
  data.forEach(item => {
    content += `<li>${item.UniversityName} - ${item.AverageScore}</li>`;
  });
  content += '</ul>';
  topThreeContainer.innerHTML = content;
}



