function StateMachine() {
	this.currentState = null;
	this.prevState = null;
	this.nextState = null;
}

StateMachine.prototype.destruct = function() {
	this.currentState = null;
	this.prevState = null;
	this.nextState = null;
}

StateMachine.prototype.SetNextState = function(state) {
	this.nextState = state;
}

StateMachine.prototype.Update = function() {
	if(this.currentState) this.currentState.Update();
}

StateMachine.prototype.ChangeState = function(state) {
	if(this.currentState != null) {
		this.currentState.Exit();
		this.prevState = this.currentState;
	}

	this.currentState = state;
	this.currentState.Enter();
}

StateMachine.prototype.GoToPrevState = function() {
	this.ChangeState(this.prevState);
}

StateMachine.prototype.GoToNextState = function() {
	this.ChangeState(this.nextState);
}