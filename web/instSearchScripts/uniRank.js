function fetchAllOveralls() {
    return fetch('https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/overall')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function displayRankData(specificData) {
    fetchAllOveralls().then(overallData => {
        if (!overallData) {
            console.log('No data available');
            return;
        }
        if (specificData){
            console.log('Specific Data:', specificData);
        }
        // Sort overallData by AverageScore in descending order
        overallData.sort((a, b) => b.AverageScore - a.AverageScore);

        // Assign ranks based on sorted position
        overallData.forEach((item, index) => {
            item.Rank = index + 1; // Assigning rank starting from 1
        });
        const specificUniRecord = specificData.find(item => item.ProfileType === "Overall");
        console.log('Specific university record:', specificUniRecord);
        // Find the specific university record and its rank
        const specificUniversity = overallData.find(item => item.InstitutionID === specificUniRecord.InstitutionID);

        const specificRank = specificUniversity.Rank;
        console.log('Rank of specific university:', specificRank);

        // Calculate indices for two universities above and below the specific one
        const specificIndex = overallData.findIndex(item => item.InstitutionID === specificUniRecord.InstitutionID);
        const startIndex = Math.max(0, specificIndex - 1);
        const endIndex = Math.min(overallData.length, specificIndex + 2); // +3 because slice does not include the end index

        // Extract the names and ranks of these universities
        const neighboringUniversities = overallData.slice(startIndex, endIndex).map(uni => `${uni.UniversityName} - Average Score: ${uni.AverageScore} (Rank: ${uni.Rank})`);
        console.log('Neighboring universities:', neighboringUniversities);

        // Display the neighboring university names and the specific university's rank
        const rankContainer = document.getElementById('rank-container');
        let content = `<ul><h3>Rank of Selected University: ${specificRank}</h3>`;
        neighboringUniversities.forEach(name => {
            content += `<li>${name}</li>`;
        });
        content += '</ul>';
        rankContainer.innerHTML = content;
    }).catch(error => {
        console.error('Error displaying rank data:', error);
    });
}

