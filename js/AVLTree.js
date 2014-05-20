/**
 * AVLTree.js
 * 
 * Copyright (c) 2014 Patrick Huang. All rights reserved.
 * 
 * Distributed under GNU General Public License v2. 
 * http://www.gnu.org/licenses/gpl.html
 * 
 * @file 
 * 
 * @author Patrick Huang <phuang17@illinois.edu>
 * 
 * 
 */

var AVLTree = (function(){
	var Settings = function(){
		this.balanceEnabled = true;
		this.deleteMode = -1;
		this.orientation = 1;
	};
	
	var TreeNode = function(key,data,parent){
		this.key = key;
		this.data = data;
		this.left = null;
		this.right = null;
		this.parent = parent !== undefined ? parent : null;
		this.height = 0;
	};
	
	function _c(){
		this.root = null;
		this.settings = new Settings();
	};
		_c.root = null;
		_c.settings = new Settings();
	
	_c.preOrderTraversal = _c.prototype.preOrderTraversal = function(shout,arguement,croot){
		if(typeof shout === "function"){
			croot = croot || this.root;
			shout(croot,arguement);
			if(croot.left !== null){
				_c.preOrderTraversal(shout,argument,croot.left);
			}
			if(croot.right !== null){
				_c.preOrderTraversal(shout,argument,croot.right);
			}
		}
	};
	
	_c.inOrderTraversal = _c.prototype.inOrderTraversal = function(shout,arguement,croot){
		if(typeof shout === "function"){
			croot = croot || this.root;
			if(croot.left !== null){
				_c.preOrderTraversal(shout,argument,croot.left);
			}
			shout(croot,arguement);
			if(croot.right !== null){
				_c.preOrderTraversal(shout,argument,croot.right);
			}
		}
	};
	
	_c.postOrderTraversal = _c.prototype.postOrderTraversal = function(shout,arguement,croot){
		if(typeof shout === "function"){
			croot = croot || this.root;
			if(croot.left !== null){
				_c.preOrderTraversal(shout,argument,croot.left);
			}
			if(croot.right !== null){
				_c.preOrderTraversal(shout,argument,croot.right);
			}
			shout(croot,arguement);
		}
	};
	
	
	
	return _c;
})();


var AVLTreeSettings = {
	balanceEnabled : true,		
	deleteMode : -1,        	
	orientation : 1 			
};

var treeNode = function(parent,key,data){
	this.key = key;
	this.data = data;
	this.left = null;
	this.right = null;
	this.parent = parent !== undefined ? parent : null;
	this.height = 0;
};

/*
var AVLTree = {
	root : null
};

AVLTree.preOrderTraversal = function(croot,shout,arguement){
	if(croot !== null){
		shout = shout || function(){};
		shout(croot,arguement);
		AVLTree.preOrderTraversal(croot.left,shout);
		AVLTree.preOrderTraversal(croot.right,shout);
	}
};*/

AVLTree.inOrderTraversal = function(croot,shout,arguement){
	if(croot !== null){
		shout = shout || function(){};
		AVLTree.inOrderTraversal(croot.left,shout);
		shout(croot,arguement);
		AVLTree.inOrderTraversal(croot.right,shout);
	}
};

AVLTree.postOrderTraversal = function(croot,shout,arguement){
	if(croot !== null){
		shout = shout || function(){};
		AVLTree.postOrderTraversal(croot.left,shout);
		AVLTree.postOrderTraversal(croot.right,shout);
		shout(croot,arguement);
	}
};

AVLTree.clear = function(croot){
	if(croot !== null){
		if(croot.left !== null){
			AVLTree.clear(croot.left);
			delete croot.left;
			croot.left = null;
		}
		if(croot.right !== null){
			AVLTree.clear(croot.right);
			delete croot.right;
			croot.right = null;
		}
		if(croot.parent === null){
			delete AVLTree.root;
			AVLTree.root = null;
		}
	}
};

AVLTree.insert = function(croot,key,data){
	if(croot !== null){
		var direction = AVLTree.chooseDirection(croot,key);
		if(direction < 0){
			if(croot.left !== null){
				AVLTree.insert(croot.left,key,data);
			}else{
				croot.left = new treeNode(croot,key,data);
			}
		}else if(direction > 0){
			if(croot.right !== null){
				AVLTree.insert(croot.right,key,data);
			}else{
				croot.right = new treeNode(croot,key,data);
			}
		}else if(direction === 0){
			return false;
		}
		AVLTree.updateHeight(croot);
		AVLTree.balance(croot);
	}else{
		AVLTree.root = new treeNode(null,key,data);
	}
	return true;
};

AVLTree.chooseDirection = function(croot,key){
	if(AVLTreeSettings.orientation > 0){
		if(croot.key > key){
			return -1;
		}else if(croot.key < key){
			return 1;
		}else if(croot.key === key){
			return 0;
		}
	}else if(AVLTreeSettings.orientation < 0){
		if(croot.key < key){
			return -1;
		}else if(croot.key > key){
			return 1;
		}else if(croot.key === key){
			return 0;
		}
	}
	return 0;
};

AVLTree.getHeight = function(croot){
	if(croot !== null){
		return croot.height;
	}else{
		return -1;
	}
};

AVLTree.updateHeight = function(croot){
	var leftHeight = AVLTree.getHeight(croot.left);
	var rightHeight = AVLTree.getHeight(croot.right);
	var myHeight = leftHeight > rightHeight ? leftHeight + 1: rightHeight + 1;
	croot.height = myHeight;
};

AVLTree.rotateLeft = function(croot){
	if(croot.right !== null){
		var parent = croot.parent;
		var root = croot;
		var right = croot.right;
		var rightLeft = croot.right.left;
		root.right = rightLeft;
		right.left = root;
		root.parent = right;
		if(rightLeft !== null){
			rightLeft.parent = root;
		}
		AVLTree.redirectParent(parent,root,right);
		AVLTree.updateHeight(root);
		AVLTree.updateHeight(right);
	}
};

AVLTree.rotateRight = function(croot){
	if(croot.left !== null){
		var parent = croot.parent;
		var root = croot;
		var left = croot.left;
		var leftRight = croot.left.right;
		root.left = leftRight;
		left.right = root;
		root.parent = left;
		if(leftRight !== null){
			leftRight.parent = root;
		}
		AVLTree.redirectParent(parent,root,left);
		AVLTree.updateHeight(root);
		AVLTree.updateHeight(left);
	}
};

AVLTree.calculateBalance = function(croot){
	var leftHeight = AVLTree.getHeight(croot.left);
	var rightHeight = AVLTree.getHeight(croot.right);
	return rightHeight - leftHeight;
};

AVLTree.balance = function(croot){
	if(AVLTreeSettings.balanceEnabled){
		var balance = AVLTree.calculateBalance(croot);
		if(balance >= 2){
			var rightBalance = AVLTree.calculateBalance(croot.right);
			if(rightBalance < 0){
				AVLTree.rotateRight(croot.right);
			}
			AVLTree.rotateLeft(croot);
		}else if(balance <= -2){
			var leftBalance = AVLTree.calculateBalance(croot.left);
			if(leftBalance > 0){
				AVLTree.rotateLeft(croot.left);
			}
			AVLTree.rotateRight(croot);
		}else{
			return;
		}
		AVLTree.balance(croot);
	}
};
//
AVLTree.swap = function(root1,root2){
	if(root1 !== null && root2 !== null && root1 !== root2){
		var parent1 = root1.parent;
		var parent2 = root2.parent;
		var left1 = root1.left;
		var left2 = root2.left;
		var right1 = root1.right;
		var right2 = root2.right;
		if(left1 === root2){
			root1.left = left2;
			root1.right = right2;
			root2.left = root1;
			root2.right = right1;
			AVLTree.redirectParent(parent1,root1,root2);
			root1.parent = root2;
			if(left2 !== null){
				left2.parent = root1;
			}
			if(right1 !== null){
				right1.parent = root2;
			}
			if(right2 !== null){
				right2.parent = root1;
			}
		}else if(left2 === root1){
			AVLTree.swap(root2,root1);
		}else if(right1 === root2){
			root1.left = left2;
			root1.right = right2;
			root2.left = left1;
			root2.right = root1;
			AVLTree.redirectParent(parent1,root1,root2);
			root1.parent = root2;
			if(left1 !== null){
				left1.parent = root2;
			}
			if(left2 !== null){
				left2.parent = root1;
			}
			if(right2 !== null){
				right2.parent = root1;
			}
		}else if(right2 === root1){
			AVLTree.swap(root2,root1);
		}else if(parent1 === parent2){
			root1.left = left2;
			root1.right = right2;
			root2.left = left1;
			root2.right = right1;
			var tempLeft = parent1.left;
			parent1.left = parent1.right;
			parent1.right = tempLeft;
			if(left1 !== null){
				left1.parent = root2;
			}
			if(left2 !== null){
				left2.parent = root1;
			}
			if(right1 !== null){
				right1.parent = root2;
			}
			if(right2 !== null){
				right2.parent = root1;
			}
		}else{
			root1.left = left2;
			root1.right = right2;
			root2.left = left1;
			root2.right = right1;
			AVLTree.redirectParent(parent1,root1,root2);
			AVLTree.redirectParent(parent2,root2,root1);
			if(left1 !== null){
				left1.parent = root2;
			}
			if(left2 !== null){
				left2.parent = root1;
			}
			if(right1 !== null){
				right1.parent = root2;
			}
			if(right2 !== null){
				right2.parent = root1;
			}
		}
	}
};

AVLTree.rightMost = function(croot){
	if(croot.right !== null){
		return AVLTree.rightMost(croot.right);
	}else{
		return croot;
	}
};

AVLTree.leftMost = function(croot){
	if(croot.left !== null){
		return AVLTree.leftMost(croot.left);
	}else{
		return croot;
	}
};

AVLTree.find = function(croot,key){
	var direction = AVLTree.chooseDirection(croot,key);
	if(direction < 0){
		if(croot.left === null){
			return null;
		}else{
			return AVLTree.find(croot.left,key);
		}
	}else if(direction > 0){
		if(croot.right === null){
			return null;
		}else{
			return AVLTree.find(croot.right,key);
		}
	}else{
		return croot;
	}
};

AVLTree.getData = function(croot,key){
	var position = AVLTree.find(croot,key);
	if(position === null){
		return null;
	}else{
		return position.data;
	}
};

AVLTree.remove = function(croot,key){
	var position = AVLTree.find(croot,key);
	if(position === null){
		return null;
	}else{
		var left = position.left;
		var right = position.right;
		if(left === null && right === null){
			AVLTree.redirectParent(position.parent,position,null);
			var data = position.data;
			position.data = undefined;
			delete position;
		}else if(left !== null && right === null){
			AVLTree.redirectParent(position.parent,position,position.left);
			var data = position.data;
			position.data = undefined;
			delete position;
		}else if(left === null && right !== null){
			AVLTree.redirectParent(position.parent,position,position.right);
			var data = position.data;
			position.data = undefined;
			delete position;
		}else{
			if(AVLTreeSettings.orientation * AVLTreeSettings.deleteMode < 0){
				var target = AVLTree.rightMost(position.left); 
			}else{
				var target = AVLTree.leftMost(position.right); 
			}
			AVLTree.swap(position,target);
//////////////////////////////////////////////////
			AVLTree.redirectParent(position.parent,position,null);
			var data = position.data;
			position.data = undefined;
			delete target;
		}
		AVLTree.postOrderTraversal(croot,AVLTree.updateHeight);
		AVLTree.postOrderTraversal(croot,AVLTree.balance);
		return data;
	}
};

AVLTree.redirectParent = function(parent,child,target){
	if(child !== null){
		if(parent !== null){
			if(parent.left === child){
				parent.left = target;
			}else{
				parent.right = target;
			}
			if(target !== null){
				target.parent = parent;
			}
		}else{
			AVLTree.root = target;
			if(target !== null){
				target.parent = parent;
			}
		}
	}
};

AVLTree.switchChild = function(croot){
	if(croot.left !== null)
		AVLTree.switchChild(croot.left);
	if(croot.right !== null)
		AVLTree.switchChild(croot.right);
	var tempLeft = croot.left;
	croot.left = croot.right;
	croot.right = tempLeft;
};

AVLTree.clear = function(croot){
	if(croot.left !== null){
		AVLTree.clear(croot.left);
	}
	if(croot.right !== null){
		AVLTree.clear(croot.right);
	}
	delete croot.data;
	delete croot;
	
};
