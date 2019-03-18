/* VARIABLES **************************************************** */

// canvas setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

// timer object
var timerArc = undefined;
var incrementButton = undefined;

// timer variables
var volumeTimer = 0.9;
var percentTimer = 0;
var fontTimer = 'px Palatino';
var lineFactor = 0.05
var panicTime = 5;
var panicColor = '#ff0000';
var defaultColor = '#ffffff';

// increment variables
var incrementSize = 0.8;
var incrementWidth = 0.25;

// animation variables
var frame = 0;
var run = true;
var duration = 60;
var durationIncr = 30;
var refresh = 60;

// backGround colors
var startColor = '#000000';
var endColor = ['#DB1A22', '#A6141A'];

// alert sound
var alertSound = document.createElement('AUDIO');
alertSound.setAttribute('src','Alien Drum.mp3');
//alertSound.loop = true;



/* OBJECT ******************************************************* */

function Arc(x, y, radius) {
	// internal variables
	this.x = x;
	this.y = y;
	this.textSize = Math.min(this.x, this.y);
	this.radius = radius;
	this.color = defaultColor;
	
	// draw function
	this.draw = function() {
		// check color
		if(frame / refresh >= duration - panicTime) {
			this.color = panicColor;
			c.fillStyle = panicColor;
		} // end of if
		
		// default object colors
		else {
			this.color = defaultColor;
			c.fillStyle = defaultColor;
		} // end of else
		
		// draw arc
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 3 * Math.PI / 2, 3 * Math.PI / 2 + Math.PI * 2 * percentTimer, true);
		c.lineWidth = this.textSize * lineFactor;
		c.strokeStyle = this.color;
		c.stroke();
		
		// draw number
		c.font = this.textSize + fontTimer;
		c.textAlign = "center";
		c.fillText(duration - Math.floor(frame / refresh), this.x, this.y + this.textSize / 3);
	}; // end of draw
} // end of class circle



function Increment(x, y, radius) {
	// internal variables
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = defaultColor;
	
	// check button press
	this.check = function(x, y) {
		// check in diamond
		if(Math.abs(x - this.x) + Math.abs(y - this.y) < radius * incrementSize) {
			// check top button
			if((y - this.y) < -radius * (incrementSize - incrementWidth)) return -1;
			
			// check bottom button
			if((y - this.y) > radius * (incrementSize - incrementWidth)) return 1;
		} // end of if
			
		// default return
		return 0;
	} // end of check
	
	// draw function
	this.draw = function() {
		// check color
		if(frame / refresh >= duration - panicTime) {
			this.color = panicColor;
			c.fillStyle = panicColor;
		} // end of if
		
		// default object colors
		else {
			this.color = defaultColor;
			c.fillStyle = defaultColor;
		} // end of else
		
		// top triangle
		c.beginPath();
		c.moveTo(this.x, this.y - this.radius * incrementSize);
		c.lineTo(this.x - this.radius * incrementWidth, this.y - this.radius * (incrementSize - incrementWidth));
		c.lineTo(this.x + this.radius * incrementWidth, this.y - this.radius * (incrementSize - incrementWidth));
		c.closePath();

		// fill triangle
		c.fill();

		// bottom triangle
		c.beginPath();
		c.moveTo(this.x, this.y + this.radius * incrementSize);
		c.lineTo(this.x - this.radius * incrementWidth, this.y + this.radius * (incrementSize - incrementWidth));
		c.lineTo(this.x + this.radius * incrementWidth, this.y + this.radius * (incrementSize - incrementWidth));
		c.closePath();

		// fill triangle
		c.fill();
	}; // end of draw
} // end of class increment



/* FUNCTIONS **************************************************** */

// initiation
function init() {
	// update canvas dimension
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 5;
	
	// create object variables
	var radius = volumeTimer * Math.min(canvas.width, canvas.height) / 2;
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	
	// create timer object
	timerArc = new Arc(x, y, radius);
	
	// create increment object
	incrementButton = new Increment(x, y, radius);
} // end of init

// animation function
function animate() {
	// check end time
	if(frame > duration * refresh) {
		// background color
		c.fillStyle = endColor[Math.floor((frame / 25) % 2)];
	} // end of if
	
	// default background color
	else {
		c.fillStyle = startColor;
	} // end of else
	
	// fill background
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	// draw timer object
	timerArc.draw();
	
	// draw buttons;
	incrementButton.draw();
} // end of animate



/* EVENT ******************************************************** */

// frame
var interval = setInterval(function() {
	if(frame / refresh >= duration - panicTime && frame / refresh <= duration) {
		// play song
		alertSound.play();
	} // end of if
	else {
		// reset song
		alertSound.load();
	} // end of if
	
	// update timer arc percentage
	if(frame <= duration * refresh) {
		percentTimer = frame / duration / refresh;
	} // end of if
	
	// call animate
	animate();
	
	// update global frame
	if(run) {
		frame = frame + 1;
	} // end of if
}, 1000 / refresh); // end of set interval

//window.clearInterval(interval);



window.addEventListener('resize', function() {
	init();
}) // end of resize event listener

window.addEventListener('click', function(event) {
	// reset timer
	frame = 0;
	
	// check top button
	if(incrementButton.check(event.x, event.y) < 0) {
		duration += durationIncr;
	} // end of if
	
	// check bottom button
	if(incrementButton.check(event.x, event.y) > 0 && duration > durationIncr) {
		duration -= durationIncr;
	} // end of if
}) // end of mouse event listener */

window.addEventListener('touchstart', function(event) {
	// reset timer
	frame = 0;
	
	// check top button
	if(incrementButton.check(event.touches[0].clientX, event.touches[0].clientY) < 0) {
		duration += durationIncr;
	} // end of if
	
	// check bottom button
	if(incrementButton.check(event.touches[0].clientX, event.touches[0].clientY) > 0 && duration > durationIncr) {
		duration -= durationIncr;
	} // end of if
}) // end of touchstart event listener */

window.addEventListener('keydown', function(event) {
	// reset timer
	if(event.key != ' ') {
		frame = 0;
	} // end of if
	
	// pause timer
	else {
		run = false;
	} // end of if
	
	// check up arrow
	if(event.key == 'ArrowUp') {
		duration += durationIncr;
	} // end of if
	
	// check down arrow
	if(event.key == 'ArrowDown' && duration > durationIncr) {
		duration -= durationIncr;
	} // end of if
	
	// check number
	if(0 < Number(event.key)) {
		// update duration
		duration = Number(event.key) * durationIncr;
	} // end of if
}) // end of keydown event listener */

window.addEventListener('keyup', function(event) {
	// reset run
	run = true;
}) // end of keypress event listener */



/* START UP ***************************************************** */

init();