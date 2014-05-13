/*
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

/* Below is a shim for requestAnimationFrame() */
/* Credit to Paul Irish, Tino Zijdel and Erik Möller */
/***************************************************************************************/

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
|| window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame)
window.requestAnimationFrame = function(callback, element) {
var currTime = new Date().getTime();
var timeToCall = Math.max(0, 16 - (currTime - lastTime));
var id = window.setTimeout(function() { callback(currTime + timeToCall); },
timeToCall);
lastTime = currTime + timeToCall;
return id;
};
if (!window.cancelAnimationFrame)
window.cancelAnimationFrame = function(id) {
clearTimeout(id);
};
}());

/***************************************************************************************/
/* reference code ends here */


var Animation = function(animationInput){
	this.id = undefined;
	this.startTime = undefined;
	this.duration = 1000;
	this.animationLoop = function(){
		var animationLoop = this.animationLoop;
		var currentTime = new Date().getTime();
		if(currentTime < this.startTime + this.duration){
			var rate = (currentTime - this.startTime) / this.duration;
			animationInput(rate);
		}else{
			animationInput(1);
			this.clear();
			return;
		}
		window.requestAnimationFrame(animationLoop);
	};
};

Animation.prototype.start = function(){
	this.startTime = new Date().getTime();
	this.id = window.requestAnimationFrame(this.animationLoop);
};

Animation.prototype.stop = function(){
	window.cancelAnimationFrame(this.id);
	this.clear();
};

Animation.prototype.pause = function(){
	this.pauseTime = new Date().getTime();
	window.cancelAnimationFrame(this.id);
	this.id = undefined;
};

Animation.prototype.resume = function(){
	var resumeTime = new Date().getTime();
	this.startTime += resumeTime - this.pauseTime;
	this.id = window.requestAnimationFrame(this.animationLoop);
};

Animation.prototype.clear = function(){
	this.id = undefined;
	this.startTime = undefined;
};
