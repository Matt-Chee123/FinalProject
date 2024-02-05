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

        // Sort overallData by AverageScore in descending order
        overallData.sort((a, b) => b.AverageScore - a.AverageScore);

        // Assign ranks based on sorted position
        overallData.forEach((item, index) => {
            item.Rank = index + 1; // Assigning rank starting from 1
        });
        const specificUniRecord = specificData.find(item => item.ProfileType === "Overall");
        // Find the specific university record and its rank
        const specificUniversity = overallData.find(item => item.InstitutionID === specificUniRecord.InstitutionID);

        const specificRank = specificUniversity.Rank;

        // Calculate indices for two universities above and below the specific one
        const specificIndex = overallData.findIndex(item => item.InstitutionID === specificUniRecord.InstitutionID);
        const startIndex = Math.max(0, specificIndex - 1);
        const endIndex = Math.min(overallData.length, specificIndex + 2); // +3 because slice does not include the end index

        const totalNumOfUniversities = overallData.length;
        const removePrefixes = (name) => {
            return name.replace(/^University of /, '').replace(/^University /, '');
        };
        const bulletData = overallData.slice(startIndex, endIndex).map((uni, index) => ({
            y: uni.AverageScore, // Actual value
            target: 4, // Fixed target for demonstration
            name: uni.UniversityName, // Used for tooltips
            rank: startIndex + index + 1 // Calculate rank based on array index and start index
        }));

        Highcharts.chart('bullet-chart-container', {
            chart: {
                type: 'bullet',
                inverted: true,
                height: 150
            },
            legend: {
                enabled: false
            },
            title: {
                text: 'University Overall'
            },
            yAxis: {
                max: 4,
                gridLineWidth: 0,
                plotBands: [{
                    from: 0,
                    to: 4,
                    color: '#e8e8e8',
                    max: 3
                }],
                title: null
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    targetOptions: {
                        width: '200%'
                    }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                // Use the names of the universities as categories for the X axis
                categories: overallData.slice(startIndex, endIndex).map(uni => removePrefixes(uni.UniversityName)),
            },
            series: [{
                data: bulletData
            }],
            tooltip: {
        pointFormat: '<b>{point.y}</b> (Target: {point.target})<br/>Rank: {point.rank} / ' + totalNumOfUniversities + ' universities<br/>'
            }
        });
    });
}
