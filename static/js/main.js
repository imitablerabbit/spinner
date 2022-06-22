// ----------------------------------------------------------------------------
// Canvas Variables
// ----------------------------------------------------------------------------

// The canvas object that is exposed in the HTML.
var canvas = document.getElementById('spinner');

// ----------------------------------------------------------------------------
// Main Execution
// ----------------------------------------------------------------------------

var spinner;

// The main entry point in the code. This is called once all of the page content
// has finished loading.
function main() {
    // Randomise the position on the spinner. This should also help make sure
    // that other results are closer to random rather than starting in the same
    // place.
    spinnerRot = Math.random() * Math.PI * 2;
    console.log("Start Position: " + spinnerRot);

    // Randomly generate the speed decay rate. This will mean that the spinner
    // will stop at random locations inside the circle.
    var minSpinnerSpeedDec = 0.0002;
    var maxSpinnerSpeedDec = 0.0004;
    var spinnerSpeedDecDiff = maxSpinnerSpeedDec - minSpinnerSpeedDec;
    spinnerSpeedDec = (Math.random() * spinnerSpeedDecDiff) + minSpinnerSpeedDec;
    console.log("Spinner Speed Dec: " + spinnerSpeedDec);

    // Create the spinner object with the canvas and the spinner rotation.
    spinner = new Spinner(canvas, spinnerRot, spinnerSpeedDec);
    spinner.start();
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

// TODO: Move the spinner code into its own class/object structure to help keep
// it clean. This will help us respond to events more easily.
