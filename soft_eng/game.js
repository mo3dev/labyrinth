<<<<<<< HEAD:soft_eng/soft_eng.js
//set main namespace
goog.provide('soft_eng');


//get requirements
goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.JointDef');
goog.require('box2d.MouseJointDef');
goog.require('box2d.World');
// lime
goog.require('lime');
goog.require('lime.Circle');
goog.require('lime.CoverNode');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('lime.fill.LinearGradient');
goog.require('lime.Label');
goog.require('lime.transitions.Dissolve');
// custom classes
goog.require('soft_eng.Button');
goog.require('soft_eng.Game');
goog.require('soft_eng.Help');
goog.require('soft_eng.Ball');


// constants
soft_eng.SCALE = 1; // for box2d (pixels/meter)
soft_eng.WIDTH = 320 / soft_eng.SCALE;
soft_eng.HEIGHT = 460 / soft_eng.SCALE;


// entrypoint
soft_eng.start = function(){
	// setup the director
	soft_eng.director = new lime.Director(document.body, soft_eng.WIDTH, soft_eng.HEIGHT);
	soft_eng.director.makeMobileWebAppCapable();
	
	// load the main menu scene
	soft_eng.loadMainMenu();
}

=======
goog.provide('Game');
Game.WIDTH = 320;
Game.HEIGHT = 460;
// entrypoint
Game.start = function(){
	// The watch id references the current `watchAcceleration`
	var watchID = null;
	// Wait for PhoneGap to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // PhoneGap is ready
    //
    function onDeviceReady() {
        startWatch();
        initGame();
    }

    // Start watching the acceleration
    //
    function startWatch() {

        // Update acceleration every .25 seconds
        var options = { frequency: 40 };

        watchID = navigator.accelerometer.watchAcceleration(onAccelerometerSuccess, onAccelerometerError, options);
    }

    // Stop watching the acceleration
    //
    function stopWatch() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }
    }

    // onSuccess: Get a snapshot of the current acceleration
    //
    function onAccelerometerSuccess(acceleration) {
       xLabel.setText('x: ' + acceleration.x); 
       yLabel.setText('y: ' + acceleration.y); 
       zLabel.setText('z: ' + acceleration.z); 
       xGrav = acceleration.x * -5000.0;
       yGrav = acceleration.y * 5000.0;
    }

    // onError: Failed to get the acceleration
    //
    function onAccelerometerError() {
        alert('onError!');
    }

	var scene = new lime.Scene();

	var layer = new lime.Layer;
	layer.setPosition(0, 0);
	scene.appendChild(layer);

	//debugging labels
	var xLabel = new lime.Label('x: ').setAnchorPoint(0, 0).setPosition(20, 20);
	var yLabel = new lime.Label('y: ').setAnchorPoint(0, 0).setPosition(20, 40);
	var zLabel = new lime.Label('z: ').setAnchorPoint(0, 0).setPosition(20, 60);
	var b2Label1 = new lime.Label('dt: ').setAnchorPoint(0, 0).setPosition(20, 80);
	var b2Label2 = new lime.Label(': ').setAnchorPoint(0, 0).setPosition(20, 100);
	scene.appendChild(xLabel);
	scene.appendChild(yLabel);
	scene.appendChild(zLabel);
	scene.appendChild(b2Label1);
	scene.appendChild(b2Label2);
>>>>>>> 4b63c402035590895fcc284dd1531ac941e39b40:soft_eng/game.js

// load main menu scene
soft_eng.loadMainMenu = function() {
	// load the main menu
	var scene = new lime.Scene(),
	layer = new lime.Layer().setPosition(soft_eng.WIDTH / 2, 0);
	
	var title = new lime.Sprite().setFill('assets/main_title.jpg').setPosition(0, 0 / soft_eng.SCALE);
	title.qualityRenderer = true;
	layer.appendChild(title);
	
	// main menu buttons layer
	var buttonsLayer = new lime.Layer().setPosition(0, 200 / soft_eng.SCALE);
	layer.appendChild(buttonsLayer);
	
	
	// add play button
	var playButton = soft_eng.makeButton('Play Game').setPosition(0, 100 / soft_eng.SCALE);
	goog.events.listen(playButton, 'click', function() {
		// play the game!!!
		soft_eng.newGame();
	});
	buttonsLayer.appendChild(playButton);
	
	// add Help button
	var helpButton = soft_eng.makeButton('Help').setPosition(0, 170 / soft_eng.SCALE);
	goog.events.listen(helpButton, 'click', function() {
		// show help window
		soft_eng.loadHelpScene();
	});
	buttonsLayer.appendChild(helpButton);
	
<<<<<<< HEAD:soft_eng/soft_eng.js
	
	// add the layer to the scene and view scene
	scene.appendChild(layer);
	
	// set current scene active
	soft_eng.director.replaceScene(scene, lime.transitions.Dissolve);
}


// load new game scene
soft_eng.newGame = function() {
	alert('PLAY TIIIME');
    var scene = new soft_eng.Game(size);
	soft_eng.director.replaceScene(scene, lime.transitions.Dissolve);
};
=======
	function initGame() {
		var gravity = new box2d.Vec2(0, 0);
		var bounds = new box2d.AABB();
		bounds.minVertex.Set(-Game.WIDTH, -Game.HEIGHT);
		bounds.maxVertex.Set(2*Game.WIDTH,2*Game.HEIGHT);
		world = new box2d.World(bounds, gravity, false);

		// ball Sprite (lime)
		var ballSprite = (new lime.Circle)
			.setFill(new lime.fill.LinearGradient().addColorStop(0.49,200,0,0).addColorStop(.5,0,0,250))
			.setSize(30, 30);
		layer.appendChild(ballSprite);
		// ballCircle Object (box2d)
        var ball = new Ball(Game, world);
>>>>>>> 4b63c402035590895fcc284dd1531ac941e39b40:soft_eng/game.js


<<<<<<< HEAD:soft_eng/soft_eng.js
// helper for same size buttons
soft_eng.makeButton = function(text) {
    var btn = new soft_eng.Button(text).setSize(170 / soft_eng.SCALE, 45 / soft_eng.SCALE);
    return btn;
};


// load new help scene
soft_eng.loadHelpScene = function() {
    //var scene = new soft_eng.Help();
	//soft_eng.director.replaceScene(scene, lime.transitions.Dissolve);
	alert('HEEEEEELP');
};


// this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('soft_eng.start', soft_eng.start);
=======
		lime.scheduleManager.schedule(function(dt) {
			world.Step(dt / 1000, 3);
			//if(dt>100) dt=100; // long delays(after pause) cause false collisions
			//world.Step(dt / 1000, 3);
			
			if (xGrav) {
				//world.m_gravity = new goog.math.Vec2(xGrav, yGrav);
				var force = new box2d.Vec2(xGrav, yGrav);
				var point = ball.getBody().GetWorldPoint(ball.getBody().GetCenterPosition().clone());
				ball.getBody().ApplyForce(force, point);
			}
			
			// attach ball sprite to ball body
			var ballPos = ball.getBody.GetCenterPosition().clone();
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
			
			b2Label1.setText('dt:' + dt + " bPos.x = " + ballPos.x + " bPos.y = " + ballPos.y);
			b2Label2.setText(" gPos.x = " + groundPos.x + " gPos.y = " + groundPos.y);
		}, this);
	}
    return scene
}
>>>>>>> 4b63c402035590895fcc284dd1531ac941e39b40:soft_eng/game.js
