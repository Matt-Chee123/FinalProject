function fetchUniversityCoordinates() {
  return fetch('../homeScripts/universities_coordinates.json')
  .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

function fetchUoAData(uofaName = 'Computer Science and Informatics') {
    return fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/all?uofaName=${encodeURIComponent(uofaName)}`)
    .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
          }
          return response.json();
    });
}

    // Paste your Highcharts mapChart code here
async function fetchAndRenderHeatmap(uofaName) {
  try {
    // Fetch university coordinates
    const universityCoordinates = await fetchUniversityCoordinates();
    const allData = await fetchUoAData(uofaName);
    const overallData = allData.filter(data => data.ProfileType == 'Overall');
    const heatmapData = [];
    // Iterate over the coordinates and fetch corresponding UoA data
    for (const uniName in universityCoordinates) {
      if (universityCoordinates.hasOwnProperty(uniName)) {
        // Find the specific record for this university
        const specificRecord = overallData.find(data => data.UniversityName === uniName);

        // If a record was found, push it to the heatmapData array
        if (specificRecord) {
          heatmapData.push({
            name: uniName,
            lat: universityCoordinates[uniName][1],
            lon: universityCoordinates[uniName][0],
            value: specificRecord.AverageScore
          });
        }
      }
    }
    console.log('heatmapData:',heatmapData);
    // Render the Highcharts map
    Highcharts.mapChart('heatmap-container', {
      chart: {
        map: 'countries/gb/gb-all'
      },
      title: {
        text: 'UK Universities REF2021 Assessment Score Heatmap'
      },
      mapNavigation: {
        enabled: true,
        enableDoubleClickZoomTo: true
      },
      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
      },
      series: [{
        type: 'mapbubble',
        data: heatmapData,
        name: 'University Score',
        // Omit joinBy if you are using latitude and longitude for positioning
        minSize: 4,
        maxSize: '12%',
        tooltip: {
          pointFormat: '{point.name}: {point.value}'
        }
      }]
    });
  } catch (error) {
    console.error('Failed to render heatmap:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and render the heatmap
    //fetchAndRenderHeatmap('Computer Science and Informatics');
    initMap();
});

function initMap() {
  // Create a map centered in the UK
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: { lat: 54.3781, lng: -3.4360 }, // Approximate center of the UK
    mapTypeId: 'terrain'
  });

  // Create an array of weighted location points for your heatmap data
  const heatmapData = [
    { location: new google.maps.LatLng(57.1648, -2.1015), weight: 3.2 },
    { location: new google.maps.LatLng(52.4183, -4.0639), weight: 3.17 },
    // ... other data points
  ];

  // Create the heatmap layer using your data
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map
  });
}