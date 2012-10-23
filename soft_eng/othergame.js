goog.provide('soft_eng.OtherGame');

goog.require('soft_eng.Ball');
goog.require('soft_eng.Goal');
goog.require('soft_eng.Trap');
goog.require('soft_eng.Block');

// entrypoint
soft_eng.OtherGame = function() {
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
	
	// Start listening for Accelerometer, set frequency
	var options = { frequency: 100 };
	var watchID = navigator.accelerometer.watchAcceleration(onAccelerometerSuccess, onAccelerometerError, options);
	
	// onSuccess: Get a snapshot of the current acceleration
	function onAccelerometerSuccess(acceleration) {
		if ( xLabel && yLabel && zLabel) {
			xLabel.setText('x: ' + acceleration.x); 
			yLabel.setText('y: ' + acceleration.y); 
			zLabel.setText('z: ' + acceleration.z);
		}
		ballAcceleration.x = acceleration.x;
		ballAcceleration.y = acceleration.y;
	}

	// onError: Failed to get the acceleration
	function onAccelerometerError() {
		alert('onError!');
	}
	
	var scene = new lime.Scene();
	var layer = new lime.Layer();
	layer.setPosition(0, 0);
	scene.appendChild(layer);

	//debugging labels
	//var xLabel = new lime.Label('x: ').setAnchorPoint(0, 0).setPosition(20, 20);
	//var yLabel = new lime.Label('y: ').setAnchorPoint(0, 0).setPosition(20, 40);
	//var zLabel = new lime.Label('z: ').setAnchorPoint(0, 0).setPosition(20, 60);
	//scene.appendChild(xLabel);
	//scene.appendChild(yLabel);
	//scene.appendChild(zLabel);
	
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
		[4, 4, 4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
		[4, 0, 0, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4],
		[4, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
		[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
	];
	
	
	console.log("Entering Maze loop");
	var ball = null;
	var goal = null;
	var traps = [];
	// ball Sprite (lime)
	var ballSprite = null;
	for(var col = 0; col < maze.length; col++) {
		for(var row = 0; row < maze[col].length; row++) {
			if (maze[col][row] == MazeEnum.BALL) {
				// Ball
				var radius = soft_eng.Constants.ball.radius;
				ball = new soft_eng.Ball(soft_eng.Constants.ball.radius, row, col, world);
				ballSprite = new lime.Circle()
					.setFill(
						new lime.fill.LinearGradient()
							.addColorStop(0.49,200,0,0)
							.addColorStop(.5,0,0,250)
						)
					.setSize(radius, radius);
					layer.appendChild(ballSprite);
			} else if (maze[col][row] == MazeEnum.GOAL) {
				// Goal (Stationary)
				var cellSize = soft_eng.Constants.cellSize;
				goal = new soft_eng.Goal(cellSize, row, col, world);
				// goal Sprite (lime)
				var sprite = new lime.Circle()
					.setFill(0,100,100)
					.setSize(cellSize, cellSize);
				var position = goal.GetWorldCenter();
				sprite.setPosition(position.x * cellSize, position.y * cellSize);
				layer.appendChild(sprite);
				
			} else if (maze[col][row] == MazeEnum.TRAP) {
				// Trap (Stationary)
				var cellSize = soft_eng.Constants.cellSize;
				var trap = new soft_eng.Trap(cellSize, row, col, world);
				// trap Sprite (lime)
				var sprite = new lime.Circle()
					.setFill(0,100,200)
					.setSize(cellSize, cellSize);
				var position = trap.GetWorldCenter();
				sprite.setPosition(position.x * cellSize, position.y * cellSize);
				layer.appendChild(sprite);
				
				// TODO add trap holes to an array to be checked in the game loop (whether the ball went into a trap hole)
				
			} else if (maze[col][row] == MazeEnum.BLOCK) {
				// Block (Stationary)cellSize
				var cellSize = soft_eng.Constants.cellSize;
				var block = new soft_eng.Block(cellSize, row, col, world);
				// block Sprite (lime)
				var sprite = new lime.Circle()
					.setFill(200,100,0)
					.setSize(cellSize, cellSize);
				var position = block.GetWorldCenter();
				sprite.setPosition(position.x * cellSize, position.y * cellSize);
				layer.appendChild(sprite);
			}
		}
	}
	console.log("Exiting Maze loop");
	
	console.log("Entering Game loop");
	// game loop
	lime.scheduleManager.schedule(function(dt) {
        world.Step(1 / 60, 6, 6);
		
		var kFilterFactor = 1.0;
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
		}
		
		// set the ball sprite's position and attach to ball object
		var ballPos = ball.GetWorldCenter();
		var cellSize = soft_eng.Constants.cellSize;
		ballSprite.setPosition(ballPos.x * cellSize, ballPos.y * cellSize);
		world.ClearForces();
	}, this);
	
	console.log("Exiting Game loop");
	console.log("end");
	scene.setSize(soft_eng.Constants.canvasSize.x, soft_eng.Constants.canvasSize.y);
	return scene;
}
