function fetchAllOveralls(unitOfAssessment) {
    const encodedUofA = encodeURIComponent(unitOfAssessment);

    return fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/overall?uOfA=${encodedUofA}`)
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
        console.log(specificData)
        // find the specific unit of assessment name
        const specificUnitOfAssessmentName = specificData[0].UnitOfAssessmentName;

        // filter and sort the overall data
        const filteredOverallData = overallData.filter(item => item.UnitOfAssessmentName === specificUnitOfAssessmentName);
        filteredOverallData.sort((a, b) => b.AverageScore - a.AverageScore);

        // assign ranks to the filtered data
        filteredOverallData.forEach((item, index) => {
            item.Rank = index + 1; // Assigning rank starting from 1
        });

        const specificUniRecord = specificData.find(item => item.ProfileType === "Overall");
        const specificUniversity = filteredOverallData.find(item => item.InstitutionID === specificUniRecord.InstitutionID);
        const specificRank = specificUniversity ? specificUniversity.Rank : 'N/A';

        // calculate index for unis above and below the specific uni
        const specificIndex = filteredOverallData.findIndex(item => item.InstitutionID === specificUniRecord.InstitutionID);
        const startIndex = Math.max(0, specificIndex - 1);
        const endIndex = Math.min(filteredOverallData.length, specificIndex + 2);

        const totalNumOfUniversities = filteredOverallData.length;
        const removePrefixes = (name) => {
            return name.replace(/^University of /, '').replace(/^University /, '');
        };
        const bulletData = filteredOverallData.slice(startIndex, endIndex).map((uni, index) => ({
            y: uni.AverageScore,
            name: uni.UniversityName,
            rank: startIndex + index + 1
        }));
        Highcharts.chart('bullet-chart-container', {
            chart: {
                type: 'bar', // Changed from 'bullet' to 'bar'
                inverted: true, // Inverts the chart. Consider if this is needed as bar charts are typically horizontal.
                height: 150,
                marginBottom: 52
            },
            legend: {
                enabled: false
            },
            title: {
                text: 'University GPA'
            },
            yAxis: {
                max: 4,
                labels: {
                  style: {
                     fontSize: '10px'
                  }
                },
                title: {
                    text: 'GPA'
                }
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0
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
                        // Your formatter logic remains unchanged
                        const rankAndName = this.value.split('. ');
                        const rank = rankAndName[0];
                        const name = rankAndName[1];
                        const isMiddle = parseInt(rank) === specificRank;
                        const rankHtml = `<span style="font-family: monospace;">${rank}.</span>`;
                        const labelHtml = `${rankHtml} ${isMiddle ? '<b>' + name + '</b>' : name}`;
                        return labelHtml;
                    },
                    step: 1
                }
            },
            series: [{
                data: bulletData
                // Ensure that your data format matches the expected format for a bar chart.
                // Bullet chart data formats might not directly map to bar charts, depending on how they're structured.
            }],
            tooltip: {
                // Your tooltip configuration remains unchanged
                pointFormat: '<b>{point.y:.2f}</b><br/>Rank: {point.rank} / ' + totalNumOfUniversities + ' universities<br/>',
                positioner: function (labelWidth, labelHeight, point) {
                    return { x: point.plotX - 50, y: 0 };
                }
            }
        });
    });
}