function fetch20(unitOfAssessment) {
    const encodedUofA = encodeURIComponent(unitOfAssessment);

    return fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/UoA?uofaName=${encodedUofA}`)
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

// This function will be called after the data is fetched
function display10v10Data(unitOfAssessment) {
    fetch20(unitOfAssessment)
        .then(data => {


            // Filter for 'Overall' profile type and sort
            const overallData = data.filter(item => item.ProfileType === 'Overall');
            const sortedData = overallData.sort((a, b) => b.AverageScore - a.AverageScore);

            // Get top 10 and next 10 universities
            const top10Universities = sortedData.slice(0, 10);
            const next10Universities = sortedData.slice(10, 20);

            // Extract university names for further filtering
            const top10Names = top10Universities.map(u => u.UniversityName);
            const next10Names = next10Universities.map(u => u.UniversityName);

            // Filter the original dataset for these universities
            const top10Data = data.filter(item => top10Names.includes(item.UniversityName));
            const next10Data = data.filter(item => next10Names.includes(item.UniversityName));

            top10Points = calculateGraphPoints(top10Data);
            next10Points = calculateGraphPoints(next10Data);
            console.log('Top 10 Totals:', top10Points);
            console.log('Next 10 Totals:', next10Points);

            Highcharts.chart('10v10container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Top 10 vs Next 10 Unis' // Optionally remove or set a title
                },
                xAxis: [{
                    categories: ['FTE', 'Doctoral Degrees']
                }],
                yAxis: {
                    min: 0, // Adjust according to your data
                    tickAmount: 4,
                    title: {
                        text: null // Optionally remove or set a title for the yAxis
                    }
                },
                legend: {
                    reversed: false // Adjust based on preference
                },
                plotOptions: {
                    series: {

                    }
                },
                series: [{
                    name: 'Top 10',
                    data: [
                        top10Points.fteOfSubmittedStaffTotal,
                        top10Points.doctoralDegreesTotal,
                    ],
                }, {
                    name: 'Next 10',
                    data: [
                        next10Points.fteOfSubmittedStaffTotal,
                        next10Points.doctoralDegreesTotal,
                    ],
                    color: 'red'
                }],
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        let tooltipText = `${this.series.name}<br/>${this.x}: `;
                        // Check the category and format the value accordingly
                        if (this.x === 'FTE') {
                            tooltipText += `<b>${Highcharts.numberFormat(this.y, 1)}</b>`; // Make the value bold and format with 1 decimal place
                        } else if (this.x === 'Doctoral Degrees') {
                            tooltipText += `<b>${Highcharts.numberFormat(this.y, 0)}</b>`; // Make the value bold and round to nearest whole number
                        }
                        return tooltipText;
                    }
                },
                legend: {
                    enabled: false // Adjust based on preference
                }
            });


        })
        .catch(error => {
            console.error('Display error:', error);
        });

}

function calculateGraphPoints(data) {
    let fteOfSubmittedStaffTotal = 0;
    let totalIncome1320Total = 0;
    let doctoralDegreesTotal = 0;

    data.forEach(item => {
        // Sum FTEOfSubmittedStaff for "Overall" profile type
        if (item.ProfileType === 'Overall') {
            fteOfSubmittedStaffTotal += item.FTEOfSubmittedStaff || 0;
        }

        // Sum TotalIncome1320 for "Total income" source
        if (item.IncomeSource === 'Total income') {
            totalIncome1320Total += item.TotalIncome1320 || 0;
        }

        // Sum DoctoralDegrees from 2013 to 2019 for "Environment" profile type
        if (item.ProfileType === 'Environment') {
            doctoralDegreesTotal += Number(item.DoctoralDegrees2013) || 0;
            doctoralDegreesTotal += Number(item.DoctoralDegrees2014) || 0;
            doctoralDegreesTotal += Number(item.DoctoralDegrees2015) || 0;
            doctoralDegreesTotal += Number(item.DoctoralDegrees2016) || 0;
            doctoralDegreesTotal += Number(item.DoctoralDegrees2017) || 0;
            doctoralDegreesTotal += Number(item.DoctoralDegrees2018) || 0;
            doctoralDegreesTotal += Number(item.DoctoralDegrees2019) || 0;;
        }
    });

    return {
        fteOfSubmittedStaffTotal,
        totalIncome1320Total,
        doctoralDegreesTotal
    };
}
// Now you can use top10Totals and next10Totals for plotting on a graph
