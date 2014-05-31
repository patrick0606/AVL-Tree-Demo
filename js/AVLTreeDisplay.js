/**
 * AVLTreeDisplay.js
 * 
 * Copyright (c) 2014 Patrick Huang. All rights reserved.
 * 
 * Distributed under GNU General Public License v2. 
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Part of this code requires "TweenMax", which is created and maintained by 
 * GreenSock Animation Platform (GSAP).
 * 
 * Below is a dynamic link to the minified source code of TweenMax.
 * http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.7/TweenMax.min.js
 * All codes in TweenMax.js is credited to GSAP working group.
 * For details of their license, please look at 
 * http://www.greensock.com/terms_of_use.html
 * 
 * @file
 * 
 * @author Patrick Huang <phuang17@illinois.edu>
 * 
 * 
 * 
 */
 
var AVLTreeDisplay = {
	nodeSize : {
		width : 60,
		nullWidth : 20,
		diameter : 40,
	},
	margin : {
		x : 10,
		y : 70,
	},
	animationSpeed : 1,
	bounceHeight : 1,
	showBalance : false,
	showHeight : false,
	showNull : false,
	shape : 'classic',
	stepByStep : false,
	bounceOnStep : false,
	animatedRedo : false,
	mute : true,
	mainBoardWidth: 800
};

AVLTreeDisplay.data = function(key){
	this.width = 0;
	this.positionX = AVLTreeDisplay.mainBoardWidth / 2;
	this.positionY = -100;
	this.myDiv = AVLTreeDisplay.divInit(key);
	this.myDiv.host = this;
	this.leftLine = AVLTreeDisplay.line();
	this.leftLine.host = this;
	this.rightLine = AVLTreeDisplay.line();
	this.rightLine.host = this;
	this.myNode = null;
};

AVLTreeDisplay.divInit = function(key){
	var myDiv = document.createElement("div");
	myDiv.setAttribute("class","treeNode");
	myDiv.style.lineHeight = AVLTreeDisplay.nodeSize.diameter + "px";
	TweenLite.set(myDiv,{top:-10-AVLTreeDisplay.nodeSize.diameter});
	TweenLite.set(myDiv,{left:AVLTreeDisplay.mainBoardWidth / 2 - AVLTreeDisplay.nodeSize.diameter / 2});
	myDiv.innerHTML = key;
	document.getElementById("AVLTreeDemoContainer").appendChild(myDiv);
	return myDiv;
};

AVLTreeDisplay.line = function(){
	var line = document.createElement("div");
	line.setAttribute("class","line");
	TweenLite.set(line,{transformOrigin:"left top 0",zIndex: -1,top: -100});
	document.getElementById("AVLTreeDemoContainer").appendChild(line);
	return line;
};

AVLTreeDisplay.renderLeft = function(croot){
	var line = croot.data.leftLine;
	if(croot.left !== null){
		line.style.visibility = "visible";
		var mainBoardRect = document.getElementById("AVLTreeDemoContainer").getBoundingClientRect();
		var hostRect = croot.data.myDiv.getBoundingClientRect();
		var childRect = croot.left.data.myDiv.getBoundingClientRect();
		var x = hostRect.left + AVLTreeDisplay.nodeSize.diameter / 2;
		var y = hostRect.top + AVLTreeDisplay.nodeSize.diameter / 2;
		var childX = childRect.left + AVLTreeDisplay.nodeSize.diameter / 2;
		var childY = childRect.top + AVLTreeDisplay.nodeSize.diameter / 2;
		var transformation = AVLTreeDisplay.transform(childX - x,childY - y);
		TweenLite.set(line,{left:x-mainBoardRect.left,top:y-mainBoardRect.top,width: transformation.length,rotation: transformation.angle});
	}else{
		line.style.visibility = "hidden";
	}
};

AVLTreeDisplay.renderRight = function(croot){
	var line = croot.data.rightLine;
	if(croot.right !== null){
		line.style.visibility = "visible";
		var mainBoardRect = document.getElementById("AVLTreeDemoContainer").getBoundingClientRect();
		var hostRect = croot.data.myDiv.getBoundingClientRect();
		var childRect = croot.right.data.myDiv.getBoundingClientRect();
		var x = hostRect.left + AVLTreeDisplay.nodeSize.diameter / 2;
		var y = hostRect.top + AVLTreeDisplay.nodeSize.diameter / 2;
		var childX = childRect.left + AVLTreeDisplay.nodeSize.diameter / 2;
		var childY = childRect.top + AVLTreeDisplay.nodeSize.diameter / 2;
		var transformation = AVLTreeDisplay.transform(childX - x,childY - y);
		TweenLite.set(line,{left:x-mainBoardRect.left,top:y-mainBoardRect.top,width: transformation.length,rotation: transformation.angle});
	}else{
		line.style.visibility = "hidden";
	}
};

AVLTreeDisplay.transform = function(width,height){
	var length = Math.sqrt(width*width+height*height);
	var angle = Math.atan2(height,width)*180/Math.PI;
	return {length:length,angle:angle};
};

AVLTreeDisplay.insert = function(key){
	var data = new AVLTreeDisplay.data(key);
	var node = AVLTree.insert(key,data);
	if(node !== null){
		data.myNode = node;
	}else{
		//data.destroy();
	}
};

AVLTreeDisplay.remove = function(key){
	var removingData = AVLTree.remove(AVLTree.root,key);
	if( removingData !== null){
		removingData.leftLine.parentNode.removeChild(removingData.leftLine);
		removingData.rightLine.parentNode.removeChild(removingData.rightLine);
		TweenLite.to(removingData.myDiv,1,{top:"+=400",autoAlpha:0});
		delete removingData;
	}
};

AVLTreeDisplay.calculateWidth = function(croot){
	var width = AVLTreeDisplay.margin.x;
	if(croot.left === null){
		width += AVLTreeDisplay.nodeSize.nullWidth;
	}else{
		width += AVLTreeDisplay.calculateWidth(croot.left);
	}
	if(croot.right === null){
		width += AVLTreeDisplay.nodeSize.nullWidth;
	}else{
		width += AVLTreeDisplay.calculateWidth(croot.right);
	}
	croot.data.width = width;
	return width;
};

AVLTreeDisplay.calculatePosition = function(croot){
	if(croot !== null){
		if(croot.parent === null){
			AVLTreeDisplay.calculateWidth(croot);
			AVLTree.root.data.positionX = AVLTreeDisplay.mainBoardWidth / 2 - AVLTreeDisplay.nodeSize.diameter / 2;
			AVLTree.root.data.positionY = AVLTreeDisplay.margin.y / 2;
		}
		if(croot.left !== null){
			croot.left.data.positionX = croot.data.positionX - croot.data.width / 2 + croot.left.data.width / 2;
			croot.left.data.positionY = croot.data.positionY + AVLTreeDisplay.margin.y;
			AVLTreeDisplay.calculatePosition(croot.left);
		}
		if(croot.right !== null){
			croot.right.data.positionX = croot.data.positionX + croot.data.width / 2 - croot.right.data.width / 2;
			croot.right.data.positionY = croot.data.positionY + AVLTreeDisplay.margin.y;
			AVLTreeDisplay.calculatePosition(croot.right);
		}
	}
};

AVLTreeDisplay.renderNode = function(croot){
	TweenLite.to(croot.data.myDiv,0.5,
		{
			top: croot.data.positionY, 
			left: croot.data.positionX,
			onUpdate: AVLTreeDisplay.renderLine,
			onUpdateParams: [croot]
		});
};

AVLTreeDisplay.renderLine = function(croot){
	AVLTreeDisplay.renderLeft(croot);
	AVLTreeDisplay.renderRight(croot);
};

AVLTreeDisplay.renderTree = function(){
	AVLTreeDisplay.calculatePosition(AVLTree.root);
	AVLTree.inOrderTraversal(AVLTree.root,AVLTreeDisplay.renderNode);
};
