// Include the Amplify library and configure it
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'; // Ensure this path is correct
Amplify.configure(awsconfig);

// Function to fetch data from your Lambda function
async function fetchTopThree() {
  try {
    const apiName = 'MyAPI'; // replace with your API name from aws-exports.js
    const path = '/top3-main'; // replace with the path you've configured in API Gateway
    const data = await Amplify.API.get(apiName, path); // make the GET request
    const topThreeItems = JSON.parse(data.body); // parse the JSON string returned from Lambda

    // Get the div where you want to display the data
    const topThreeDiv = document.getElementById('top-three-records');

    // Create HTML content with the top three items
    const content = topThreeItems.map(item =>
      `<div class="record">
         <p>${item.Name}: ${item.AverageScore}</p>
       </div>` // Replace with your actual item attributes
    ).join('');

    // Insert the content into the div
    topThreeDiv.innerHTML = content;
  } catch (error) {
    console.error('Error fetching the top three records:', error);
    // Handle the error accordingly
  }
}

// Call fetchTopThree when the window loads
window.onload = fetchTopThree;
