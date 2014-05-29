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
	/* private classes */
	var Settings = function(){
		this.balanceEnable = true;
		this.deleteMode = -1;
		this.orientation = 1;
	};
	var TreeNode = function(key,data){
		this.key = key;
		this.data = data;
		this.left = null;
		this.right = null;
		this.height = 0;
	};
	
	/* helper functions - node level */
	/* require .call(this) */
	
	
	/* not require .call(this) */
	var getHeight = function(node){
		if(node instanceof TreeNode){
			return node.height;
		}else if(node === null){
			return -1;
		}
	};
	
	var getBalance = function(node){
		if(node instanceof TreeNode){
			return getHeight(node.right) - getHeight(node.left);
		}
	};
	
	var updateNodeHeight = function(node){
		if(node instanceof TreeNode){
			var leftHeight = getHeight(node.left);
			var rightHeight = getHeight(node.right);
			var myHeight = leftHeight > rightHeight ? leftHeight + 1: rightHeight + 1;
			node.height = myHeight;
		}
	};
	
	
	
	/* public variables */
	function _c(){
		this.root = null;
		this.settings = new Settings();
	};
		_c.root = null;
		_c.settings = new Settings();
		
	/* public functions */
	var _p = _c.prototype;
	
	_c.preOrderTraversal = _p.preOrderTraversal = function(shout,arguement,croot){
		croot = croot || this.root;
		if(typeof shout === "function" && croot instanceof TreeNode){
			shout(croot,arguement);
			if(croot.left instanceof TreeNode){
				_c.preOrderTraversal(shout,argument,croot.left);
			}
			if(croot.right instanceof TreeNode){
				_c.preOrderTraversal(shout,argument,croot.right);
			}
		}
	};
	
	_c.inOrderTraversal = _p.inOrderTraversal = function(shout,arguement,croot){
		croot = croot || this.root;
		if(typeof shout === "function" && croot instanceof TreeNode){
			if(croot.left instanceof TreeNode){
				_c.preOrderTraversal(shout,argument,croot.left);
			}
			shout(croot,arguement);
			if(croot.right instanceof TreeNode){
				_c.preOrderTraversal(shout,argument,croot.right);
			}
		}
	};
	
	_c.postOrderTraversal = _p.postOrderTraversal = function(shout,arguement,croot){
		croot = croot || this.root;
		if(typeof shout === "function" && croot instanceof TreeNode){
			if(croot.left instanceof TreeNode){
				_c.preOrderTraversal(shout,argument,croot.left);
			}
			if(croot.right instanceof TreeNode){
				_c.preOrderTraversal(shout,argument,croot.right);
			}
			shout(croot,arguement);
		}
	};
	
	_c.directionToGo = _p.directionToGo = function(node,key){
		if(this.settings instanceof Settings){
			if(this.settings.orientation > 0){
				if(key > nodeKey){
					return 1;
				}else if(key < nodeKey){
					return -1;
				}else if(key === nodeKey){
					return 0;
				}
			}else if(this.settings.orientation< 0){
				if(key < nodeKey){
					return 1;
				}else if(key > nodeKey){
					return -1;
				}else if(key === nodeKey){
					return 0;
				}
			}
		}
	};
	
	_c.insert = _p.insert = function(key,data,croot){
		if(typeof key === "number" && typeof data === "object"){
			croot = croot || this.root;
			if(croot instanceof TreeNode){
				var direction = this.directionToGo(croot,key);
				if(direction > 0){
					if(croot.right instanceof TreeNode){
						return this.insert(key,data,croot.right);
					}else if(croot.right === null){
						croot.right = new TreeNode(key,data);
						return croot.right;
					}
				}else if(direction < 0){
					if(croot.left instanceof TreeNode){
						return this.insert(key,data,croot.left);
					}else if(croot.left === null){
						croot.left = new TreeNode(key,data,croot);
						return croot.left;
					}
				}else if(direction === 0){
					return null;
				}
			}else if(croot === null){
				this.root = new TreeNode(key,data);
				return this.root;
			}
		}
	};
	
	_c.detailsOf = _p.detailsOf = function(input,croot){
		croot = croot || this.root;
		var ReturnPack = function(exist,parent,node,side){
			this.exist = exist;
			this.parent = parent;
			this.node = node;
			this.side = side;
		};
		var returnNotFound = function(){
			return new ReturnPack(false,null,null,NaN);
		};
		
		if(croot instanceof TreeNode){
			if(input instanceof TreeNode || typeof input === "number"){
				var key = typeof input === "number" ? input : input.key;
				var direction = this.directionToGo(croot,key);
				if(direction > 0){
					var right = croot.right;
					if(right instanceof TreeNode){
						if(right.key === key){
							return new ReturnPack(true,croot,right,1);
						}else{
							return this.detailsOf(key,right);
						}
					}else if(right === null){
						return returnNotFound();
					}
				}else if(direction < 0){
					var left = croot.left;
					if(left instanceof TreeNode){
						if(left.key === key){
							return new ReturnPack(true,croot,left,-1);
						}else{
							return this.detailsOf(key,left);
						}
					}else if(left === null){
						return returnNotFound();
					}
				}else if(direction === 0){
					return new ReturnPack(true,null,croot,0);
				};
			}else if(typeof input === "object"){
				var data = input;
				this._searchTemp = NaN;
				var searchingFunction = function(node,data){
					if(node instanceof TreeNode){
						if(node.data === data){
							this._searchTemp = node.key;
						}
					}
				};
				this.preOrderTraversal(searchingFunction,data);
				var key = this._searchTemp;
				this._searchTemp = undefined;
				if(key !== NaN){
					return this.detailsOf(key);
				}else{
					return returnNotFound();
				}
				
			}
		}else if(croot === null){
			return returnNotFound();
		}
		
	};
	
	_c.exist = _p.exist = function(input){
		var detail = this.detailsOf(input);
		var exist = detail.exist;
		delete detail;
		return exist;
	};
	
	_c.find = _p.find = function(input){
		var detail = this.detailsOf(input);
		var node = detail.node;
		delete detail;
		return node;
	};
	
	_c.getData = _p.getData = function(key){
		if(typeof key === "number"){
			var node = this.find(key);
			if(node instanceof TreeNode){
				return node.data;
			}else if(node === null){
				return null;
			}
		}
	};
	
	_c.parentOf = _p.parentOf = function(input){
		var detail = this.detailsOf(input);
		var parent = detail.parent;
		delete detail;
		return parent;
	};
	
	_c.directionFromParent = _p.sideFromParent = function(input){
		var side = this.detailsOf(input);
		var side = detail.side;
		delete detail;
		return side;
	};
	
	_c.rotateLeft = _p.rotateLeft = function(croot){
		if(croot instanceof TreeNode && croot.right instanceof TreeNode){
			var parent = this.parentOf(croot);
			var side = this.sideFromParent(croot);
			var root = croot;
			var right = croot.right;
			var rightLeft = croot.right.left;
			root.right = rightLeft;
			right.left = root;
			if(direction > 0){
				parent.right = right;
			}else if(direction < 0){
				parent.left = right;
			}else if(direction === 0){
				this.root = right;
			}
			this.updateTreeHeight();
		}
	};

	_c.rotateRight = _p.rotateRight = function(croot){
		if(croot instanceof TreeNode && croot.left instanceof TreeNode){
			var parent = this.parentOf(croot);
			var side = this.sideFromParent(croot);
			var root = croot;
			var left = croot.left;
			var leftRight = croot.left.right;
			root.left = leftRight;
			left.right = root;
			if(direction > 0){
				parent.right = left;
			}else if(direction < 0){
				parent.left = left;
			}else if(direction === 0){
				this.root = left;
			}
			this.updateTreeHeight();
		}
	};
	
	_c.balanceNode = _p.balanceNode = function(node){
		if(this.settings instanceof Settings){
			if(this.settings.balanceEnable){
				var balance = getBalance(node);
				if(balance >= 2){
					var rightBalance = getBalance(node.right);
					if(rightBalance < 0){
						this.rotateRight(node.right);
					}
					this.rotateLeft(node);
					this.balanceNode(node);
				}else if(balance <=2){
					var leftBalance = getBalance(node.left);
					if(leftBalance > 0){
						this.rotateLeft(node.left);
					}
					this.rotateRight(node);
					this.balanceNode(node);
				}
			}
		}
	};
	
	_c.leftMost = _p.leftMost = function(croot){
		croot = croot || this.root;
		if(croot instanceof TreeNode){
			if(croot.left instanceof TreeNode){
				return this.leftMost(croot.left);
			}else if(croot.left === null){
				return this;
			}
		}else if(croot === null){
			return null;
		}
	};
	
	_c.rightMost = _p.rightMost = function(croot){
		croot = croot || this.root;
		if(croot instanceof TreeNode){
			if(croot.right instanceof TreeNode){
				return this.rightMost(croot.right);
			}else if(croot.right === null){
				return this;
			}
		}else if(croot === null){
			return null;
		}
	};
	
	_c.updateTreeHeight = _p.updateTreeHeight = function(){
		this.postOrderTraversal(updateNodeHeight);
	};
	
	_c.balanceTree = _p.balanceTree = function(){
		this.postOrderTraversal(this.balanceNode);
	};
	
	
	return _c;
})();


/*var AVLTreeSettings = {
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
};

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
	
};*/
