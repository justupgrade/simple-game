//--------------------- GRID CLASS ---------------------
function Grid(height,width) { //number of rows x number of cols
	this.width = width;
	this.height = height;
	this.grid = []; //array[row][col]
	//col,row
	this.blockedTiles = [];
}

Grid.prototype.addUnit = function(unit) {
	var element = document.getElementById(this.generateID(unit.col,unit.row));
	element.innerHTML = "<img src='"+ unit.src +"'></img>";
	this.getTile(unit.col,unit.row).addUnit(unit);
}

Grid.prototype.removeUnit = function(unit) {
	var element = document.getElementById(this.generateID(unit.col,unit.row));
	element.innerHTML = '';
	this.getTile(unit.col,unit.row).removeUnit(unit);

	return true;
}


Grid.prototype.addBlock = function(point) {
	if(this.isNewBlock(point) == -1){
		this.blockedTiles.push(point);
		this.getTile(point.x,point.y).setType(1);
	} 
	else alert('Already added!');
}

Grid.prototype.removeBlock = function(point) {
	var blockID = this.isNewBlock(point);
	if(blockID == -1) {
		alert('Invaid target!');
	} else {
		this.blockedTiles.splice(blockID,1);
		this.getTile(point.x,point.y).setType(0);
	}
}

Grid.prototype.isNewBlock = function(point) {
	for(var i = 0; i < this.blockedTiles.length; i++) {
		if(this.blockedTiles[i].x == point.x && 
			this.blockedTiles[i].y == point.y) {
			return i;
		}
	}

	return -1;
}

Grid.prototype.reset = function() {
	var tile;
	var tileID;
	var element;
	for(var row=0; row<this.height; row++) {
		for(var col=0; col<this.width; col++) {
			tile = this.getTile(col,row);
			tile.reset();
			//tileID = this.generateID(col,row);
			//element = document.getElementById(tileID);
			//element.style = this.getDefaultStyle();
			//this.updateElement(element, "");
		}
	}
}

Grid.prototype.generate = function() {
	var tile;
	for(var row=0; row < this.height; row++) {
		var rows = [];
		for(var col=0; col < this.width; col++) {
			tile = new Tile(col,row);
			for(var i=0; i < this.blockedTiles.length; i++) {
				if(col == this.blockedTiles[i].x && row == this.blockedTiles[i].y){
					tile.setType(1);
				}
			}
			rows.push(tile);
		}
		this.grid.push(rows);
	}
}

Grid.prototype.getTile = function(col,row) {
	if(col >= 0 && col < this.width && row >= 0 && row < this.height)
		return this.grid[row][col];

	return null;
}

Grid.prototype.updateTile = function(tile, col,row) {
	if(col>=0 && col<this.width && row>=0 && row < this.height) {
		this.grid[row][col] = tile;
	}
}

Grid.prototype.getUpdatedHtml = function() {
	var style;
	var out = "<table>";

	for(var i=0; i < this.height; i++) {
		out += "<tr>";
		for(var j=0; j < this.width; j++) {

			if(this.getTile(j,i).hasUnit && this.getTile(j,i).unit.isSelected()) {
				style = this.getSelectedStyle();
			} else {
				style = this.getDefaultStyle();
			}

			for(var k=0; k < this.blockedTiles.length; k++) {
				if(i == this.blockedTiles[k].y && j == this.blockedTiles[k].x) {
					style = this.getBlockedStyle();
					break;
				}
			}

			out += "<td"
			out += " onclick='onTileClick(this)'";
			out += " id='" + this.generateID(j,i) + "'";
			out += " style='" + style + "''>";
			out += "</td>";

			
		}
		out += "</tr>";
	}
	
	out += "</table>";

	return out;
}

Grid.prototype.getInnerHtml = function() {
	var style;
	var out = "<table>";

	for(var i=0; i < this.height; i++) {
		out += "<tr>";
		for(var j=0; j < this.width; j++) {
			style = this.getDefaultStyle();

			for(var k=0; k < this.blockedTiles.length; k++) {
				if(i == this.blockedTiles[k].y && j == this.blockedTiles[k].x) {
					style = this.getBlockedStyle();
					break;
				}
			}

			out += "<td"
			out += " onclick='onTileClick(this)'";
			out += " id='" + this.generateID(j,i) + "'";
			out += " style='" + style + "''>";
			out += "</td>";

			
		}
		out += "</tr>";
	}
	
	out += "</table>";

	return out;
}

Grid.prototype.getBlockedStyle = function() {
	return "background: black";
}

Grid.prototype.generateID = function(col,row) {
	return "row-"+row+"-col-"+col;
}

Grid.prototype.getDefaultStyle = function() {
	return "text-align: center; border: solid 1px black; width:50px; height:50px; background: gray";
}

Grid.prototype.getSelectedStyle = function() {
	return "text-align: center; border: solid 5px orange; width:50px; height:50px; background: gray";
}

Grid.prototype.updateElement = function(element,content) {
	element.innerHTML = content;
}