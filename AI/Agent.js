function Agent() {
	
}

Agent.prototype.initialize = function() {
	this.fsm = new StateMachine();
}

Agent.prototype.destruct = function() {
	this.fsm.destruct();
	this.fsm = null;
}

Agent.prototype.Update = function() {
	this.fsm.Update();
}

Agent.prototype.GetStateMachine = function() {
	return this.fsm;
}

Agent.prototype.completed = function() {
	//dispatchEvent :: ACTION_COMPLETED
	
}

Agent.prototype.clearStates = function() {
	this.fsm.destruct();
}