function MoveTowardsEnemy(attacker,defender) {
	this.self = attacker;
	this.enemy = defender;
	this.fsm = this.self.GetStateMachine();
	this.STEP;
}

MoveTowardsEnemy.prototype.Enter = function() {
	//...
}

MoveTowardsEnemy.prototype.Exit = function() {
	//...
}

MoveTowardsEnemy.prototype.Update = function() {
	this.STEP = 0;
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
        //Main.getInstance().moveToPosition(this.self, path[path.length-1], path);

        this.moveToNextCord(this.self,path, this);
	}

	//animate from point to point; check if in range ? attack : continue
}

MoveTowardsEnemy.prototype.lookForTarget = function(path) {
	if(this.self.enemyIsInRange(this.enemy)) {
		this.fsm.GoToPrevState(); //Attack
		this.fsm.Update();
	} else {
		if(++this.STEP <= path.length-1) this.moveToNextCord(this.self,path,this);
		else Main.getInstance().onEnemyAnimationCompleted(this.self, path[this.STEP-1], path);
	}
}

MoveTowardsEnemy.prototype.moveToNextCord = function(unit,path,object) {
	var nextCord = path[this.STEP];

    var id = '#player_unit_id_' + unit.teamID + "_" + unit.idx;
    var $unit = $(id);
    var oldPos = $unit.position();
    var newPos = $('#'+Main.getInstance().grid.generateID(nextCord.x, nextCord.y)).position();
    var dx = newPos.left - oldPos.left;
    var dy = newPos.top - oldPos.top;

    $unit.animate( {
        top: '+='+dy,
        left: '+='+dx
    }, 100, function() {
        object.lookForTarget(path);
    });
}