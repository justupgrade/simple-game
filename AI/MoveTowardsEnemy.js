function MoveTowardsEnemy(attacker,defender) {
	this.self = attacker;
	this.enemy = defender;
	this.fsm = this.self.GetStateMachine();
}

MoveTowardsEnemy.prototype.Enter = function() {
	//...
}

MoveTowardsEnemy.prototype.Exit = function() {
	//...
}

MoveTowardsEnemy.prototype.Update = function() {
	//enemy killed by someone else..
	if(this.enemy == null) {
		this.fsm.ChangeState(new Scout(this.self));
		this.fsm.Update();
	} else if(this.self.enemyIsInRange(this.enemy)) {
		this.fsm.GoToPrevState(); //Attack
		this.fsm.Update();
	} else {
		//new pathfinder...
		//alert('MoveTowardsEnemy!');
		var pathfinder = PathfinderSingleton.getInstance();
		pathfinder.setUnit(this.self);
		pathfinder.reset();
		pathfinder.setStartPoint(this.self.col,this.self.row);
		pathfinder.setFinishPoint(this.enemy.col,this.enemy.row);
		//uupdate grid element
		//main.addUnits -> render images on grid
		Main.getInstance().updateGridElement();
		Main.getInstance().addUnits();
		var path = pathfinder.findPath(this.self.movement);
		//console.log(path);
        path = Main.getInstance().displayGivenPath(path, this.self);
        Main.getInstance().moveToPosition(this.self, path[path.length-1], path);
	}
}