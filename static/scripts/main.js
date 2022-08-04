// ----------------------------------------------------------------------------
// Canvas Variables
// ----------------------------------------------------------------------------

// The canvas object that is exposed in the HTML.
var canvas = document.getElementById('spinner');

// ----------------------------------------------------------------------------
// Form Variables
// ----------------------------------------------------------------------------

// Segment names text box. Each segment name is separated by a comma.
var segmentNamesTextbox = document.getElementById('segment-names');

// Ignore names text box. Each ignore name is separated by a comma. The ignore
// names are used to ignore segments that we do not want to land on. If a value
// is landed on in the ignore names then the spinner will spin again.
var ignoreNamesTextbox = document.getElementById('ignore-names');

// Segment colors text box. Each segment will be assigned a color based on the
// values in this text box. Each value is separated by a comma. If there are
// less values than segments then the colors will be repeated. If there are more
// values than segments then the extra values will be ignored.
var segmentColorsTextbox = document.getElementById('segment-colors');

// ----------------------------------------------------------------------------
// Spinner Variables
// ----------------------------------------------------------------------------

var defaultSegmentNames = ["Mark", "Sam","Tom","Carl","Jason","Ed","Bo"];
var defaultIgnoreNames = ["Mark"];
var defaultSegmentColors = ["red", "green"];

var segmentNames = [];
var ignoreNames = [];
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
    var spinner = new Spinner(canvas, segmentNames, ignoreNames, segmentColors);
    spinner.start();
}

// Gather the spinner data from the query parameters. If the query parameters
// are not found then the default values are used.
function getSpinnerData() {
    // Get the segment names, ignore names and colors from the query parameters.
    // Each value is split by a comma.
    var params = new URLSearchParams(window.location.search);
    var segmentNamesString = params.get('segmentNames');
    if (segmentNamesString == null)
        segmentNames = defaultSegmentNames;
    else 
        segmentNames = segmentNamesString.split(",");

    var ignoreNamesString = params.get('ignoreNames');
    if (ignoreNamesString == null)
        ignoreNames = defaultIgnoreNames;
    else 
        ignoreNames = ignoreNamesString.split(",");   

    var segmentColorsString = params.get('segmentColors');
    if (segmentColorsString == null)
        segmentColors = defaultSegmentColors;
    else
        segmentColors = segmentColorsString.split(",");

}

// Repopulate the form data based on any query parameters. If the query parameters
// are not found then the form data use the default values.
function populateFormData() {
    // Encode the segment names and colors into a string joined by commas.
    var segmentNamesString = segmentNames.join(",");
    var ignoreNamesString = ignoreNames.join(",");
    var segmentColorsString = segmentColors.join(",");
    segmentNamesTextbox.value = segmentNamesString;
    ignoreNamesTextbox.value = ignoreNamesString;
    segmentColorsTextbox.value = segmentColorsString;
}

// Run the main function once all of the DOM content has been loaded.
document.addEventListener('DOMContentLoaded', function() {
    main();
}, false);
