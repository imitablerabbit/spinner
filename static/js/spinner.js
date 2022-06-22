// Spinner class that will render the spinner onto a given canvas. The spinner
// will be rendered as a circle with a number of segments. The spinner will
// be updated based on the refresh rate of the object.
function Spinner(canvas, spinnerRot, spinnerSpeedDec) {
    // We must at least have a canvas in order to draw the spinner.
    if (canvas == null)
        return;

    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.radius = (canvas.width / 2) - 20;
    
    // Check if the user has provided a spinner rotation value and a spinnerSpeedDec.
    // If they have then we will use that value. If they have not then we will use
    // the default value.
    if (spinnerRot != null)
        this.spinnerRot = spinnerRot;
    if (spinnerSpeedDec != null)
        this.spinnerSpeedDec = spinnerSpeedDec;
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

// The number of segments that the spinner is divided into.
Spinner.prototype.numOfSegments = 12;

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

// ----------------------------------------------------------------------------
// Spinner Functions
// ----------------------------------------------------------------------------

// Starts the spinner. This will render the spinner on the canvas and then call
// the update function every spinnerUpdateRate frames.
Spinner.prototype.start = function() {
    updateInterval = setInterval(function(self) {
        self.update();
    }, 1000 / this.refreshRate, this);
}

// Stops the spinner. This will clear the update interval and reset the spinner.
Spinner.prototype.stop = function() {
    clearInterval(updateInterval);
    this.updateInterval = null;
    this.reset();
}

// Resets the spinner. This will reset the spinner position and speed.
Spinner.prototype.reset = function() {
    this.spinnerRot = Math.PI;
    this.spinnerSpeed = 0.1;
    this.hasSpinnerStopped = false;
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
    for (var i = 0; i < this.numOfSegments; i++) {
        var rotationIndividual = (Math.PI * 2 / this.numOfSegments);
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
        this.context.fillStyle = "black";
        this.context.fillText(i, 0, 0);

        this.context.restore();
    }

    // Draw the spinner on the canvas.
    var spinnerPointX = this.centerX + Math.sin(this.spinnerRot) * this.radius;
    var spinnerPointY = this.centerY + Math.cos(this.spinnerRot) * this.radius;
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

    // spinnerRot += spinnerSpeed; // anti-clockwise
    this.spinnerRot -= this.spinnerSpeed; // clockwise
    this.spinnerSpeed -= this.spinnerSpeedDec;
    if (this.spinnerSpeed < 0) {
        // TODO: We can trigger a spinner stopped event here. During that event
        // we can detect the spinners location and print it out on the screen.

        this.hasSpinnerStopped = true;
    }
}
