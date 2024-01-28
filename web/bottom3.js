fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/bottom3')
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

function displayBottomThreeRecords(data) {
  const bottomThreeContainer = document.getElementById('bottom-three-records');
  let content = '<ul>';
  content += '<h3>Bottom 3 Universities</h3>';

  data.forEach(item => {
    content += `<ul>${item.UniversityName} - ${item.AverageScore}</ul>`;
  });

  content += '</ul>';
  bottomThreeContainer.innerHTML = content;
}
