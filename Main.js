var Main = (function() {
	var instance;

	function createInstance() {
		var object = new Game();
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

//Game Class:

function Game() {
    var GRID_HEIGHT = 10;
	this.grid = new Grid(GRID_HEIGHT,15);
    this.playerUnitSelector = new UnitSelector(GRID_HEIGHT,0);
    this.enemyUnitSelector = new UnitSelector(GRID_HEIGHT,1);
    this.grid.generate();
    this.gridElement = document.getElementById('grid');
    this.playerGroup = document.getElementById('player_group');
    this.enemyGroup = document.getElementById('enemy_group');

    this.playerGroup.addEventListener('click', this.onPlayerGroupClick);

    this.grid.addBlock( new Point(1,3));
    this.grid.addBlock( new Point(1,4));
    this.grid.addBlock( new Point(1,5));
    this.grid.addBlock( new Point(2,4));
    this.grid.addBlock( new Point(3,4));
    this.grid.addBlock( new Point(4,4));
    this.grid.addBlock( new Point(5,4));
    this.grid.addBlock( new Point(6,4));
    this.grid.addBlock( new Point(7,4));
    this.grid.addBlock( new Point(8,4));
    this.grid.addBlock( new Point(9,4));

   // this.gridElement.innerHTML = this.grid.getInnerHtml();

    this.pathfinder = PathfinderSingleton.getInstance();
    this.pathfinder.setGrid(this.grid);
    this.path = [];
}

Game.prototype.onPlayerGroupClick = function(e) {
    var idToArray = (e.target.id).split("_");
    var unitIDX = idToArray[idToArray.length-1];
    Main.getInstance().initUnit(unitIDX);
}

Game.prototype.initUnit = function(idx) {
    this.playerUnitSelector.removeUnit(idx);
    this.enemyUnitSelector.removeUnits();
    this.addUnits();
    this.updateMovementLabel(this.unit.movement, this.unit.speed);
    this.updateHP();
    this.init();
}


Game.prototype.onStartBtn = function() {
    this.playerGroup.innerHTML = this.playerUnitSelector.build();
	this.gridElement.innerHTML = this.grid.getInnerHtml();
    this.enemyGroup.innerHTML = this.enemyUnitSelector.build();

	var nextTurnBtn = document.getElementById('nextTurnBtn');
	nextTurnBtn.style.display = 'inline';
	this.clickedUnit = null;

	var startBtn = document.getElementById('startBtn');
	startBtn.style.display = 'none';

    this.unit = new Unit(0,0,0,0);
    this.unit.init();

    this.enemies = [this.newEnemy(14,0),this.newEnemy(14,1),this.newEnemy(14,2),this.newEnemy(14,3),this.newEnemy(14,4),
    this.newEnemy(14,5), this.newEnemy(14,6), this.newEnemy(14,7), this.newEnemy(14,8), this.newEnemy(14,9)];

    this.playerUnitSelector.units = [this.unit];
    this.playerUnitSelector.showUnitsOnGrid();

    this.enemyUnitSelector.units = this.enemies;
    this.enemyUnitSelector.showUnitsOnGrid();
}

Game.prototype.updateHP = function() {
	var element = document.getElementById('hp');
	element.innerHTML = "<strong>HP:</strong>\t" + this.unit.currentHP + "/" + this.unit.HP;
}

Game.prototype.newEnemy = function(x,y) {
	var enemy = new Unit(x,y,0,1);
	enemy.init();
	enemy.src = './Enemy.png';

	return enemy;
}

Game.prototype.init = function() {
	var enemy;
	var i=0;
	for(i; i < this.enemies.length; i++) {
		enemy = this.enemies[i];
		enemy.GetStateMachine().ChangeState(new Scout(enemy));
   		enemy.Update();
	}
}

//"render" on screen:
Game.prototype.addUnits = function() {
    if(this.unit != null) this.grid.addUnit(this.unit);

    var i = 0;
    for(i; i < this.enemies.length; i++) {
    	if(this.enemies[i] != null) {
    		this.grid.addUnit(this.enemies[i]);
    	}
    }
}

Game.prototype.onTileClick = function(clickedTile) {
    var array = (clickedTile.id).split('-'); //row-ROWID-col-COLID
    var cords = new Point(array[3],array[1]);

    if(this.unit == null) return;

    if(this.clickedOnUnit(cords)) {
        if(this.unit.isSelected()) { //deselect
            this.pathfinder.reset();
            this.selectedUnit = null;
            this.unit.deselect();
            this.updateGridElement();
            this.addUnits();
        } else { //select
            this.selectedUnit = this.unit;
            clickedTile.style.border = '5px solid orange';
            this.unit.select();
        }
    } else {
        if(this.selectedUnit != null || this.selectedUnit != undefined) { 
            if(this.clickedOnPath(cords)) {//move to clicked position...
               // alert('clicked on path!');
               var idx = this.clickedTileHasNoUnit(cords);
               if(idx != -1) {
               		
               		if(this.grid.removeUnit(this.enemies[idx])) {
               			this.enemies[idx].destruct();
               			this.enemies[idx] = null;
               			alert('Enemy ' + (idx+1) + ' killed!');
               		}
               		
               }
                this.pathfinder.reset();
                this.grid.removeUnit(this.unit);
                var totalCost = this.pathfinder.calculateTotalMovementCost(new Point(this.unit.col,this.unit.row), cords, this.path);
                this.unit.movement -= totalCost;
                this.updateMovementLabel(this.unit.movement, this.unit.speed);
                this.unit.updateLocation(cords);
                this.addUnits();
                this.pathfinder.setStartPoint(this.unit.col,this.unit.row);
                this.updateGridElement();
                this.addUnits();



            } else /*if(this.clickedTileHasNoUnit(cords))*/ {//find path to target
                this.pathfinder.reset();
                this.pathfinder.setUnit(this.unit);
                this.pathfinder.setStartPoint(this.unit.col,this.unit.row);
                this.pathfinder.setFinishPoint(cords.x,cords.y);
                this.updateGridElement();
                this.addUnits();
                this.path = this.pathfinder.findPath(this.unit.movement);
                this.displayPath();
            }
           
        }
    }
}

Game.prototype.moveToPosition = function(unit, finalCords, path) {
	this.pathfinder.reset();

	if(this.unit != null && this.unit.col == finalCords.x && this.unit.row == finalCords.y) {
		this.unit.currentHP -= 1;
		this.updateHP();
		if(this.unit.currentHP <= 0) {
			this.grid.removeUnit(this.unit);
			this.unit.destruct();
			this.unit = null;
		}
	}

	this.grid.removeUnit(unit);
	//console.log(finalCords.x, finalCords.y);
	var totalCost = this.pathfinder.calculateTotalMovementCost(new Point(unit.col,unit.row), finalCords, path);
	unit.movement -= totalCost;
	unit.updateLocation(finalCords);
	this.addUnits();
	this.updateGridElement();
    this.addUnits();

    if(this.unit == null) {
    	alert("Killed by enemy! Game Over! You lost!!!");
    }
}

Game.prototype.updateMovementLabel = function(movementLeft, speed) {
    var element = document.getElementById('movement_left');
    var style;

    //console.log(movementLeft, speed);

    var ratio = movementLeft / speed;
    if( ratio > .75) style = 'color: green';
    else if(ratio > .50) style = 'color: yellow';
    else if(ratio > .25) style = 'color: orange';
    else style = 'color: red';

    element.innerHTML = "<strong>Movement Points: </strong><em style='" + style + "'>" + Math.round(10*movementLeft)/10 + "</em>";
}

Game.prototype.clickedTileHasNoUnit = function(cords) {
	var i = 0;
	for(i; i < this.enemies.length; i++) {
		if(this.enemies[i] != null && cords.x == this.enemies[i].col && cords.y == this.enemies[i].row) return i;
	}

    return -1;
}

Game.prototype.clickedOnUnit = function(point) {
    if(this.unit != null && point.x == this.unit.col && point.y == this.unit.row) return true;
    return false;
}

Game.prototype.updateGridElement = function() {
    this.gridElement.innerHTML = this.grid.getUpdatedHtml();
}

Game.prototype.displayGivenPath = function(path, unit) {
	var element;
    var tileID;

    var nextCord = new Point(unit.col, unit.row);
    var cord;
    var sum = 0;
    var max = unit.movement;

    for(var i = 0; i < path.length; i++) {
        cord = new Point(path[i].x, path[i].y);

        sum += this.pathfinder.calculateMovementCost(cord,nextCord);

        //alert(nextCord);

        if(sum <= max) {
            //tileID = this.grid.generateID(path[i].x,path[i].y);
            //element = document.getElementById(tileID);
            //element.style.background = 'yellow';
            nextCord = cord;
        } else {
            path.splice(i, path.length -i);
            break;
        }
        
    }

    return path;
}

Game.prototype.displayPath = function() {
    var element;
    var tileID;

    var nextCord = new Point(this.unit.col, this.unit.row);
    var cord;
    var sum = 0;
    var max = this.unit.movement;

    for(var i = 0; i < this.path.length; i++) {
        cord = new Point(this.path[i].x, this.path[i].y);

        sum += this.pathfinder.calculateMovementCost(cord,nextCord);

        //alert(nextCord);

        if(sum <= max) {
            tileID = this.grid.generateID(this.path[i].x,this.path[i].y);
            element = document.getElementById(tileID);
            element.style.background = 'yellow';
            nextCord = cord;
        } else {
            this.path.splice(i, this.path.length -i);
            break;
        }
        
    }
}

Game.prototype.clickedOnPath = function(cords) {
    for(var i=0; i<this.path.length; i++) {
        if(cords.x == this.path[i].x && cords.y == this.path[i].y) {
            return true;
        }
    }
    return false;
}

Game.prototype.onNextTurnBtn = function() {
    if(this.unit != null) {
	    this.unit.init(); //reset movement points
	    this.updateMovementLabel(this.unit.movement, this.unit.speed);
	}

	var i;
	for(i = 0; i < this.enemies.length; i++) {
		if(this.enemies[i] != null) {
	    	this.enemies[i].init(); //reset
			this.enemies[i].Update(); //action
		}
	}
    
}

Game.prototype.getEnemies = function(teamID) {
	if (teamID === 0)  return this.enemies;
	else if(teamID === 1) return [this.unit];
}