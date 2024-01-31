document.getElementById("searchInstitution").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        searchFunction();
    }
});

function searchFunction() {
    // Get the value of the input field
    var inputValue = document.getElementById("searchInstitution").value;

    // Save the input in localStorage or sessionStorage
    localStorage.setItem("lastSearch", inputValue); // Or sessionStorage.setItem("lastSearch", inputValue);

    // Redirect to a new HTML page with the query parameter
    window.location.href = 'uniAnalytics.html?query=' + encodeURIComponent(inputValue);
}

