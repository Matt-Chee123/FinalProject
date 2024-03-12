const fs = require('fs');
const { geo2topo } = require('topojson-server');
const { topology } = require('topojson-server');
const { simplify } = require('topojson-simplify');

// Function to convert GeoJSON to TopoJSON
function convertGeoJSONToTopoJSON(geojson) {
  // Convert GeoJSON to TopoJSON
  const topojsonData = geo2topo({ geojson });
  // Optionally, you can simplify the topology
  const simplifiedTopojson = simplify(topojsonData);

  return simplifiedTopojson;
}

// Function to read and write the file
function processFile(inputFilePath, outputFilePath) {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the GeoJSON file:', err);
      return;
    }

    try {
      const geojson = JSON.parse(data);
      const topojson = convertGeoJSONToTopoJSON(geojson);

      fs.writeFile(outputFilePath, JSON.stringify(topojson), 'utf8', (err) => {
        if (err) {
          console.error('Error writing the TopoJSON file:', err);
        } else {
          console.log('TopoJSON file has been created successfully.');
        }
      });
    } catch (err) {
      console.error('Error parsing the GeoJSON data:', err);
    }
  });
}

// Replace with your actual file paths
const inputGeoJSONFilePath = 'universities_coordinates.json';
const outputTopoJSONFilePath = 'path/to/your/output.topojson';

// Run the process
processFile(inputGeoJSONFilePath, outputTopoJSONFilePath);
