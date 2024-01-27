// Function to parse CSV string to an array of objects
function parseCSV(csv) {
  const lines = csv.split('\n');
  // Remove the header line and any empty lines caused by splitting
  lines.shift();
  lines.filter(line => line.trim() !== '');

  return lines.map(line => {
    const [ukprn, name, sortOrder, mainPanel, uoaNumber, uoaName, multipleSubmissionLetter, multipleSubmissionName, jointSubmission, profile, fteStaff, totalFteStaff, percentSubmitted, fourStar, threeStar, twoStar, oneStar, unclassified, latitude, longitude] = line.split(',');

    // Adjust the property names and parsing as needed
    return {
      name: name,
      score: parseFloat(fourStar) * 4 + parseFloat(threeStar) * 3 + parseFloat(twoStar) * 2 + parseFloat(oneStar) ,
      // Include other fields if needed
    };
  });
}

// Function to fetch the CSV file and display the top 3 records
function fetchAndDisplayTopThree(csvFilePath) {
  fetch(csvFilePath)
    .then(response => response.text())
    .then(csvText => {
      const records = parseCSV(csvText);

      // Assuming the records are already sorted by score
      const topThreeRecords = records.slice(0, 3);
      displayTopThree(topThreeRecords);
    })
    .catch(error => console.error('Error fetching or parsing CSV:', error));
}

// Function to display the top 3 records
function displayTopThree(topThreeRecords) {
  const container = document.getElementById('top-three-records');
  container.innerHTML = ''; // Clear previous contents

  topThreeRecords.forEach((record, index) => {
    const entry = document.createElement('div');
    entry.className = 'record-entry'; // A class for styling if needed
    entry.innerHTML = `<strong>${index + 1}. ${record.name}</strong>: ${record.score.toFixed(1)}`;
    container.appendChild(entry);
  });
}

// Path to your CSV file
const csvFilePath = '../../server/data/sorted_data.csv';

// Call the function with the path to your CSV file
fetchAndDisplayTopThree(csvFilePath);
