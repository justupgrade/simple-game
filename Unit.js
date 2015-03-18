Unit.prototype = new Agent();
Unit.prototype.constructor = Unit;

function Unit(col,row,type, teamID) {
	this.initialize();

	this.col = col;
	this.row = row;
	this.type = type;
	this.speed = 5; 
	this.movement = 0;
	this.selected = false;
	this.src = "./Unit.png";
	this.teamID = teamID;

	this.range = 1;
	this.destructed = false;

	this.HP = 1;
	this.currentHP = 1;
}

Unit.prototype.enemyIsInRange = function(enemy) {
	var distance = parseInt(Math.sqrt( Math.pow(enemy.col - this.col,2) + Math.pow(enemy.row - this.row,2)));

	//if(distance <= this.range) return true;

	return false;
}

Unit.prototype.updateLocation = function(point) {
	this.col = point.x;
	this.row = point.y;
}

Unit.prototype.init = function() {
	this.movement = this.speed;
}

Unit.prototype.select = function() {
	this.selected = true;
}

Unit.prototype.deselect = function() {
	this.selected = false;
}

Unit.prototype.isSelected = function() {
	return this.selected;
}