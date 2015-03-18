var PathfinderSingleton = (function() {
	var instance;

	function createInstance() {
		var object = new Pathfinder();
		return object;
	}
	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}
			return instance;
		}
	}
})();




function Pathfinder() {
	//alert('Pathfinder');
    this.openList = [];
    this.closedList = [];
    this.debugEnabled = false;
}

Pathfinder.prototype.setUnit = function(unit) {
	this.unit = unit;
}

Pathfinder.prototype.resetList = function() {
	this.clearArray(this.closedList);
	this.clearArray(this.openList);
}

Pathfinder.prototype.reset = function() {
	//clear open list, clear closed list, clear startTile, cleear Finish tile
	this.grid.reset();
	this.resetList();
}

Pathfinder.prototype.clearArray = function(array) {
	for(var i=array.length-1; i>=0; i--) {
		array.splice(i,1);
	}
}

Pathfinder.prototype.findPath = function (movement) {
	//zero iteration:
	return this.loop(movement);
}

Pathfinder.prototype.loop = function(movement) {
	var max = 100;
	var count = 0;
	var lastParent = this.start;

	while(lastParent !== this.finish) {
		this.addAdjacentTilesToOpenList(lastParent);
		this.moveToClosedList(lastParent);
		this.calculateCost(lastParent);
		lastParent = this.findTileWithTheLowestCost();
		if(this.debugEnabled) this.displayTotalCost();//debug

		if(++count > max) break;
	}

	return this.finializeSearch(lastParent);
}

Pathfinder.prototype.finializeSearch = function(lastParent) {
	this.closedList.push(lastParent);
	//closedList ready to return path or null
	var path = this.generatePath();
	path.reverse();

	return path;
}

Pathfinder.prototype.calculateMovementCost = function(pointA, pointB) {
	return Math.sqrt(Math.abs(pointA.x-pointB.x) + Math.abs(pointA.y-pointB.y));
}

Pathfinder.prototype.calculateTotalMovementCost = function(pointA, pointB, path) {
	var sum = 0; 

	var cord = pointA;
	var nextCord;

	for(var i=0; i < path.length; i++) {
		nextCord = path[i];

		if(nextCord.x == pointB.x && nextCord.y == pointB.y) { //stop
			sum += this.calculateMovementCost(cord,nextCord);
			break;
		} else {
			sum += this.calculateMovementCost(cord,nextCord);
			cord = nextCord;
		}
	}

	return sum;
}

Pathfinder.prototype.generatePath = function() {
	var path = [];
	var tile = this.closedList[this.closedList.length-1];
	path.push(new Point(tile.getCol(), tile.getRow()));

	for(var i = this.closedList.length-2; i > 0; i--) {
		if(this.closedList[i] === tile.getParentTile() ) {
			tile = this.closedList[i];
			path.push(new Point(tile.getCol(), tile.getRow()));
		}
	}

	return path;
}

Pathfinder.prototype.findTileWithTheLowestCost = function() {
	var lowestCost = this.openList[0].getTotalCost();
	var tileWithLowestCost = this.openList[0];
	var tile;
	var cost;

	for(var i=1; i<this.openList.length; i++) {
		tile = this.openList[i];
		cost = tile.getTotalCost();
		if(cost <= lowestCost) {
			tileWithLowestCost = tile;
			lowestCost = cost;
		}
	}

	return tileWithLowestCost;
}

//calculate G: movement cost to starting point
//calculate H: movement cost to finish point
//calculate F: total cost = G + H
Pathfinder.prototype.calculateCost = function(potentialParent) {
	var tile;
	for(var i=0; i < this.openList.length; i++) {
		tile = this.openList[i];
		//if tile has already calculated G cost:
		if(tile.getTotalCost() == 0) { 
			//for new tiles:
			tile.setGCost();
			tile.setHCost(this.finish);
		}
		
		
	}
}

Pathfinder.prototype.moveToClosedList = function(tile) {
	var index = this.openList.indexOf(tile);
	tile.inOpenList = false;
	this.openList.splice(index,1);
	tile.setClosedList(true);
	this.closedList.push(tile);

	if(this.debugEnabled) this.highlightClosedList(tile); //debug
}



Pathfinder.prototype.addAdjacentTilesToOpenList = function(parentTile) {
	var adjacent = this.getAdjacentTiles(parentTile);
	var tile;

	for(var i=0; i < adjacent.length; i++) {
		tile = adjacent[i];

		if(tile.isOpen(this.unit.teamID) && !tile.isInClosedList()) {
			if(tile.isInOpenList()) { 
				//check to see if the G score for that tile is lower
				//if we use the current square to get there
				//find out if current parent makes better path (lower G cost)
				var currentGCost = tile.getGCost();
				var potentialGCost = tile.calculateGCost(parentTile);
				if(currentGCost > potentialGCost) {
					//alert('Parent changed!');
					tile.setParentTile(parentTile);
					tile.setGCost();
				}
			} else {
				//tile is open, is not in any list :: has no parent
				this.openList.push(tile);
				tile.inOpenList = true;
				tile.setParentTile(parentTile);
				if(this.debugEnabled)  this.highlightOpenList(tile);//debug
			}

		}
	}
}

Pathfinder.prototype.highlightOpenList = function(tile) {
	var element = document.getElementById(
		this.grid.generateID(tile.getCol(), tile.getRow()));

	element.style.border = "solid green 3px";
}

Pathfinder.prototype.getAdjacentTiles = function(centerTile) {
	var col = centerTile.getCol();
	var row = centerTile.getRow();
	var adjacent = [];
	var tile;

	//alert('row,col: ' + row + ',' + col);

	for(var i=row-1; i<=row+1; i++) {
		for(var j=col-1; j<=col+1; j++) {
			if(i == row && j == col) {
				//skip 
			} else {
				tile = this.grid.getTile(j,i);
				if(tile != null) {
					if(tile.inClosedList == true){
						//alert('in closed: col,row: ' + tile.getCol() + "," + tile.getRow());
						continue;
					} else if(i == row-1 && j==col+1) {
						if(!this.grid.getTile(j,i+1).isOpen()){
							continue;
						} else if(!this.grid.getTile(j-1,i).isOpen()) {
							continue;
						}
					} else if(i == row+1 && j==col+1) {
						if(!this.grid.getTile(j,i-1).isOpen()) {
							continue;
						} else if(!this.grid.getTile(j-1,i).isOpen()) {
							continue;
						}
					} 
					adjacent.push(tile);
				}
				
			}
			
		}
	}

	return adjacent;
}



//----------------------- set / get ---------------------
Pathfinder.prototype.setGrid = function(grid) {
	this.grid = grid;
}

Pathfinder.prototype.setStartPoint = function(x,y) {
    this.start = this.grid.getTile(x,y);
    this.openList.push(this.start);
    this.start.addToOpenList();

    //update grid:
    //var startTileId = this.grid.generateID(x,y);
    //var element = document.getElementById(startTileId);
    //element.style = "text-align: center; background: green; font-weight:bold;";

    //this.grid.updateElement(element, 'S');
}

Pathfinder.prototype.setFinishPoint = function(x,y) {
	this.finish = this.grid.getTile(x,y);

	//update html:
	var finishTileId = this.grid.generateID(x,y);
	var element = document.getElementById(finishTileId);
	element.style = "background: red; font-weight:bold; text-align: center";

	//this.grid.updateElement(element, 'END');
}

//debug:
Pathfinder.prototype.debug = function() {
	//alert("openList length: " + this.openList.length);
	//alert("closedList length: " + this.closedList.length);

	for(var i=0; i<this.closedList.length; i++) {
		var tile = this.closedList[i];
		//alert("in closed list: col,row: " + tile.getCol() + ',' + tile.getRow() + tile.isInClosedList());
	}
}

Pathfinder.prototype.highlightClosedList = function(tile) {
	var element = document.getElementById(
		this.grid.generateID(tile.getCol(), tile.getRow()));

	element.style.border = "solid blue 5px";
}

Pathfinder.prototype.displayTotalCost = function() {
	var tileID;
	var tile;
	var element;
	var cost_string = '';
	for(var i=0; i<this.openList.length;i++){
		tile = this.openList[i];
		tileID = this.grid.generateID(tile.getCol(), tile.getRow());
		element = document.getElementById(tileID);
		cost_string = "<strong>"+tile.getTotalCost() +"</strong>" + "<br>";
		cost_string += "<small>" + tile.getGCost() + "+" + tile.getHCost()  + "</small>";
		this.grid.updateElement(element,cost_string);
	}
}


