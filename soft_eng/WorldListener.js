goog.provide('soft_eng.WorldListener');

soft_eng.WorldListener = function(startingPosition) {
	var b2Listener = Box2D.Dynamics.b2ContactListener;
	var self = this;
	self.startingPosition = startingPosition;
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
				contact.GetFixtureA().GetBody().position = self.startingPosition;
				alert('trap ' + 'startpos = ' + self.startingPosition);
			} else if (contactDataB == MazeEnum.GOAL) {
				alert('goal');
			}
		}
	}

	listener.PreSolve = function(contact, oldManifold) {
		// PreSolve
	}

	return listener;
}
