function Scout(unit) {
	this.self = unit;
	this.fsm = this.self.GetStateMachine();
	this.enemies = [];
}

Scout.prototype.Enter = function() {
	//alert(Main.getInstance().getEnemies(self.teamID));
	this.enemies = Main.getInstance().getEnemies(this.self.teamID);
}

Scout.prototype.Exit = function() {
	//exit code...
}

Scout.prototype.Update = function() {
	//scouting...
	if(this.enemies.length > 0) {
		this.fsm.ChangeState(new Attack(this.self, this.chooseEnemy()));
	} else {
		this.fsm.ChangeState(new Idle(this.self));
	}

	this.fsm.Update();
}

Scout.prototype.chooseEnemy = function() {
	return this.enemies[0]; //first enemy...
}