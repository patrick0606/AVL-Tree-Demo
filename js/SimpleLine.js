/**
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
 *  
 */

window.SimpleLine = window.SimpleLine || (function(){
	
	var _c = function(startX,startY,endX,endY,lineWidth,className,id){
		this.startX = startX || 0;
		this.startY = startY || 0;
		this.endX = endX || 0;
		this.endY = endY || 0;
		this.lineWidth = lineWidth || 1;
		this.div = null;
		this.init(className,id);
	};
	var _p = _c.prototype;
	
	/* helper functions */
	var transform = function(width,height){
		var length = Math.sqrt(width*width+height*height);
		var angle = Math.atan2(height,width)*180/Math.PI;
		return {length: length, angle: angle};
	};
	
	
	/* methods */
	_p.renderLine = function(){
		var polarForm = transform(this.endX - this.startX, this.endY - this.startY);
		TweenMax.set(this.div,{
			left: this.startX,
			top: this.startY - this.lineWidth / 2,
			height: this.lineWidth,
			width: polarForm.length,
			rotation: polarForm.angle,
		});
	};
	_p.init = function(className,id){
		this.div = document.createElement("div");
		TweenMax.set(this.div,{
			transformOrigin: 'left 50%',
		});
		if(className){
			TweenMax.set(this.div,{
				className: className
			});
		}
		if(id){
			TweenMax.set(this.div,{
				id: id
			});
		}
		this.renderLine();
	};
	_p.setTo = function(startX,startY,endX,endY){
		this.startX = startX || this.startX;
		this.startY = startY || this.startY;
		this.endX = endX || this.endX;
		this.endY = endY || this.endY;
		this.renderLine();
	};
	_p.setLineWidth = function(lineWidth){
		this.lineWidth = lineWidth || this.lineWidth;
		this.renderLine();
	};
	_p.hide = function(){
		$(this.div).addClass('hidden');
	};
	_p.show = function(){
		$(this.div).removeClass('hidden');
	};
	return _c;
})();

