// Spinner class that will render the spinner onto a given canvas. The spinner
// will be rendered as a circle with a number of segments. The spinner will
// be updated based on the refresh rate of the object.
function Spinner(canvas, segmentNames, segmentColors) {
    // We must at least have a canvas in order to draw the spinner.
    if (canvas == null)
        return;

    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.radius = (canvas.width / 2) - 20;

    // Randomise the position on the spinner. This should also help make sure
    // that other results are closer to random rather than starting in the same
    // place.
    this.spinnerRot = Math.random() * Math.PI * 2;

    // Randomly generate the speed decay rate. This will mean that the spinner
    // will stop at random locations inside the circle.
    var minSpinnerSpeedDec = 0.0002;
    var maxSpinnerSpeedDec = 0.0004;
    var spinnerSpeedDecDiff = maxSpinnerSpeedDec - minSpinnerSpeedDec;
    this.spinnerSpeedDec = (Math.random() * spinnerSpeedDecDiff) + minSpinnerSpeedDec;
    
    // Check if segmentNames and segmentColors are valid.
    if (segmentNames != null)
        this.segmentNames = segmentNames;
    if (segmentColors != null)
        this.segmentColors = segmentColors;

    // Add an event listener to the canvas to listen for mouse clicks. This will
    // spin the spinner.
    this.canvas.addEventListener("click", function(event) {
        this.spin();
    }.bind(this));
            
}

// ----------------------------------------------------------------------------
// Spinner Variables
// ----------------------------------------------------------------------------

// The refresh rate of the canvas. This equates to frames per second. The spinner
// will update at this rate on the canvas.
Spinner.prototype.refreshRate = 60;

// The center position of the canvas based on the width and height. The width
// and height are determined inside the initial loading function.
Spinner.prototype.centerX = 0;
Spinner.prototype.centerY = 0;

// The radius of the circle to draw. This will get initialised to the width of
// the canvas during initialisation.
Spinner.prototype.radius = 20;

// The proportion of distance from the center to the cirumference of the circle
// where the text will be written to. A value between 0 and 1 will add the text
// inside the circle.
Spinner.prototype.textInsetPercentage = 0.8;

// The rate at which the spinner position update function is called.
Spinner.prototype.spinnerUpdateRate = 60;

// The point in radians of the spinner. This can be a value between 0 and Math.PI * 2.
// The start position is Math.PI as this places it at the top of the spinner rather
// than at the bottom.
Spinner.prototype.spinnerRot = Math.PI;

// The speed at which the spinner rotates. As time goes on this value will decrease by
// spinnerSpeedDec.
Spinner.prototype.spinnerSpeed = 0.1;

// The rate at which the speed delta decays for the spinner. The larger this number, the
// faster that the spinner will stop. Keeping this number static means that the spinner
// speed will slow down linearly until it reaches a stop.
Spinner.prototype.spinnerSpeedDec = 0.0003;

// Has the spinner stopped moving. This is detected when the spinnerSpeed is < 0
// and the spinnerSpeedDec has also been set to 0;
Spinner.prototype.hasSpinnerStopped = false;

// updateInterval is the interval handle for the update function. This is first
// created in the start function and then reset when the stop function is called.
Spinner.prototype.updateInterval = null;

// segmentNames is an array of strings that will be printed inside each segment.
// The number of strings in the array dictates the number of segments.
Spinner.prototype.segmentNames = ["A", "B", "C", "D", "E", "F", "G", "H"];

// segmentColors is an array of colors that will be used to draw the segments.
// Each segment will be drawn with a different color from the array based on the
// index of the segment. If the index is greater than the length of the array
// then the index will be modulus the length of the array. This will ensure that
// the colors are always in the array. If there are more colors than segments
// then the colors will be ignored when they exceed the number of segments.
Spinner.prototype.segmentColors = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#00FFFF", "#FF00FF", "#C0C0C0", "#000000"
];

// ----------------------------------------------------------------------------
// Spinner Functions
// ----------------------------------------------------------------------------

// Starts the spinner. This will render the spinner on the canvas and then call
// the update function every spinnerUpdateRate frames.
Spinner.prototype.start = function() {
    this.reset();
    updateInterval = setInterval(function(self) {
        self.update();
    }, 1000 / this.refreshRate, this);
}

// Stops the spinner. This will clear the update interval and reset the spinner.
Spinner.prototype.stop = function() {
    clearInterval(updateInterval);
    this.updateInterval = null;
}

// Resets the spinner. This will reset the spinner position and speed.
Spinner.prototype.reset = function() {
    // Randomise the position on the spinner. This should also help make sure
    // that other results are closer to random rather than starting in the same
    // place.
    this.spinnerRot = Math.random() * Math.PI * 2;

    // Randomly generate the speed decay rate. This will mean that the spinner
    // will stop at random locations inside the circle.
    var minSpinnerSpeedDec = 0.0002;
    var maxSpinnerSpeedDec = 0.0004;
    var spinnerSpeedDecDiff = maxSpinnerSpeedDec - minSpinnerSpeedDec;
    this.spinnerSpeedDec = (Math.random() * spinnerSpeedDecDiff) + minSpinnerSpeedDec;
    this.spinnerSpeed = 0.1;
    
    // Make sure to reset the stop state of the spinner. This will allow us to
    // continue rendering the spinner.
    this.hasSpinnerStopped = false;
}

// Spin the wheel from scratch. This will reset the spinner position and speed
// and then start the spinner.
Spinner.prototype.spin = function() {
    this.stop();
    this.reset();
    this.start();
}

// update will update the spinner position and draw the spinner continuously
// based on the refreshRate. This should be called every frame by the
// setInterval function in the start function.
Spinner.prototype.update = function() {
    this.drawSpinner();
    this.updateSpinnerPosition();
}

// Draws the spinner onto the canvas.
Spinner.prototype.drawSpinner = function() {
    if (this.canvas == null)
        return;

    if (this.context == null)
        return;

    // Clear the screen
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = "black";

    // Draw the outer circle
    this.context.beginPath();
    this.context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    this.context.stroke();

    // Draw the segments
    var rotationIndividual = (Math.PI * 2 / this.segmentNames.length);
    for (var i = 0; i < this.segmentNames.length; i++) {
        var rotation = i * rotationIndividual;

        var circumPointX = this.centerX + Math.sin(rotation) * this.radius;
        var circumPointY = this.centerY - Math.cos(rotation) * this.radius;

        var textRotation = rotation + (rotationIndividual / 2);
        var textPointX = this.centerX + Math.sin(textRotation) * (this.radius * this.textInsetPercentage);
        var textPointY = this.centerY - Math.cos(textRotation) * (this.radius * this.textInsetPercentage);

        this.context.save()

        // Draw the segment boundaries
        this.context.beginPath();
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(circumPointX, circumPointY);
        this.context.stroke();

        // Write the text for a segment
        this.context.translate(textPointX, textPointY);
        this.context.rotate(textRotation);
        this.context.font = this.canvas.height / 15 + "px sans-serif";
        this.context.textAlign = "center";
        this.context.fillStyle = this.segmentColors[i % this.segmentColors.length];
        this.context.fillText(this.segmentNames[i], 0, 0);

        this.context.restore();
    }

    // Draw the spinner on the canvas.
    var spinnerPointX = this.centerX + Math.sin(this.spinnerRot) * this.radius;
    var spinnerPointY = this.centerY - Math.cos(this.spinnerRot) * this.radius;
    this.context.save();
    this.context.beginPath();
    this.context.moveTo(this.centerX, this.centerY);
    this.context.lineTo(spinnerPointX, spinnerPointY);
    this.context.strokeStyle = "red";
    this.context.lineWidth = 5;
    this.context.stroke();
    this.context.restore();
}

// updateSpinnerPosition will update the position of the spinner on the canvas.
// This function is called repeatedly within the update function. It will detect
// when the spinner has stopped and then call the callback function 'stopped'.
Spinner.prototype.updateSpinnerPosition = function() {
    if (this.hasSpinnerStopped)
        return;

    // Constrain the spinner rotation to the range of 0 to 2PI.
    this.spinnerRot += this.spinnerSpeed;
    if (this.spinnerRot < 0)
        this.spinnerRot += Math.PI * 2;
    else if (this.spinnerRot > Math.PI * 2)
        this.spinnerRot -= Math.PI * 2;

    this.spinnerSpeed -= this.spinnerSpeedDec;
    if (this.spinnerSpeed < 0) {
        var index = this.detectSegment();   
        this.onStop(index);
        this.hasSpinnerStopped = true;
    }
}

// detectSegment will detect which segment the spinner is currently on. This
// will return the index of the segment that the spinner is on. We detect this
// by detecting the angle of the spinner vs the proportion of the circumference
// of the wheel.
Spinner.prototype.detectSegment = function() {
    var rotation = this.spinnerRot;
    var proportion = rotation / (Math.PI * 2);
    var index = Math.floor(proportion * this.segmentNames.length);
    return index;
}

// Callback function that is called when the spinner has stopped and landed on
// a segment. This will be passed the index of the segment that the spinner
// landed on. By default, this function will print the segment name and index
// to the console.
Spinner.prototype.onStop = function(index) {
    console.log("Spinner stopped on index " + index +
                ", segment " +this.segmentNames[index]);
}

