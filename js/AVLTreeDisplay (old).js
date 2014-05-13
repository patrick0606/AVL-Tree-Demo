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
 */

var AVLTreeDisplay = {
	nodeSize : 40,
		nodeCanvasHeight : 40,
		nodeCanvasWidth : 90,
	treeSize : {x:1,y:1},
	animationSpeed : 1,
	bounceHeight : 1,
	showBalance : false,
	showHeight : false,
	showNull : true,
	shape : "classic",
	stepByStep : false,
	bounceOnStep : false,
	animatedRedo : false,
	mute : true,
	error : ""
};

if(AVLTree === undefined){
	AVLTreeDisplay.error += "\nAVLTree.js is not linked.";
}




AVLTreeDisplay.nodeCanvasInit = function(){
	var newCanvas = document.createElement("canvas");
	newCanvas.className = "treeNodeCanvas";
	newCanvas.width = AVLTreeDisplay.nodeCanvasWidth;
	newCanvas.height = AVLTreeDisplay.nodeCanvasHeight;  
	return newCanvas;
};

AVLTreeDisplay.nodePtrCanvasInit = function(){
	var newCanvas = document.createElement("canvas");
	newCanvas.className = "treeNodePtr";
	return newCanvas;
};

AVLTreeDisplay.nullCanvasInit = function(){
	var newCanvas = document.createElement("canvas");
	newCanvas.className = "nullCanvas";
	return newCanvas;
};

treeNodePtr.prototype.display = function(){
	this.postOrderTraversal(function(input){input.drawNode();});
	this.postOrderTraversal(function(input){input.drawKey();});
	return this.attachElements();
	
};

treeNodePtr.prototype.attachElements = function(){
	if(this.target === undefined){
		this.myCanvas.getContext("2d").clearRect(0,0,this.myCanvas.width,this.myCanvas.height);
		this.myCanvas.className = "nullCanvas";
		return this.myCanvas;
	}else{
		this.myCanvas.className = "treeNodePtr";
		var leftDiv = this.target.left.attachElements();
		this.target.myDiv.appendChild(leftDiv);
		var rightDiv = this.target.right.attachElements();
		this.target.myDiv.appendChild(rightDiv);
		return this.target.myDiv;
	}
};

treeNodePtr.prototype.detachElements = function(){
	if(this.target === undefined){
		return;
	}else{
		console.log(this.target.key);
		this.target.left.detachElements();
		this.target.right.detachElements();
		this.target.myDiv.parentNode.removeChild(this.target.myDiv);
		return;
	}
};

treeNodePtr.prototype.drawNode = function(){
	if(this.target !==undefined){
		var myCanvas = this.target.myCanvas;
		var myContext = myCanvas.getContext("2d");
		var nodeCanvasHeight = AVLTreeDisplay.nodeCanvasHeight;
		var nodeCanvasWidth = AVLTreeDisplay.nodeCanvasWidth;
		var nodeSize = AVLTreeDisplay.nodeSize;
		myContext.strokeStyle = "#000";
		myContext.fillStyle = "#f60";
		myContext.lineWidth = 2;
		myContext.arc(nodeCanvasWidth/2,nodeCanvasHeight/2,nodeSize/2-1,0,2*Math.PI);
		myContext.stroke();
		myContext.fill();
	}
};

treeNodePtr.prototype.drawKey = function(){
	if(this.target !==undefined){
		var myCanvas = this.target.myCanvas;
		var myContext = myCanvas.getContext("2d");
		myContext.globalCompositeOperation = "source-over";
		myContext.textAlign = "center";
		myContext.textBaseline = "middle";
		myContext.font = (AVLTreeDisplay.nodeSize / 2) + "px Arial"; 
		myContext.fillStyle = "#000";
		myContext.fillText(this.target.key,myCanvas.width/2,myCanvas.height/2);
	}else{
		this.drawNullNode();
	}
};



treeNodePtr.prototype.drawLine = function(){
	if(this.target !== undefined){
		var myCanvas = this.myCanvas;
		var myContext = myCanvas.getContext("2d");
		var nodeCanvasHeight = AVLTreeDisplay.nodeCanvasHeight;
		var nodeCanvasWidth = AVLTreeDisplay.nodeCanvasWidth;
		var mainBoardRect = document.getElementById("mainBoard").getBoundingClientRect();
		var targetRect = this.target.myCanvas.getBoundingClientRect();
		var sourceRect;
		if(this.source === undefined){
			/* Handling the root!!*/
			sourceRect = {top : (mainBoardRect.top - nodeCanvasHeight / 2 - 2),
						  left : (targetRect.left)};
		}else{
			sourceRect = this.source.myCanvas.getBoundingClientRect();
		}
		var top = sourceRect.top < targetRect.top ? sourceRect.top : targetRect.top;
		top -= mainBoardRect.top;
		top += nodeCanvasHeight / 2;
		var left = sourceRect.left < targetRect.left ? sourceRect.left : targetRect.left;
		left -= mainBoardRect.left;
		left += nodeCanvasWidth / 2;
		var width = Math.abs(sourceRect.left-targetRect.left);
		width = width !== 0 ? width : 1;
		var height = Math.abs(sourceRect.top-targetRect.top);
		height = height !== 0 ? height : 1;
		var fromTopLeft = sourceRect.left < targetRect.left;
		myCanvas.style.top = Math.round(top) + "px";
		myCanvas.style.left = Math.round(left) + "px";
		myCanvas.width = width;
		myCanvas.height = height;
		myContext.strokeStyle = "#000";
		myContext.lineWidth = 1;
		myContext.moveTo(fromTopLeft ? 0.5 : myCanvas.width-0.5,0.5);
		myContext.lineTo(fromTopLeft ? myCanvas.width-0.5 : 0.5, myCanvas.height-0.5);
		myContext.stroke();
	}else{
		
	}
};

AVLTree.prototype.displayTree = function(){
	var wholeDiv = this.root.display();
	this.treeDiv.appendChild(this.root.myCanvas);
	this.treeDiv.appendChild(wholeDiv);
	document.getElementById("mainBoard").appendChild(this.treeDiv);
	this.root.postOrderTraversal(function(input){input.drawLine();});
};

AVLTree.prototype.insert = function(input){
	this.root.detachElements();
	this.root.insert({key:input,data:undefined});
	this.displayTree();
};
