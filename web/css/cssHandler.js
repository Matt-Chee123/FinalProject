function loadCSS(filename) {
  const link = document.createElement("link");
  link.href = filename;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

function removeCSS(filename) {
  const links = document.getElementsByTagName("link");
  for (let i = links.length - 1; i >= 0; i--) {
    if (links[i] && links[i].href && links[i].href.includes(filename)) {
      links[i].parentNode.removeChild(links[i]);
    }
  }
}

// Example usage
document.getElementById('institution-dropdown').addEventListener('change', function() {
  if (this.value !== 'Nation') {
    console.log('Search css loaded.');
    removeCSS('homeStyles.css');
    loadCSS('searchStyles.css');
  } else {
    console.log('Home css loaded.')
    removeCSS('searchStyles.css');
    loadCSS('homeStyles.css');
  }
});
