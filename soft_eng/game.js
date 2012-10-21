goog.provide('soft_eng.Game');

goog.require('soft_eng.Ball');

// entrypoint
soft_eng.Game = function() {
	
	// Start listening for Accelerometer, check it every 40ms
	var options = { frequency: 40 };
	var watchID = navigator.accelerometer.watchAcceleration(onAccelerometerSuccess, onAccelerometerError, options);
	
	// onSuccess: Get a snapshot of the current acceleration
	function onAccelerometerSuccess(acceleration) {
		xLabel.setText('x: ' + acceleration.x); 
		yLabel.setText('y: ' + acceleration.y); 
		zLabel.setText('z: ' + acceleration.z); 
		xGrav = acceleration.x * -5000.0;
		yGrav = acceleration.y * 5000.0;
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
	var xLabel = new lime.Label('x: ').setAnchorPoint(0, 0).setPosition(20, 20);
	var yLabel = new lime.Label('y: ').setAnchorPoint(0, 0).setPosition(20, 40);
	var zLabel = new lime.Label('z: ').setAnchorPoint(0, 0).setPosition(20, 60);
	scene.appendChild(xLabel);
	scene.appendChild(yLabel);
	scene.appendChild(zLabel);
	
	
	var world = null;
	var xGrav = null;
	var yGrav = null;
	
	
	var gravity = new box2d.Vec2(0, 0);
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-soft_eng.WIDTH, -soft_eng.HEIGHT);
	bounds.maxVertex.Set(2*soft_eng.WIDTH,2*soft_eng.HEIGHT);
	world = new box2d.World(bounds, gravity, false);
	
	// ball Sprite (lime)
	var ballSprite = (new lime.Circle)
		.setFill(new lime.fill.LinearGradient().addColorStop(0.49,200,0,0).addColorStop(.5,0,0,250))
		.setSize(30, 30);
	layer.appendChild(ballSprite);
	// ballCircle Object (box2d)
	var ball = new soft_eng.Ball(15, world);

	// ground Sprite (lime)
	var groundSprite = (new lime.Sprite)
		.setFill(0,100,0)
		.setSize(320, 20);
	layer.appendChild(groundSprite);
	// groundBox Object (box2d)
	var groundBox = new box2d.BoxDef;
	groundBox.restitution = 0;
	groundBox.density = 0;
	groundBox.friction = 1;
	groundBox.extents.Set(160, 10); // so it looks like we are supposed to set half the value? it'll be interpreted sa 320x10..
	// groundBody Object (box2d)
	var groundBody = new box2d.BodyDef();
	// not sure about this->limejs sprites are also anchored at the center (NOT top left), so we may need to look into this
	groundBody.position.Set(160, 450); // it puts the 'center' of the object in the x,y corrdinate you provide here
	groundBody.rotation = 0.0;
	groundBody.AddShape(groundBox);
	// add ground objects to world
	var ground_body = world.CreateBody(groundBody);
	
	
	// ceiling Sprite (lime)
	var ceilingSprite = (new lime.Sprite)
		.setFill(0,100,0)
		.setSize(320, 20);
	layer.appendChild(ceilingSprite);
	// ceilingBox Object (box2d)
	var ceilingBox = new box2d.BoxDef;
	ceilingBox.restitution = 0;
	ceilingBox.density = 0;
	ceilingBox.friction = 1;
	ceilingBox.extents.Set(160, 10); // so it looks like we are supposed to set half the value? it'll be interpreted sa 320x10..
	// ceilingBody Object (box2d)
	var ceilingBody = new box2d.BodyDef;
	// not sure about this->limejs sprites are also anchored at the center (NOT top left), so we may need to look into this
	ceilingBody.position.Set(160, 10); // it puts the 'center' of the object in the x,y corrdinate you provide here
	ceilingBody.rotation = 0.00;
	ceilingBody.AddShape(ceilingBox);
	// add ceiling objects to world
	var ceiling_body = world.CreateBody(ceilingBody);
	
	
	// rightWall Sprite (lime)
	var rightWallSprite = (new lime.Sprite)
		.setFill(0,100,0)
		.setSize(20, 460);
	layer.appendChild(rightWallSprite);
	// rightWall Object (box2d)
	var rightWallBox = new box2d.BoxDef;
	rightWallBox.restitution = 0;
	rightWallBox.density = 0;
	rightWallBox.friction = 1;
	rightWallBox.extents.Set(10, 230); // so it looks like we are supposed to set half the value? it'll be interpreted sa 320x10..
	// rightWall Object (box2d)
	var rightWallBody = new box2d.BodyDef;
	// not sure about this->limejs sprites are also anchored at the center (NOT top left), so we may need to look into this
	rightWallBody.position.Set(310, 230); // it puts the 'center' of the object in the x,y corrdinate you provide here
	rightWallBody.rotation = 0.00;
	rightWallBody.AddShape(rightWallBox);
	// add rightWall objects to world
	var rightWall_body = world.CreateBody(rightWallBody);
	
	
	// leftWall Sprite (lime)
	var leftWallSprite = (new lime.Sprite)
		.setFill(0,100,0)
		.setSize(20, 460);
	layer.appendChild(leftWallSprite);
	// leftWall Object (box2d)
	var leftWallBox = new box2d.BoxDef;
	leftWallBox.restitution = 0;
	leftWallBox.density = 0;
	leftWallBox.friction = 1;
	leftWallBox.extents.Set(10, 230); // so it looks like we are supposed to set half the value? it'll be interpreted sa 320x10..
	// leftWall Object (box2d)
	var leftWallBody = new box2d.BodyDef;
	// not sure about this->limejs sprites are also anchored at the center (NOT top left), so we may need to look into this
	leftWallBody.position.Set(10, 230); // it puts the 'center' of the object in the x,y corrdinate you provide here
	leftWallBody.rotation = 0.00;
	leftWallBody.AddShape(leftWallBox);
	// add rightWall objects to world
	var leftWall_body = world.CreateBody(leftWallBody);
	
	
	
	lime.scheduleManager.schedule(function(dt) {
		world.Step(dt / 1000, 3);
		//if(dt>100) dt=100; // long delays(after pause) cause false collisions
		//world.Step(dt / 1000, 3);
		
		if (xGrav) {
			//world.m_gravity = new goog.math.Vec2(xGrav, yGrav);
			var force = new box2d.Vec2(xGrav, yGrav);
			var point = ball.GetWorldPoint(ball.GetCenterPosition().clone());
			ball.ApplyForce(force, point);
		}
		
		// attach ball sprite to ball body
		var ballPos = ball.GetCenterPosition().clone();
		ballSprite.setPosition(ballPos);
		
		// attach ground sprite to ground body
		var groundPos = ground_body.GetCenterPosition().clone();
		groundSprite.setPosition(groundPos);
		
		// attach ceiling sprite to ceiling body
		var ceilingPos = ceiling_body.GetCenterPosition().clone();
		ceilingSprite.setPosition(ceilingPos);
		
		// attach rightWall sprite to rightWall body
		var rightWallPos = rightWall_body.GetCenterPosition().clone();
		rightWallSprite.setPosition(rightWallPos);
		
		// attach leftWall sprite to leftWall body
		var leftWallPos = leftWall_body.GetCenterPosition().clone();
		leftWallSprite.setPosition(leftWallPos);
	}, this);
	
	
	return scene;
	
}