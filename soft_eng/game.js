goog.provide('soft_eng.Game');

goog.require('soft_eng.Ball');
goog.require('soft_eng.Goal');
goog.require('soft_eng.Trap');
goog.require('soft_eng.Block');
goog.require('soft_eng.Constants');
goog.require('soft_eng.WorldListener');
goog.require('soft_eng.WorldListener');
goog.require("Levels");

// entrypoint
soft_eng.Game = function(director, level) {
	console.log("begin");
	var startDate = new Date();
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
    var self = this;
	layer.setPosition(0, 0);
	scene.appendChild(layer);
	
	backgroundSprite = new lime.Sprite().setSize(soft_eng.WIDTH, soft_eng.HEIGHT).setFill('#a5ff00').setAnchorPoint(0,0);
	layer.appendChild(backgroundSprite);

	//debugging labels
	var xLabel = new lime.Label('').setAnchorPoint(0, 0).setPosition(20, 20);
	var yLabel = new lime.Label('').setAnchorPoint(0, 0).setPosition(20, 40);
	var zLabel = new lime.Label('').setAnchorPoint(0, 0).setPosition(20, 60);
	scene.appendChild(xLabel);
	scene.appendChild(yLabel);
	scene.appendChild(zLabel);
	
	var ballAcceleration = {},
	prevAcceleration = {};
    var world = new b2World(new b2Vec2(0, 0), true);
    var FRAME_RATE = 18;
    var balls = [];
    var goal = null;
    var traps = [];
    this.timesTrapped = 0;
    
	this.director = director;
    this.getScene = function() { return scene; };
    this.getBalls = function() { return balls; };
    this.addBall = function(pos) {
        // Ball
        var b = new soft_eng.Ball(pos, world);
        balls.push(b);
        layer.appendChild(b.sprite);
    };
    this.removeBall = function(ball) {
        for (var x = 0; x < balls.length; x++) {
            if (balls[x] === ball) {
                ball.sprite.setHidden(true);
                world.DestroyBody(ball.body);
                balls.splice(x, 1);
                console.log("balls.length = " + balls.length);
            }
        }
    }
	var startGame = function() {
        console.log("Entering Maze loop");
        var cellSize = soft_eng.Constants.cellSize;
        var maze = Levels[level % Levels.length];
        for(var col = 0; col < maze.length; col++) {
            for(var row = 0; row < maze[col].length; row++) {
                var pos = {};
                pos.x = row * cellSize + cellSize/2;
                pos.y = col * cellSize + cellSize/2;
                if (maze[col][row] == MazeEnum.BALL) {
                    // Ball
                    self.addBall(pos);
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
        lime.scheduleManager.setDisplayRate(FRAME_RATE);
        
        var worldStep = function(dt) {
            //http://stackoverflow.com/questions/9451746/box2d-circular-body-stuck-in-corners
            // setting to never sleep seems to negatively affect performance so reset the bool here
            world.Step(1 / FRAME_RATE, 8, 3);
            
            var kFilterFactor = 0.2;
            if (ballAcceleration.x && ballAcceleration.y) {
                /*var accel = {};
                if (prevAcceleration.x && prevAcceleration.y) {
                    accel.x = ballAcceleration.x * -kFilterFactor + (1- kFilterFactor)*prevAcceleration.x;
                    accel.y = ballAcceleration.y * kFilterFactor + (1- kFilterFactor)*prevAcceleration.y;
                } else {
                    accel.x = ballAcceleration.x * -kFilterFactor;
                    accel.y = ballAcceleration.y * kFilterFactor;
                }
                prevAcceleration.x = accel.x;
                prevAcceleration.y = accel.y;

                var newGravity = new b2Vec2(accel.x, accel.y);*/
		var newGravity = new b2Vec2(-ballAcceleration.x/6, ballAcceleration.y/6);
                world.SetGravity(newGravity); // set the world's gravity, the ball will move accordingly

                // set the ball sprite's position and attach to ball object
                for (var b in balls) {
                    var ball = balls[b];
                    if (ball.body.GetUserData().flaggedForDeletion) {
						if (!ball.body.GetUserData().hasReachedTheGoal) {
							self.addBall(ball.startingPosition);
						}
						self.removeBall(ball);
						continue;
					}
                    ball.body.SetAwake(true);
                    var ballPos = ball.body.GetWorldCenter();
                    ball.sprite.setPosition(ballPos.x * soft_eng.SCALE, ballPos.y * soft_eng.SCALE);
                    // world.ClearForces(); // too expensive - we only have a few moving bodies
                    ball.body.m_force.SetZero(); // ClearForces
                    ball.body.m_torque = 0.0; // ClearForces
                }
            }
			if (balls.length < 1) {
				lime.scheduleManager.unschedule(worldStep, this);
				navigator.accelerometer.clearWatch(watchID);
				watchID = null;
				
				levelFinishedAlert();
				
			}
			console.log("balls.length = " + balls.length);
        };
        
        lime.scheduleManager.schedule(worldStep, this);
    };
	
	
		
	// onSuccess: Get a snapshot of the current acceleration
	var onAccelerometerSuccess = function(acceleration) {
		//xLabel.setText('x: ' + acceleration.x); 
		//yLabel.setText('y: ' + acceleration.y); 
		//zLabel.setText('z: ' + acceleration.z);
		ballAcceleration.x = acceleration.x;
		ballAcceleration.y = acceleration.y;
	};

	// onError: Failed to get the acceleration
	var onAccelerometerError = function() {
		alert('onError!');
	};
	
	// Start listening for Accelerometer, set frequency
	var options = { frequency: FRAME_RATE * 12 }; // this should be some multiple of the frame rate (in ms, rather than fraction) (24x12=288)
	var watchID = navigator.accelerometer.watchAcceleration(onAccelerometerSuccess, onAccelerometerError, options);

	world.SetContactListener(new soft_eng.WorldListener(this));
	
	var dispose = function() {
		lime.scheduleManager.unschedule(worldStep, this);
		navigator.accelerometer.clearWatch(watchID);
		watchID = null;
	};
	
	// phonegap alert is better than a normal javascript alert.
	var levelFinishedAlert = function() {
		endDate = new Date();
		elapsedSeconds = (endDate - startDate)/1000;
		
		navigator.notification.confirm(
		'You have solved the maze in: ' + elapsedSeconds + ' seconds.\nTrapped ' + self.timesTrapped + " times.", // message
		onLevelFinishedAlertConfirm, // callback
		'Well done!',            	// title
		'Quit,Continue'          		// actions. this can be 'Continue,Quit,etc..'
		);
	};
	// this controls what to do when a button is pressed (could be multiple actions based on the button choice)
	var onLevelFinishedAlertConfirm = function(button) {
		if (button == 2) {
			// new level
			newLevel = new soft_eng.Game(self.director, ++level).getScene();
			soft_eng.director.replaceScene(newLevel);
		}
		if (button == 1) {
			soft_eng.loadMainMenu();
		}
	};
	
	var showMenu = function() {
		//this.director.setPaused(true);
		navigator.notification.confirm(
		'Why would you want to quit my game JERK?', // message
		continueGame, // callback
		'Game Paused',            	// title
		'Quit,Continue'          		// actions. this can be 'Continue,Quit,etc..'
		);
	};
	
	var continueGame = function(button) {
		//this.director.setPaused(false);
		if (button == 1) {
			//dispose();
			soft_eng.loadMainMenu();
		}
	};
	
	setTimeout(function() {
		goog.events.listen(scene, 'click', showMenu);
	}, 500);
	
	
	console.log("Exiting Game loop");
	console.log("end");
    startGame();
}
