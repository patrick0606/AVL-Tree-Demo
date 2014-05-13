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

var AVLTreeControl = {
	
};

AVLTreeControl.init = function(){
	var i;
	for(i=0;i<10;i++){
		var key = Math.floor(Math.random()*100);
		AVLTreeDisplay.insert(key);
	}
	AVLTreeDisplay.renderTree();
};

AVLTreeControl.insert = function(){
	var key = parseInt(document.getElementById("input").value);
	AVLTreeDisplay.insert(key);
	AVLTreeDisplay.renderTree();
};

AVLTreeControl.remove = function(){
	var key = document.getElementById("input").value;
	AVLTreeDisplay.remove(key);
	AVLTreeDisplay.renderTree();
};

