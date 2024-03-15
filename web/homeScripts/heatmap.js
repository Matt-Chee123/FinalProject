// render heatmap when uoa changes
document.getElementById('unit-of-assessment-dropdown').addEventListener('change', function() {
  const selectedUoA = this.value;
  const selectedProfile = document.getElementById('profile-dropdown').value;
  fetchAndRenderHeatmap(selectedUoA, selectedProfile);
});

// initial heatmap render
document.addEventListener('DOMContentLoaded', function() {
  const initialUoA = document.getElementById('unit-of-assessment-dropdown').value;
  const initialProfile = document.getElementById('profile-dropdown').value;
  fetchAndRenderHeatmap(initialUoA, initialProfile);
});

// render heatmap when profile changes
document.getElementById('profile-dropdown').addEventListener('change', function() {
    const selectedProfile = this.value;
    const selectedUoA = document.getElementById('unit-of-assessment-dropdown').value;
    fetchAndRenderHeatmap(selectedUoA, selectedProfile);
});

function initMap(heatmapData) {

  const profile = heatmapData[0].profile;

  // set title
  const heatmapTitle = document.getElementById('heatmap-title');

  heatmapTitle.textContent = `${profile} GPA Heatmap`;

  //google heatmap configurations
  const map = new google.maps.Map(document.getElementById('heatmap-container'), {
    zoom: 6,
    center: { lat: 54.3781, lng: -3.4360 },
    mapTypeId: 'terrain',
    streetViewControl: false,
    mapTypeControl: false
  });

  // arary to hold markers
  const markers = [];

  // create infor window
  const infoWindow = new google.maps.InfoWindow();
  heatmapData.forEach(item => {
    // create marker for each location
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(item.lat, item.lon),
      map: map,
      title: item.name
    });

    // click listener to open info window for each marker
    marker.addListener('click', () => {
      infoWindow.setContent(`<div class="info-window">
                              <h3>${item.name}</h3>
                              <p>${item.profile} GPA: ${item.value}</p>
                            </div>`);
      infoWindow.open(map, marker);
    });

    markers.push(marker);
  });

  // add clustering
  const markerCluster = new MarkerClusterer(map, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });

  const MIN_ZOOM_LEVEL = 7; // min zoom level to see markers (set so initially all markers are hidden)


  map.addListener('zoom_changed', () => {
    const currentZoom = map.getZoom();

    // show markers if zoom level is greater than or equal to min zoom level
    const isVisible = currentZoom >= MIN_ZOOM_LEVEL;
    markers.forEach(marker => marker.setVisible(isVisible));

    // if not visible, clear the clusterer
    if (!isVisible) {
      markerCluster.clearMarkers();
    } else {
      // if visible, add the markers to the clusterer
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

  // convert data to google heatmap format
    const googleHeatmapData = heatmapData.map(item => {
        let weight;
        //emphasizes weights between 3-4
        if (item.value >= 3) {
            weight = item.value + (item.value - 3) * 10;
        } else {
            // keep weight same between 0-3
            weight = item.value;
        }
        return {
          location: new google.maps.LatLng(item.lat, item.lon),
          weight: weight
        };
    });
  // create heatmap layer
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: googleHeatmapData,
    map: map,
    dissipating: true,
    radius: 30,
    maxIntensity: 14,
    gradient: [ //gradient of 'heat' on the map
        'rgba(0, 255, 255, 0)',
        'rgba(100, 200, 255, 0.1)',
        'rgba(150, 150, 255, 0.2)',
        'rgba(200, 100, 255, 0.3)',
        'rgba(255, 100, 200, 0.4)',
        'rgba(255, 150, 150, 0.5)',
        'rgba(255, 200, 100, 0.6)',
        'rgba(255, 250, 50, 0.7)',
        'rgba(255, 150, 0, 0.8)',
        'rgba(255, 50, 0, 0.9)',
        'rgba(255, 0, 0, 1)'
    ]
  });

}


//fetch and render heatmap function
async function fetchAndRenderHeatmap(uofaName, profile = 'Overall') {
  try {
  //retrieve uni coords and data and filter for appropriate profile and map data
    const universityCoordinates = await fetchUniversityCoordinates();
    const allData = await fetchUoAData(uofaName);
    const overallData = allData.filter(data => data.ProfileType == profile);
    const heatmapData = overallData.map(record => {
      const uniCoords = universityCoordinates[record.UniversityName];
      return {
        name: record.UniversityName,
        lat: uniCoords[0],
        lon: uniCoords[1],
        value: record.AverageScore,
        profile: record.ProfileType
      };
    });
    initMap(heatmapData); // call initMap with the prepared heatmap data
  } catch (error) {
    console.error('Failed to render heatmap:', error);
  }
}

//fetch coords from set json file
function fetchUniversityCoordinates() {
    return fetch('homeScripts/universities_coordinates.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

// function fetch data
function fetchUoAData(uofaName = 'Computer Science and Informatics') {
    return fetch(`https://cgqfvktdhb.execute-api.eu-north-1.amazonaws.com/main/items/all?uofaName=${encodeURIComponent(uofaName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

