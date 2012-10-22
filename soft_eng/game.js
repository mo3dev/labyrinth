goog.provide('soft_eng.Game');

goog.require('soft_eng.Ball');
goog.require('soft_eng.Wall');



// entrypoint
soft_eng.Game = function() {
	
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
	
	
	/*var gravity = new box2d.Vec2(0, 0);
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-soft_eng.WIDTH, -soft_eng.HEIGHT);
	bounds.maxVertex.Set(2*soft_eng.WIDTH,2*soft_eng.HEIGHT);
	world = new box2d.World(bounds, gravity, false);*/
	
    world = new b2World(
          new b2Vec2(0, 10)    //gravity
       ,  true                 //allow sleep
    );
	
	// ball Sprite (lime)
	var ballSprite = (new lime.Circle)
		.setFill(new lime.fill.LinearGradient().addColorStop(0.49,200,0,0).addColorStop(.5,0,0,250))
		.setSize(30, 30);
	layer.appendChild(ballSprite);
	var ball = new soft_eng.Ball(15, world);
	

	// ground Sprite (lime)
	var groundSprite = (new lime.Sprite).setFill(0,100,0).setSize(320, 20);
	layer.appendChild(groundSprite);
	// add leftWall body
	var ground_body = new soft_eng.Wall(new b2Vec2(160, 450), 320, 10, world);
	
	
	// ceiling Sprite (lime)
	var ceilingSprite = (new lime.Sprite).setFill(0,100,0).setSize(320, 20);
	layer.appendChild(ceilingSprite);
	// add ceiling
	var ceiling_body = new soft_eng.Wall(new b2Vec2(160, 10), 320, 10, world);
	
	
	// rightWall Sprite (lime)
	var rightWallSprite = (new lime.Sprite).setFill(0,100,0).setSize(20, 460);
	layer.appendChild(rightWallSprite);
	// add rightWall body
	var rightWall_body = new soft_eng.Wall(new b2Vec2(310, 230), 10, 460, world);
	
	
	// leftWall Sprite (lime)
	var leftWallSprite = (new lime.Sprite).setFill(0,100,0).setSize(20, 460);
	layer.appendChild(leftWallSprite);
	// add leftWall body
	var leftWall_body = new soft_eng.Wall(new b2Vec2(10, 230), 10, 460, world);
	
	
	lime.scheduleManager.schedule(function(dt) {
        world.Step(dt / 1000, 3);
		
		if (xGrav) {
			var force = new b2Vec2(xGrav, yGrav);
			var point = ball.GetWorldPoint(ball.GetLocalCenter());
			ball.ApplyForce(force, point);
		}
		
		// attach ball sprite to ball body
		var ballPos = ball.GetWorldCenter();
		ballSprite.setPosition(ballPos);
		
		// attach ground sprite to ground body
		var groundPos = ground_body.GetWorldCenter();
		groundSprite.setPosition(groundPos);
		
		// attach ceiling sprite to ceiling body
		var ceilingPos = ceiling_body.GetWorldCenter();
		ceilingSprite.setPosition(ceilingPos);
		
		// attach rightWall sprite to rightWall body
		var rightWallPos = rightWall_body.GetWorldCenter();
		rightWallSprite.setPosition(rightWallPos);
		
		// attach leftWall sprite to leftWall body
		var leftWallPos = leftWall_body.GetWorldCenter();
		leftWallSprite.setPosition(leftWallPos);
		
	}, this);
	
	
	return scene;
	
}