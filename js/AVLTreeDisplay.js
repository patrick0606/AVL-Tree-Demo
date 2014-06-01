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
	size: {
		nodeDiameter: 40,
		nodeWidth: 60,
		nullNodeWidth: 20,
		lineWidth: 2,
		marginX: 10,
		marginY: 70,
		containerWidth: 800
	},
	settings: {
		animationSpeed: 1,
		bounceHeight: 40,
		showBalance: false,
		showHeight: false,
		showNull: false,
		shape: 'classic',
		stepByStep: false,
		bounceOnStep: false,
		animatedRedo: false,
		mute : true
	},
	
	data: function(key){
		this.width = 0;
		this.positionX = 0;
		this.positionY = 0;
		this.myDiv = AVLTreeDisplay.divInit(key);
		this.myDiv.host = this;
		this.leftLine = this.createLine();
		this.leftLine.host = this;
		this.rightLine = this.createLine();
		this.rightLine.host = this;
		this.myNode = null;
	},
	
	createLine: function(){
		var line = new SimpleLine(0,0,0,0,this.size.lineWidth,'line');
		return line;
	},
	
	createNode: function(key,x,y){
		var div = document.createElement('div');
		x = x || this.size.containerWidth / 2 - this.size.nodeDiameter / 2;
		y = y || 0 - this.size.nodeDiameter;
		TweenMax.set(div,{
			left: x,
			top: y,
			className: 'node',
			innerHTML: key
		});
		return div;
	},
	
	calculateWidth: function(node){
		node = node || AVLTree.root;
		if(node !== null){
			var width = this.size.marginX;
			if(croot.left === null){
				width += this.size.nullNodeWidth;
			}else{
				width += this.calculateWidth(node.left);
			}
			if(croot.right === null){
				width += this.size.nullNodeWidth;
			}else{
				width += this.calculateWidth(node.right);
			}
			node.data.width = width;
			return width;
		}
	},
	
	calculatePosition: function(node){
		
	},
	
	rootLine: null,
	
	init: function(){
		this.rootLine = new SimpleLine( this.size.containerWidth / 2, 
										0 - this.size.marginY,
										this.size.containerWidth / 2, 
										this.size.marginY,
							 			this.size.lineWidth, 'line'
									  );
		$(this.rootLine.div).addClass('rootLine');
		$('#AVLTreeDemoContainer').append(this.rootLine.div);
	}
	
};

var AVLTreeAnimation = {
	globalTimeline: new TimelineMax(),
	
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
