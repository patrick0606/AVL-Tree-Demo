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
 
window.AVLTreeDisplay = {
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
	
	tree: AVLTree,
	
	data: function(key){
		this.width = 0;
		this.positionX = 0;
		this.positionY = 0;
		this.div = AVLTreeDisplay.createNode(key);
		this.div.host = this;
		this.leftLine = AVLTreeDisplay.createLine();
		this.leftLine.host = this;
		this.rightLine = AVLTreeDisplay.createLine();
		this.rightLine.host = this;
		this.node = null;
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
		});
		div.innerHTML = key;
		return div;
	},
	
	calculateWidth: function(node){
		node = node || this.tree.root;
		if(node !== null){
			var width = this.size.marginX;
			if(node.left === null){
				width += this.size.nullNodeWidth;
			}else{
				width += this.calculateWidth(node.left);
			}
			if(node.right === null){
				width += this.size.nullNodeWidth;
			}else{
				width += this.calculateWidth(node.right);
			}
			node.data.width = width;
			return width;
		}
	},
	
	calculatePosition: function(node){
		if(this.tree.root !== null){
			if(!node){
				this.calculateWidth();
				this.tree.root.data.positionX = this.size.containerWidth / 2 
											  - this.size.nodeDiameter / 2;
				this.tree.root.data.positionY = this.size.marginY;
			}
			node = node || this.tree.root;
			if(node.left !== null){
				node.left.data.positionX = node.data.positionX 
										 - node.data.width / 2 
										 + node.left.data.width / 2;
				node.left.data.positionY = node.data.positionY 
										 + this.size.marginY;
				this.calculatePosition(node.left);
			}
			if(node.right !== null){
				node.right.data.positionX = node.data.positionX 
										  + node.data.width / 2 
										  - node.right.data.width / 2;
				node.right.data.positionY = node.data.positionY
										  + this.size.marginY;
				this.calculatePosition(node.right);
			}
		}
	},
	
	rootLine: null,
	
	renderLine: function(node){
		console.log('update');
		if(this.tree.root === null){
			this.rootLine.setTo(this.size.containerWidth / 2, 
								this.size.marginY
							   );
		}else{
			var container = document.getElementById('AVLTreeDemoContainer');
			var containerRect = container.getBoundingClientRect();
			var scrollLeft = container.scrollLeft;
			var scrollTop = container.scrollTop;
			var offsetLeft = this.size.nodeDiameter / 2 - containerRect.left + scrollLeft;
			var offsetTop = this.size.nodeDiameter / 2 - containerRect.top + scrollTop;
			if(!node){
				var rootRect = this.tree.root.data.div.getBoundingClientRect();
				var rootLeft = rootRect.left + offsetLeft;
				var rootTop = rootRect.top + offsetTop;
				this.rootLine.setTo(rootLeft,rootTop);
			}
			node = node || this.tree.root;
			var nodeRect = node.data.div.getBoundingClientRect();
			var nodeLeft = nodeRect.left + offsetLeft;
			var nodeTop = nodeRect.top + offsetTop;

			if(node.left !== null){
				var leftRect = node.left.data.div.getBoundingClientRect();
				var leftLeft = leftRect.left + offsetLeft;
				var leftTop = leftRect.top + offsetTop;
				node.data.leftLine.show();
				node.data.leftLine.setTo(nodeLeft,nodeTop,leftLeft,leftTop);
				this.renderLine(node.left);
			}else{
				node.data.leftLine.hide();
			}
			if(node.right !== null){
				var rightRect = node.right.data.div.getBoundingClientRect();
				var rightLeft = rightRect.left + offsetLeft;
				var rightTop = rightRect.top + offsetTop;
				node.data.rightLine.show();
				node.data.rightLine.setTo(nodeLeft,nodeTop,rightLeft,rightTop);
				this.renderLine(node.right);
			}else{
				node.data.rightLine.hide();
			}
		}
	},
	
	init: function(){
		this.rootLine = this.createLine();
		this.rootLine.setTo(this.size.containerWidth / 2, 
							this.size.marginY,
							this.size.containerWidth / 2 + 1, 
							0 - this.size.marginY
						   );
		$(this.rootLine.div).addClass('rootLine');
		$('#AVLTreeDemoContainer').append(this.rootLine.div);
	}
	
};

var AVLTreeAnimation = {
	globalTimeline: new TimelineMax({
		onUpdate: AVLTreeDisplay.renderLine,
		onUpdateScope: AVLTreeDisplay

		}),
	init: function(){
		
	}
};


/*
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
};*/



AVLTreeDisplay.insert = function(key){
	var data = new AVLTreeDisplay.data(key);
	var node = AVLTree.insert(key,data);
	if(node !== null){
		data.myNode = node;
		$('#AVLTreeDemoContainer').append([data.div,data.leftLine.div,data.rightLine.div]);
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

/*
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
*/

AVLTreeDisplay.renderNode = function(croot){
	AVLTreeAnimation.globalTimeline.to(croot.data.div,0.5,
		{
			left: croot.data.positionX,
			top: croot.data.positionY,
			ease: Back.easeOut
		},0);
};

/*
AVLTreeDisplay.renderLine = function(croot){
	AVLTreeDisplay.renderLeft(croot);
	AVLTreeDisplay.renderRight(croot);
};

*/
AVLTreeDisplay.renderTree = function(){
	this.calculatePosition();
	this.tree.inOrderTraversal(this.renderNode);
};
