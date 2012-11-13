goog.provide('soft_eng.WorldListener');

soft_eng.WorldListener = function(game) {
	var b2Listener = Box2D.Dynamics.b2ContactListener;
	var self = this;
    this.game = game;
	//Add listeners for contact
	var listener = new b2Listener;

	listener.BeginContact = function(contact) {
		//console.log(contact.GetFixtureA().GetBody().GetUserData());
	}

	listener.EndContact = function(contact) {
		// console.log(contact.GetFixtureA().GetBody().GetUserData());
	}

	listener.PostSolve = function(contact, impulse) {
		var contactDataA = contact.GetFixtureA().GetBody().GetUserData().tag;
		var contactDataB = contact.GetFixtureB().GetBody().GetUserData().tag;
		console.log(contact);
		console.log(impulse);
		if (contactDataA == MazeEnum.BALL) {
			if (contactDataB == MazeEnum.TRAP) {
                var ballBody = contact.GetFixtureA().GetBody();
				ballBody.SetPosition(ballBody.GetUserData().startingPosition);
			} else if (contactDataB == MazeEnum.GOAL) {
				alert('You Win!');
			}
		}
	}

	listener.PreSolve = function(contact, oldManifold) {
		// PreSolve
	}

	return listener;
}
