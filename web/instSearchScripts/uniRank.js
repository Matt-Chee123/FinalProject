function fetchAllOveralls(unitOfAssessment) {
    const encodedUofA = encodeURIComponent(unitOfAssessment);

    return fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/overall?unitOfAssessment=${encodedUofA}`)
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

function displayRankData(specificData,unitOfAssessment) {
    fetchAllOveralls(unitOfAssessment).then(overallData => {
        if (!overallData) {
            console.log('No data available');
            return;
        }
        // Assuming specificData is an array and we're interested in the first item's UnitOfAssessmentName
        // for demonstration purposes. You might need to adjust this based on your actual data structure.
        const specificUnitOfAssessmentName = specificData[0].UnitOfAssessmentName;

        // Filter overallData to only include items with the same UnitOfAssessmentName
        const filteredOverallData = overallData.filter(item => item.UnitOfAssessmentName === specificUnitOfAssessmentName);

        // Proceed with the rest of your function as before, using filteredOverallData instead of overallData
        filteredOverallData.sort((a, b) => b.AverageScore - a.AverageScore);

        // Assign ranks based on sorted position
        filteredOverallData.forEach((item, index) => {
            item.Rank = index + 1; // Assigning rank starting from 1
        });

        const specificUniRecord = specificData.find(item => item.ProfileType === "Overall");
        const specificUniversity = filteredOverallData.find(item => item.InstitutionID === specificUniRecord.InstitutionID);
        const specificRank = specificUniversity ? specificUniversity.Rank : 'N/A';

        // Calculate indices for two universities above and below the specific one
        const specificIndex = filteredOverallData.findIndex(item => item.InstitutionID === specificUniRecord.InstitutionID);
        const startIndex = Math.max(0, specificIndex - 1);
        const endIndex = Math.min(filteredOverallData.length, specificIndex + 2);

        const totalNumOfUniversities = filteredOverallData.length;
        const removePrefixes = (name) => {
            return name.replace(/^University of /, '').replace(/^University /, '');
        };
        const bulletData = filteredOverallData.slice(startIndex, endIndex).map((uni, index) => ({
            y: uni.AverageScore,
            target: 4, // Fixed target for demonstration
            name: uni.UniversityName,
            rank: startIndex + index + 1
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
                categories: filteredOverallData.slice(startIndex, endIndex).map(uni => `${uni.Rank}. ${removePrefixes(uni.UniversityName)}`),
                labels: {
                    useHTML: true, // Enable HTML to apply styling
                    formatter: function() {
                        // Extract rank and name
                        const rankAndName = this.value.split('. ');
                        const rank = rankAndName[0];
                        const name = rankAndName[1];

                        // Determine if this label is for the university of interest (e.g., "Oxford")
                        const isMiddle = parseInt(rank) === specificRank; // specificRank should be a number

                        // Apply monospace font to rank for consistent spacing
                        const rankHtml = `<span style="font-family: monospace;">${rank}.</span>`;

                        // Construct the full label with rank and name, making the middle university name bold
                        const labelHtml = `${rankHtml} ${isMiddle ? '<b>' + name + '</b>' : name}`;

                        return labelHtml;
                    },
                }
            },
            series: [{
                data: bulletData
            }],
            tooltip: {
                pointFormat: '<b>{point.y:.2f}</b> (Target: {point.target})<br/>Rank: {point.rank} / ' + totalNumOfUniversities + ' universities<br/>',
                positioner: function (labelWidth, labelHeight, point) {
                    return { x: point.plotX - 50, y: 0 }; // Adjust x and y to place the tooltip where it doesn't overlap
                }
            }
        });
    });
}
