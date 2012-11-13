goog.provide('soft_eng.Game');

goog.require('soft_eng.Ball');
goog.require('soft_eng.Goal');
goog.require('soft_eng.Trap');
goog.require('soft_eng.Block');
goog.require('soft_eng.Constants');
goog.require('soft_eng.WorldListener');

// entrypoint
soft_eng.Game = function() {
	console.log("begin");
	// maze object type enum
	MazeEnum = {"EMPTY": 0, "BALL": 1, "GOAL": 2, "TRAP": 3, "BLOCK": 4};
	
	b2Vec2 = Box2D.Common.Math.b2Vec2;
	b2BodyDef = Box2D.Dynamics.b2BodyDef;
	b2Body = Box2D.Dynamics.b2Body;
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	b2Fixture = Box2D.Dynamics.b2Fixture;
	b2World = Box2D.Dynamics.b2World;
	b2MassData = Box2D.Collision.Shapes.b2MassData;
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	
	var scene = new lime.Scene();
	var layer = new lime.Layer();
	layer.setPosition(0, 0);
	scene.appendChild(layer);

	//debugging labels
	var xLabel = new lime.Label('x: ').setAnchorPoint(0, 0).setPosition(20, 20);
	var yLabel = new lime.Label('y: ').setAnchorPoint(0, 0).setPosition(20, 40);
	var zLabel = new lime.Label('z: ').setAnchorPoint(0, 0).setPosition(20, 60);
	scene.appendChild(xLabel);
	scene.appendChild(yLabel);
	scene.appendChild(zLabel);
	
	var ballAcceleration = {},
	prevAcceleration = {};
    var world = new b2World(new b2Vec2(0, 0), true);
	
	var maze = [
		[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4, 3, 0, 3, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 4, 4, 4, 3, 0, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 3, 4, 4, 4, 4, 0, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 4, 4, 0, 0, 0, 4, 3, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 0, 0, 0, 1, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 1, 4, 4],
		[4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 1, 0, 4, 4],
		[4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4],
		[4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 0, 0, 0, 4, 4],
		[4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4],
		[4, 4, 4, 0, 3, 4, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 0, 4, 4, 4],
		[4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4],
		[4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0, 4, 0, 4, 0, 4, 0, 4, 4],
		[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
		[4, 0, 0, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4],
		[4, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
		[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
	];
	
	
	console.log("Entering Maze loop");
    var balls = [];
	var goal = null;
	var traps = [];
	var cellSize = soft_eng.Constants.cellSize;
	for(var col = 0; col < maze.length; col++) {
		for(var row = 0; row < maze[col].length; row++) {
			var pos = {};
			pos.x = row * cellSize + cellSize/2;
			pos.y = col * cellSize + cellSize/2;
			if (maze[col][row] == MazeEnum.BALL) {
				// Ball
                var b = new soft_eng.Ball(pos, world);
				balls.push(b);
				layer.appendChild(b.sprite);
			} else if (maze[col][row] == MazeEnum.GOAL) {
				// Goal (Stationary)
				goal = new soft_eng.Goal(pos, world);
				layer.appendChild(goal.sprite);
			} else if (maze[col][row] == MazeEnum.TRAP) {
				// Trap (Stationary)
				var trap = new soft_eng.Trap(pos, world);
				layer.appendChild(trap.sprite);
				
				// TODO add trap holes to an array to be checked in the game loop (whether the ball went into a trap hole)
				
			} else if (maze[col][row] == MazeEnum.BLOCK) {
				// Block (Stationary)
				var block = new soft_eng.Block(pos, world);
				// block Sprite (lime)
				layer.appendChild(block.sprite);
			}
		}
	}
	console.log("Exiting Maze loop");
	console.log("Entering Game loop");
	
	// http://stackoverflow.com/questions/12317040/box2dweb-walls-dont-bounce-a-slow-object
	//Box2D.Common.b2Settings.b2_velocityThreshold = 0.0;
	// game loop
	var FRAME_RATE = 12;
	lime.scheduleManager.setDisplayRate(FRAME_RATE);
	lime.scheduleManager.schedule(function(dt) {
		//http://stackoverflow.com/questions/9451746/box2d-circular-body-stuck-in-corners
		// setting to never sleep seems to negatively affect performance so reset the bool here
        world.Step(1 / FRAME_RATE / 2, 6, 6);
		
		var kFilterFactor = 0.9;
		if (ballAcceleration.x && ballAcceleration.y) {
			var accel = {};
			if (prevAcceleration.x && prevAcceleration.y) {
				accel.x = ballAcceleration.x * -kFilterFactor + (1- kFilterFactor)*prevAcceleration.x;
				accel.y = ballAcceleration.y * kFilterFactor + (1- kFilterFactor)*prevAcceleration.y;
			} else {
				accel.x = ballAcceleration.x * -kFilterFactor;
				accel.y = ballAcceleration.y * kFilterFactor;
			}
			prevAcceleration.x = accel.x;
			prevAcceleration.y = accel.y;

			var newGravity = new b2Vec2(accel.x, accel.y);
			world.SetGravity(newGravity); // set the world's gravity, the ball will move accordingly

			// set the ball sprite's position and attach to ball object
            for (var b in balls) {
                var ball = balls[b];
                ball.body.SetAwake(true);
                var ballPos = ball.body.GetWorldCenter();
                ball.sprite.setPosition(ballPos.x * soft_eng.SCALE, ballPos.y * soft_eng.SCALE);
                // world.ClearForces(); // too expensive - we only have a few moving bodies
                ball.body.m_force.SetZero(); // ClearForces
                ball.body.m_torque = 0.0; // ClearForces
            }

		}
	}, this);
		
	// onSuccess: Get a snapshot of the current acceleration
	var onAccelerometerSuccess = function(acceleration) {
		xLabel.setText('x: ' + acceleration.x); 
		yLabel.setText('y: ' + acceleration.y); 
		zLabel.setText('z: ' + acceleration.z);
		ballAcceleration.x = acceleration.x;
		ballAcceleration.y = acceleration.y;
	}

	// onError: Failed to get the acceleration
	var onAccelerometerError = function() {
		alert('onError!');
	}
	
	// Start listening for Accelerometer, set frequency
	var options = { frequency: FRAME_RATE * 12 }; // this should be some multiple of the frame rate (in ms, rather than fraction) (24x12=288)
	var watchID = navigator.accelerometer.watchAcceleration(onAccelerometerSuccess, onAccelerometerError, options);

	world.SetContactListener(new soft_eng.WorldListener(this));
	
	console.log("Exiting Game loop");
	console.log("end");
	
    this.getScene = function() { return scene; };
    this.getBalls = function() { return balls; };
}
