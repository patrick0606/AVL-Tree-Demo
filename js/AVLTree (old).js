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
 */

var AVLTreeSettings = {
	balanceEnabled : true,     /* true/false           */
	deleteMode : "min",        /* min/max              */
	orientation : "ascending", /* ascending/descending */
	error : ""
};

var treeNodePtr = function(source,target){
	/* The pointer points to both sides. */
	this.source = source;
	this.target = target;
	this.myCanvas = AVLTreeDisplay.nodePtrCanvasInit();
};

var treeNode = function(key,data){
	this.key = key;
	this.data = data;
	this.left = new treeNodePtr(this,undefined);
	this.right = new treeNodePtr(this,undefined);
	this.height = 0;
	this.myDiv = document.createElement("div");
	this.myDiv.className = "treeNodeDiv";
	this.myCanvas = AVLTreeDisplay.nodeCanvasInit();
	this.myDiv.appendChild(this.myCanvas);
	this.myDiv.appendChild(this.left.myCanvas);
	this.myDiv.appendChild(this.right.myCanvas);
};

var AVLTree = function(){
	this.root = new treeNodePtr(undefined,undefined);
	this.treeDiv = document.createElement("div");
	this.treeDiv.className = "treeDiv";
};

treeNodePtr.prototype.preOrderTraversal = function(shout){
	if(this.target !== undefined){
		shout = shout || function(){};
		shout(this);
		this.target.left.inOrderTraversal(shout);
		this.target.right.inOrderTraversal(shout);
	}
};

treeNodePtr.prototype.inOrderTraversal = function(shout){
	if(this.target !== undefined){
		shout = shout || function(){};
		this.target.left.inOrderTraversal(shout);
		shout(this);
		this.target.right.inOrderTraversal(shout);
	}
};

treeNodePtr.prototype.postOrderTraversal = function(shout){
	if(this.target !== undefined){
		shout = shout ||  function(){};
		this.target.left.inOrderTraversal(shout);
		this.target.right.inOrderTraversal(shout);
		shout(this);
	}
};

/* Note that copy() requires the handler of the new Source as an parameter.    */
/* Otherwise, the new pointer in the new tree would not be able to point back. */
/* Please tell me if there is a better way to do this..... :(                  */
treeNodePtr.prototype.copy = function(newSource,copyConstructor){
	if(this.target !== undefined){
		/* If data is an object, its copy constructor has to be passed in to   */
		/* avoid passing by reference.                                         */
		var dataCopy = copyConstructor ? (this.target.data.copyConstructor()||this.target.data) : this.target.data;
		var newNode = new treeNode(this.target.key,dataCopy);
		newNode.left = this.target.left.copy(newNode,copyConstructor);
		newNode.right = this.target.right.copy(newNode,copyConstructor);
		var newNodePtr = new treeNodePtr(newSource,newNode);
		return newNodePtr;
	}
	return undefined;
};

treeNodePtr.prototype.clear = function(){
	if(this.target !== undefined){
		this.target.left.clear();
		this.target.right.clear();
		delete this.target;
		this.target = undefined;
	}
};

/* The input of insert() should be an object containing a key and a data. */
/* i.e. newObject = { key : someKey, data : someData};                    */
treeNodePtr.prototype.insert = function(newObject){
	/* If newObject is not a proper object, then force its key to be      */
	/* the current key, and force data to be "undefined".                 */
	newObject.key = newObject.key || this.target.key || this.source.key;
	newObject.data = newObject.data || undefined;
	if(this.target === undefined){
		var newNode = new treeNode(newObject.key,newObject.data);
		this.target = newNode;
		this.updateHeight();
		return true;
	}else if(this.chooseDirection(newObject) === "left"){
		var catchReturn = this.target.left.insert(newObject);
		this.balance();
		this.updateHeight();
		return catchReturn;
	}else if(this.chooseDirection(newObject) === "right"){
		var catchReturn = this.target.right.insert(newObject);
		this.balance();
		this.updateHeight();
		return catchReturn;
	}else
	return false;
};

treeNodePtr.prototype.getHeight = function(){
	if(this.target !== undefined)
		return this.target.height;
	else
		return -1;
};

treeNodePtr.prototype.updateHeight = function(){
	var leftHeight = this.target.left.getHeight();
	var rightHeight = this.target.right.getHeight();
	this.target.height = leftHeight > rightHeight ? leftHeight + 1 : rightHeight + 1;
};

treeNodePtr.prototype.chooseDirection = function(comparingObject){
	if(AVLTreeSettings.orientation==="ascending"){
		if(this.target.key > comparingObject.key){
			return "left";
		}else if(this.target.key < comparingObject.key){
			return "right";
		}else{
			return "found";
		}
	}else if (AVLTreeSettings.orientation==="descending"){
		if(this.target.key < comparingObject.key){
			return "left";
		}else if(this.target.key > comparingObject.key){
			return "right";
		}else{
			return "found";
		}
	}else
	AVLTreeSettings.error += "\nWrong orientation value: " + AVLTreeSettings.orientation;
	return "error";
};

treeNodePtr.prototype.rotateLeft = function(){
	var tempNode = this.target;
	this.target = tempNode.right.target;
	tempNode.right.target = this.target.left.target;
	this.target.left.target = tempNode;
	this.target.left.updateHeight();
	this.updateHeight();
};

treeNodePtr.prototype.rotateRight = function(){
	var tempNode = this.target;
	this.target = tempNode.left.target;
	tempNode.left.target = this.target.right.target;
	this.target.right.target = tempNode;
	this.target.right.updateHeight();
	this.updateHeight();
};

treeNodePtr.prototype.balance = function(){
	if(AVLTreeSettings.balanceEnabled){
//		if(this.target.left.target !== undefined)this.target.left.balance();
//		if(this.target.right.target !== undefined)this.target.right.balance();
		var leftHeight = this.target.left.getHeight();
		var rightHeight = this.target.right.getHeight();
		var balance = rightHeight - leftHeight;
		if(balance >= 2){
			var rightBalance = this.target.right.target.right.getHeight()
							 - this.target.right.target.left.getHeight();
			if(rightBalance < 0){
				this.target.right.rotateRight();
			}
			this.rotateLeft();
			this.balance();
		}else if(balance <= -2){
			var leftBalance = this.target.left.target.right.getHeight()
							- this.target.left.target.left.getHeight();
			if(leftBalance > 0){
				this.target.left.rotateLeft();
			}
			this.rotateRight();
			this.balance();
		}
	}
};

treeNodePtr.prototype.find = function(searchingObject){
	if(this.target === undefined){
		return {key:undefined};
	}else{
		var nextDirection = this.chooseDirection(searchingObject);
		if(nextDirection === "left"){
			return this.target.left.find(searchingObject);
		}else if(nextDirection === "right"){
			return this.target.right.find(searchingObject);
		}else if(nextDirection === "found"){
			return this;
		}else{
			AVLTreeSettings.error += "\nWrong direction value: " + nextDirection;
			return undefined;
		}
	}
};

treeNodePtr.prototype.remove = function(removingObject){
	if(this.target === undefined){
		return undefined;
	}else{
		var nextDirection = this.chooseDirection(removingObject);
		if(nextDirection === "left"){
			var removedObject = this.target.left.remove(removingObject);
			this.updateHeight();
			this.balance();
			return removedObject;
		}else if(nextDirection === "right"){
			var removedObject = this.target.right.remove(removingObject);
			this.updateHeight();
			this.balance();
			return removedObject;
		}else if(nextDirection === "found"){
			var leftChild = this.target.left.target;
			var rightChild = this.target.right.target;
			if(leftChild === undefined && rightChild === undefined){
				var myself = new treeNodePtr(undefined,this.target);
				this.target = undefined;
				return myself;
			}else if(leftChild !== undefined && rightChild === undefined){
				var myself = new treeNodePtr(undefined,this.target);
				this.target = myself.target.left.target;
				myself.target.left.target = undefined;
				return myself;
			}else if(leftChild === undefined && rightChild !== undefined){
				var myself = new treeNodePtr(undefined,this.target);
				this.target = myself.target.right.target;
				myself.target.right.target = undefined;
				return myself;
			}else{
				if(AVLTreeSettings.deleteMode === "min"){
					var swapPosition = this.target.left.rightMost();
					this.swap(swapPosition);
					return swapPosition.remove(removingObject);
				}else if(AVLTreeSettings.deleteMode === "max"){
					var swapPosition = this.target.right.leftMost();
					this.swap(swapPosition);
					return swapPosition.remove(removingObject);
				}else{
					AVLTreeSettings.error += "\nWrong delete mode: " + AVLTreeSettings.deleteMode;
					return undefined;
				}
			}
		}else{
			AVLTreeSettings.error += "\nWrong direction value: " + nextDirection;
			return undefined;
		}
	}
};

treeNodePtr.prototype.rightMost = function(){
	if(this.target.right.target === undefined)
		return this;
	else
		return this.target.right.rightMost();
};

treeNodePtr.prototype.leftMost = function(){
	if(this.target.left.target === undefined)
		return this;
	else
		return this.target.left.leftMost();
};

treeNodePtr.prototype.swap = function(targetNodePtr){
	var tempKey = this.target.key;
	var tempData = this.target.data;
	this.target.key = targetNodePtr.target.key;
	this.target.data = targetNodePtr.target.data;
	targetNodePtr.target.key = tempKey;
	targetNodePtr.target.data = tempData;
};



AVLTree.prototype.preOrderTraversal = function(input){
  	this.root.preOrderTraversal(input);
};

AVLTree.prototype.inOrderTraversal = function(input){
  	this.root.inOrderTraversal(input);
};

AVLTree.prototype.postOrderTraversal = function(input){
  	this.root.postOrderTraversal(input);
};

AVLTree.prototype.copy = function(dataConstructor){
	var newTree = new AVLTree;
	newTree.root = this.root.copy(undefined,dataConstructor);
	return newTree;
};

AVLTree.prototype.clear = function(){
	this.root.clear();
};

AVLTree.prototype.getHeight = function(){
	this.root.updateHeight();
	this.root.getHeight();
};



AVLTree.prototype.find = function(input){
	return this.root.find(input);
};

AVLTree.prototype.balance = function(){
	this.root.postOrderTraversal(function(input){input.balance();});
};

AVLTree.prototype.remove = function(input){
	this.root.remove(input);
};


