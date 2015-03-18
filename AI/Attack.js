function Attack(attacker,defender) {
	this.self = attacker;
	this.enemy = defender;
	this.fsm = this.self.GetStateMachine();
}

Attack.prototype.Enter = function() {
	//enter code...
}

Attack.prototype.Exit = function() {
	//exit code...
}

Attack.prototype.Update = function() {
	if(this.enemy == null) { //already killed?
		this.fsm.ChangeState(new Scout(this.self));
		this.fsm.Update();
	} else { //enemy is still alive!
		if(this.self.enemyIsInRange(this.enemy)) { //attack!
			alert('Attack!');
		} else { //move towards enemy!
			this.fsm.ChangeState(new MoveTowardsEnemy(this.self,this.enemy));
			this.fsm.Update();
		}
	}
}