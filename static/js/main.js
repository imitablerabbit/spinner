// ----------------------------------------------------------------------------
// Canvas Variables
// ----------------------------------------------------------------------------

// The canvas object that is exposed in the HTML.
var canvas = document.getElementById('spinner');

// ----------------------------------------------------------------------------
// Form Variables
// ----------------------------------------------------------------------------

// Segment names text box. Each segment name is separated by a comma.
var segmentNamesTextbox = document.getElementById('segmentNames');

// Segment colors text box. Each segment will be assigned a color based on the
// values in this text box. Each value is separated by a comma. If there are
// less values than segments then the colors will be repeated. If there are more
// values than segments then the extra values will be ignored.
var segmentColorsTextbox = document.getElementById('segmentColors');

// ----------------------------------------------------------------------------
// Spinner Variables
// ----------------------------------------------------------------------------

var defaultSegmentNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var defaultSegmentColors = ["red", "green"];

var segmentNames = [];
var segmentColors = [];

var spinnerRot = Math.PI;
var spinnerSpeedDec = 0.0003;

// ----------------------------------------------------------------------------
// Main Execution
// ----------------------------------------------------------------------------

// The main entry point in the code. This is called once all of the page content
// has finished loading.
function main() {
    getSpinnerData();
    populateFormData();    

    console.log("Start Position: " + spinnerRot);
    console.log("Spinner Speed Dec: " + spinnerSpeedDec);

    // Create the spinner object with the canvas and the spinner rotation.
    var spinner = new Spinner(canvas, segmentNames, segmentColors);
    spinner.start();
}

// Gather the spinner data from the query parameters. If the query parameters
// are not found then the default values are used.
function getSpinnerData() {
    // Get the segment names from the query parameters. The segment names are
    // found under the "segmentNames" query parameter. Each name is split by a
    // comma.
    var params = new URLSearchParams(window.location.search);
    var segmentNamesString = params.get('segmentNames');
    if (segmentNamesString == null)
        segmentNamesString = defaultSegmentNames;
    segmentNames = segmentNamesString.split(",");

    var segmentColorsString = params.get('segmentColors');
    if (segmentColorsString == null)
        segmentColorsString = defaultSegmentColors;
    segmentColors = segmentColorsString.split(",");

}

// Repopulate the form data based on any query parameters. If the query parameters
// are not found then the form data use the default values.
function populateFormData() {
    // Encode the segment names and colors into a string joined by commas.
    var segmentNamesString = segmentNames.join(",");
    var segmentColorsString = segmentColors.join(",");
    segmentNamesTextbox.value = segmentNamesString;
    segmentColorsTextbox.value = segmentColorsString;
}

// Run the main function once all of the DOM content has been loaded.
document.addEventListener('DOMContentLoaded', function() {
    main();
}, false);

// TODO: Detect the current quadrant of the spinner using a bounding box of the
// outer edges of each spinner section and the spinners coordinate on the
// circumference. We can generate the segment collision boxes before the spinner
// is run and then check each one during the spinner update function. We can
// optimise the code by only checking the upcoming spinner collision as we know
// which direction the spinner is moving.

// TODO: Do not reduce the spinner speed whilst we are inside a blacklisted
// segment. This means that the spinner will never stop inside a particular
// zone.

// TODO: Add some color to the spinner.