function fetchTopAndBottomThree(uofaName = 'Computer Science and Informatics') {
  const topThreeUrl = `https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/top3?uofaName=${encodeURIComponent(uofaName)}`;
  const bottomThreeUrl = `https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/bottom3?uofaName=${encodeURIComponent(uofaName)}`;

  Promise.all([
    fetch(topThreeUrl).then(response => response.json()),
    fetch(bottomThreeUrl).then(response => response.json())
  ])
  .then(([topThreeData, bottomThreeData]) => {
    displayRecords(topThreeData, bottomThreeData);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

function displayRecords(topThreeData, bottomThreeData) {
  const recordsContainer = document.getElementById('records-container');
  let content = '<h3>Top 3 Universities</h3>';

  topThreeData.forEach(item => {
    const formattedAverageScore = Number(item.AverageScore).toFixed(2);
    content += `
      <div class="uni-record">
        <span class="uni-name">${item.UniversityName}: ${formattedAverageScore}</span>
      </div>`;
  });

  content += '<h3>Bottom 3 Universities</h3>';

  bottomThreeData.forEach(item => {
    const formattedAverageScore = Number(item.AverageScore).toFixed(2);
    content += `
      <div class="uni-record">
        <span class="uni-name">${item.UniversityName}: ${formattedAverageScore}</span>
      </div>`;
  });

  recordsContainer.innerHTML = content;
}
