function fetchAndDisplaySpecificBottomRecords(filePath) {
  fetch(filePath)
    .then(response => response.text())
    .then(csvText => {
      let records = parseCSV(csvText);
      // filter the specific records by their UKPRN
      const specificRecords = records.filter(record =>
        record.ukprn === '10007855' || //10003861
        record.ukprn === '10007848' ||
        record.ukprn === '10007833'
      );
      displayBottomThree(specificRecords);
    })
    .catch(error => console.error('Error fetching or parsing CSV:', error));
}

// Make sure the parseCSV function correctly parses and returns the ukprn
function parseCSV(csv) {
  const lines = csv.split('\n');
  lines.shift();
  return lines.filter(line => line.trim() !== '').map(line => {
    const [ukprn, name, sortOrder, mainPanel, uoaNumber, uoaName, multipleSubmissionLetter, multipleSubmissionName, jointSubmission, profile, fteStaff, totalFteStaff, percentSubmitted, fourStar, threeStar, twoStar, oneStar, unclassified, latitude, longitude, score] = line.split(',');

    return {
      ukprn: ukprn,
      name: name,
      score: parseFloat(score),
    };
  });
}

// Function to display the bottom 3 records
function displayBottomThree(bottomThreeRecords) {
  const container = document.getElementById('bottom-three-records');
  container.innerHTML = ''; // Clear previous contents

  // Use bottomThreeRecords.length to get the total number of records
  const totalRecords = bottomThreeRecords.length;

  bottomThreeRecords.forEach((record, index) => {
    const entry = document.createElement('div');
    entry.className = 'record-entry';
    // Use totalRecords and index to correctly display the rank of the record
    entry.innerHTML = `<strong>${index + 1}. ${record.name}</strong>: ${record.score.toFixed(1)}`;
    container.appendChild(entry);
  });
}

// Path to your CSV file
const filePath = '../../server/data/sorted_data.csv';

// Call the function with the path to your CSV file
fetchAndDisplaySpecificBottomRecords(filePath);
