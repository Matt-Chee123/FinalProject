document.getElementById('unit-of-assessment-dropdown').addEventListener('change', function() {
  const selectedUoA = this.value;
  const selectedProfile = document.getElementById('profile-dropdown').value;
  fetchAndRenderHeatmap(selectedUoA, selectedProfile);
});

// Initial render
document.addEventListener('DOMContentLoaded', function() {
  const initialUoA = document.getElementById('unit-of-assessment-dropdown').value;
  const initialProfile = document.getElementById('profile-dropdown').value;
  fetchAndRenderHeatmap(initialUoA, initialProfile);
});

document.getElementById('profile-dropdown').addEventListener('change', function() {
    const selectedProfile = this.value;
    const selectedUoA = document.getElementById('unit-of-assessment-dropdown').value;
    fetchAndRenderHeatmap(selectedUoA, selectedProfile);
});

function initMap(heatmapData) {
  // Assuming all heatmapData items have the same profile,
  // we can just take the profile from the first item.
  const profile = heatmapData[0].profile;

  // Set the title with the profile
  const heatmapTitle = document.getElementById('heatmap-title');

  heatmapTitle.textContent = `${profile} GPA Heatmap`;
  const map = new google.maps.Map(document.getElementById('heatmap-container'), {
    zoom: 6,
    center: { lat: 54.3781, lng: -3.4360 }, // Centered in the UK
    mapTypeId: 'terrain',
    streetViewControl: false, // Hide Street View control
    mapTypeControl: false     // Hide Map/Satellite toggle
  });

  // Prepare an array to hold all markers for clustering
  const markers = [];

  // Create a single InfoWindow that will be reused
  const infoWindow = new google.maps.InfoWindow();
  heatmapData.forEach(item => {
    // Create a marker for each location
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(item.lat, item.lon),
      map: map,
      title: item.name
    });

    // Add a click listener to open the InfoWindow when the marker is clicked
    marker.addListener('click', () => {
      infoWindow.setContent(`<div class="info-window">
                              <h3>${item.name}</h3>
                              <p>${item.profile} GPA: ${item.value}</p>
                            </div>`);
      infoWindow.open(map, marker);
    });

    // Push the marker to the array
    markers.push(marker);
  });

  // Add marker clustering
  new MarkerClusterer(map, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });

  // Convert your data to the format expected by Google Maps HeatmapLayer
  const googleHeatmapData = heatmapData.map(item => {
    return {
      location: new google.maps.LatLng(item.lat, item.lon),
      weight: Math.pow(item.value, 2) // Squaring the value to enhance higher values
    };
  });
  // Create the heatmap layer using your data
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: googleHeatmapData,
    map: map,
    radius: 22, // Adjust the radius as needed
    maxIntensity: 16 // Adjust the max intensity as needed
  });

  // Log the heatmap for debugging
}


async function fetchAndRenderHeatmap(uofaName, profile = 'Overall') {
  try {
    const universityCoordinates = await fetchUniversityCoordinates();
    const allData = await fetchUoAData(uofaName);
    const overallData = allData.filter(data => data.ProfileType == profile);
    console.log('change', overallData)
    const heatmapData = overallData.map(record => {
      const uniCoords = universityCoordinates[record.UniversityName];
      return {
        name: record.UniversityName,
        lat: uniCoords[0],  // Assuming the structure is [longitude, latitude]
        lon: uniCoords[1],
        value: record.AverageScore,
        profile: record.ProfileType
      };
    });
    initMap(heatmapData); // Call initMap with the prepared heatmap data
  } catch (error) {
    console.error('Failed to render heatmap:', error);
  }
}







    function fetchUniversityCoordinates() {
        return fetch('homeScripts/universities_coordinates.json')
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

