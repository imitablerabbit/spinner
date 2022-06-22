// ----------------------------------------------------------------------------
// Canvas Variables
// ----------------------------------------------------------------------------

// The canvas object that is exposed in the HTML.
var canvas = document.getElementById('spinner');

// The canvas context that we can draw on.
var context = canvas.getContext('2d');

// The refresh rate of the canvas. This equates to frames per second.
var refreshRate = 60;

// ----------------------------------------------------------------------------
// Spinner Variables
// ----------------------------------------------------------------------------

// The center position of the canvas based on the width and height. The width
// and height are determined inside the initial loading function.
var centerX, centerY;

// The radius of the circle to draw. This will get initialised to the width of
// the canvas during initialisation.
var radius;

// The proportion of distance from the center to the cirumference of the circle
// where the text will be written to. A value between 0 and 1 will add the text
// inside the circle.
var textInsetPercentage = 0.8;

// The number of segments that the spinner is divided into.
var numOfSegments = 12;

// The rate at which the spinner position update function is called.
var spinnerUpdateRate = 60;

// The point in radians of the spinner. This can be a value between 0 and Math.PI * 2.
// The start position is Math.PI as this places it at the top of the spinner rather
// than at the bottom.
var spinnerRot = Math.PI;

// The speed at which the spinner rotates. As time goes on this value will decrease by
// spinnerSpeedDec.
var spinnerSpeed = 0.1;

// The rate at which the speed delta decays for the spinner. The larger this number, the
// faster that the spinner will stop. Keeping this number static means that the spinner
// speed will slow down linearly until it reaches a stop.
var spinnerSpeedDec = 0.0003;

// Has the spinner stopped moving. This is detected when the spinnerSpeed is < 0
// and the spinnerSpeedDec has also been set to 0;
var hasSpinnerStopped = false;

// ----------------------------------------------------------------------------
// Spinner Functions
// ----------------------------------------------------------------------------

// Draws the spinner onto the canvas.
function drawSpinner() {
    if (canvas == null)
        return;

    if (context == null)
        return;

    // Clear the screen
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";

    // Draw the outer circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();

    // Draw the segments
    for (var i = 0; i < numOfSegments; i++) {
        var rotationIndividual = (Math.PI * 2 / numOfSegments);
        var rotation = i * rotationIndividual;

        var circumPointX = centerX + Math.sin(rotation) * radius;
        var circumPointY = centerY - Math.cos(rotation) * radius;

        var textRotation = rotation + (rotationIndividual / 2);
        var textPointX = centerX + Math.sin(textRotation) * (radius * textInsetPercentage);
        var textPointY = centerY - Math.cos(textRotation) * (radius * textInsetPercentage);

        context.save()

        // Draw the segment boundaries
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(circumPointX, circumPointY);
        context.stroke();

        // Write the text for a segment
        context.translate(textPointX, textPointY);
        context.rotate(textRotation);
        context.font = canvas.height / 15 + "px sans-serif";
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillText(i, 0, 0);

        context.restore();
    }

    // Draw the spinner on the canvas.
    var spinnerPointX = centerX + Math.sin(spinnerRot) * radius;
    var spinnerPointY = centerY + Math.cos(spinnerRot) * radius;
    context.save();
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(spinnerPointX, spinnerPointY);
    context.strokeStyle = "red";
    context.lineWidth = 5;
    context.stroke();
    context.restore();
}

// Change the spinner data each tick so that the spinning animation takes place.
function updateSpinnerPosition() {
    if (hasSpinnerStopped)
        return;

    // spinnerRot += spinnerSpeed; // anti-clockwise
    spinnerRot -= spinnerSpeed; // clockwise
    spinnerSpeed -= spinnerSpeedDec;
    if (spinnerSpeed < 0) {
        // TODO: We can trigger a spinner stopped event here. During that event
        // we can detect the spinners location and print it out on the screen.

        hasSpinnerStopped = true;
        spinnerSpeed = 0;
        spinnerSpeedDec = 0;
    }
}

// ----------------------------------------------------------------------------
// Main Execution
// ----------------------------------------------------------------------------

// The main entry point in the code. This is called once all of the page content
// has finished loading.
function main() {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    radius = (canvas.width / 2) - 20;

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

    drawSpinner();
    setInterval(drawSpinner, 1000 / refreshRate);
    setInterval(updateSpinnerPosition, 1000 / spinnerUpdateRate);
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
