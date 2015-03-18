function Patrol(unit) {
	this.fsm = unit.GetStateMachine();
	this.guard = unit;
}

Patrol.prototype.Enter = function() {
	//guard ready to patrol? 
}

Patrol.prototype.Exit = function() {
	//patrol done...
}

Patrol.prototype.Update = function() {
	//follow patrol path
	//var threat:Unit = guard.Thretened();
	//if(threat) fsm.ChangeState(new Attack(guard,threat));
}