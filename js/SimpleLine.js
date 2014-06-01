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

var SimpleLine = (function(){
	var _c = function(startX,startY,endX,endY,lineWidth,className,id){
		this.div = this.init(startX,startY,endX,endY,lineWidth,className,id);
	};
	var _p = _c.prototype;
	
	/* helper functions */
	var transform = function(width,height){
		var length = Math.sqrt(width*width+height*height);
		var angle = Math.atan2(height,width)*180/Math.PI;
		return {length: length, angle: angle};
	};
	
	/* methods */
	_p.init = function(startX,startY,endX,endY,lineWidth,className,id){
		var div = document.createElement("div");
		var polarForm = transform(endX - startX, endY - startY);
		startX = startX || 0;
		startY = startY || 0;
		endX = endX || 0;
		endY = endY || 0;
		lineWidth = lineWidth || 1;
		TweenMax.set(div,{
			left: startX,
			top: startY,
			width: polarForm.length,
			height: lineWidth,
			transformOrigin: 'left 50%',
			rotation: polarForm.angle,
		});
		if(className){
			TweenMax.set(div,{
				className: className
			});
		}
		if(id){
			TweenMax.set(div,{
				id: id
			});
		}
		return div;
	};
	_p.setTo = function(startX,startY,endX,endY){
		var polarForm = transform(endX - startX, endY - startY);
		TweenMax.set(div,{
			left: startX,
			top: startY,
			width: polarForm.length,
			rotation: polarForm.angle,
		});
	};
	_p.setLineWidth = function(lineWidth){
		TweenMax.set(div,{
			height: lineWidth
		});
	};
	
	return _c;
})();

