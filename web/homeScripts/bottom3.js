function fetchBottomThree(uofaName = 'Computer Science and Informatics') {
  fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/bottom3?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayBottomThreeRecords(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

function displayBottomThreeRecords(data) {
  const bottomThreeContainer = document.getElementById('bottom-three-records');
  let content = '<h3>Bottom 3 Universities</h3>';
  data.forEach(item => {
    const formattedAverageScore = Number(item.AverageScore).toFixed(2);
    content += `
      <div class="uni-record">
        <span class="uni-name">${item.UniversityName}: ${formattedAverageScore}</span>
      </div>`;
  });
  bottomThreeContainer.innerHTML = content;
}


