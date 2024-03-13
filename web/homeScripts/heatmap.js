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
  const markerCluster = new MarkerClusterer(map, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });

  const MIN_ZOOM_LEVEL = 7; // Adjust this zoom level as needed

  // Initially set all markers' visibility to false
  // No need to do this since we are handling visibility with the zoom_changed listener
  // markers.forEach(marker => marker.setVisible(false));

  // Add a zoom changed event listener to the map

  map.addListener('zoom_changed', () => {
    const currentZoom = map.getZoom();

    // Toggle marker and cluster visibility based on zoom level
    const isVisible = currentZoom >= MIN_ZOOM_LEVEL;
    markers.forEach(marker => marker.setVisible(isVisible));

    // If the clusters should be invisible at this zoom level, clear them
    if (!isVisible) {
      markerCluster.clearMarkers();
    } else {
      // Re-add markers to the clusterer when zooming in
      markerCluster.addMarkers(markers);
    }
  });
  const initialZoom = map.getZoom();
  if (initialZoom < MIN_ZOOM_LEVEL) {
    markers.forEach(marker => marker.setVisible(false));
    markerCluster.clearMarkers();
  } else {
    markerCluster.addMarkers(markers);
  }

  // Convert your data to the format expected by Google Maps HeatmapLayer
    const googleHeatmapData = heatmapData.map(item => {
        // Ensure the weight is positive and emphasize differences in the 3-4 range
        let weight;
        if (item.value >= 3) {
            // Apply a transformation that significantly increases weight for values in the 3-4 range
            weight = item.value + (item.value - 3) * 10; // This ensures a smooth transition and correct hierarchy
        } else {
            // For values below 3, you can either keep them as is or apply a slight increase
            weight = item.value;
        }
        return {
          location: new google.maps.LatLng(item.lat, item.lon),
          weight: weight
        };
    });
  // Create the heatmap layer using your data
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: googleHeatmapData,
    map: map,
    dissipating: true, // Adjust as needed
    radius: 30, // Adjust the radius as needed
    maxIntensity: 14,
    gradient: [
        'rgba(0, 255, 255, 0)',        // Transparent for the lowest intensity
        'rgba(100, 200, 255, 0.1)',    // Very low intensity - for values much lower than 10
        'rgba(150, 150, 255, 0.2)',    // Low intensity - approaching the 10 mark
        'rgba(200, 100, 255, 0.3)',    // Lower-mid intensity - around 10 to 11
        'rgba(255, 100, 200, 0.4)',    // Mid intensity - around 11 to 12
        'rgba(255, 150, 150, 0.5)',    // Upper-mid intensity - around 12 to 13
        'rgba(255, 200, 100, 0.6)',    // High intensity - around 13
        'rgba(255, 250, 50, 0.7)',     // Very high intensity - nearing 14
        'rgba(255, 150, 0, 0.8)',      // Nearing the highest intensity - just below 14
        'rgba(255, 50, 0, 0.9)',      // Almost at the highest intensity - slightly below 14
        'rgba(255, 0, 0, 1)'           // Highest intensity - 14
    ]
  });

  // Log the heatmap for debugging
}


async function fetchAndRenderHeatmap(uofaName, profile = 'Overall') {
  try {
    const universityCoordinates = await fetchUniversityCoordinates();
    const allData = await fetchUoAData(uofaName);
    const overallData = allData.filter(data => data.ProfileType == profile);
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

