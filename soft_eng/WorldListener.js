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
		//console.log(device.platform);
		// don't think you can call vibrate here b/c it's during the step
		//if (device.platform.indexOf("Android") > -1) {
		//	navigator.notification.vibrate(50);
		//}
		if (contactDataA == MazeEnum.BALL) {
			if (contactDataB == MazeEnum.TRAP) {
                var ballData = contact.GetFixtureA().GetBody().GetUserData();
                ballData.flaggedForDeletion = true;
			} else if (contactDataB == MazeEnum.GOAL) {
				var ballData = contact.GetFixtureA().GetBody().GetUserData();
                ballData.flaggedForDeletion = true;
                ballData.hasReachedTheGoal = true;
			}
		}
	}

	listener.PreSolve = function(contact, oldManifold) {
		// PreSolve
	}

	return listener;
}
