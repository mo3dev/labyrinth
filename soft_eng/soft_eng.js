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

goog.require('lime');
goog.require('lime.Circle');
goog.require('lime.CoverNode');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('lime.fill.LinearGradient');
goog.require('lime.Label');


soft_eng.WIDTH = 320;
soft_eng.HEIGHT = 460;


// entrypoint
soft_eng.start = function(){
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

        // Update acceleration every 3 seconds
        var options = { frequency: 250 };

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
    }

    // onError: Failed to get the acceleration
    //
    function onAccelerometerError() {
        alert('onError!');
    }


	//director
	soft_eng.director = new lime.Director(document.body, soft_eng.WIDTH, soft_eng.HEIGHT);
	soft_eng.director.makeMobileWebAppCapable();

	var gamescene = new lime.Scene();

	var layer = new lime.Layer;
	layer.setPosition(0, 0);
	gamescene.appendChild(layer);

	// set active scene
	soft_eng.director.replaceScene(gamescene);

	//debugging labels
	var xLabel = new lime.Label('x: ').setAnchorPoint(0, 0).setPosition(0, 0);
	var yLabel = new lime.Label('y: ').setAnchorPoint(0, 0).setPosition(0, 20);
	var zLabel = new lime.Label('z: ').setAnchorPoint(0, 0).setPosition(0, 40);
	var b2Label1 = new lime.Label('dt: ').setAnchorPoint(0, 0).setPosition(0, 60);
	var b2Label2 = new lime.Label('dt: ').setAnchorPoint(0, 0).setPosition(0, 80);
	gamescene.appendChild(xLabel);
	gamescene.appendChild(yLabel);
	gamescene.appendChild(zLabel);
	gamescene.appendChild(b2Label1);
	gamescene.appendChild(b2Label2);
	
	function initGame() {
		var gravity = new box2d.Vec2(0, 500);
		var bounds = new box2d.AABB();
		bounds.minVertex.Set(-soft_eng.WIDTH, -soft_eng.HEIGHT);
		bounds.maxVertex.Set(2*soft_eng.WIDTH,2*soft_eng.HEIGHT);
		var world = new box2d.World(bounds, gravity, false);

		// circle sprite
		var circle = (new lime.Circle)
			.setFill(new lime.fill.LinearGradient().addColorStop(0.49,200,0,0).addColorStop(.5,0,0,250))
			.setSize(30, 30);
		layer.appendChild(circle);
		

		// another ? circle sprite
		var circleDef = new box2d.CircleDef;
		circleDef.radius = circle.getSize().width/2;
		circleDef.density = 1;
		circleDef.restitution =.5;
		circleDef.friction = 1;
		// circle object
		var cbodyDef = new box2d.BodyDef;
		cbodyDef.position.Set( soft_eng.WIDTH/2, soft_eng.HEIGHT/2 );
		cbodyDef.angularDamping = .001;
		
		cbodyDef.AddShape(circleDef);
		var circle_body = world.CreateBody(cbodyDef);

		// ground sprite
		var ground = new box2d.BoxDef;
		ground.restitution = 0.5;
		ground.density = 0;
		ground.friction = 1;
		ground.extents.Set(160, 5); // so it looks like we are supposed to set half the value? it'll be interpreted sa 320x10..
		//ground.SetVertices([[-30,-5],[30,-10],[30,10],[-30,10]]); // actually not a box
		// ground object
		var gbodyDef = new box2d.BodyDef;
		// not sure about this->limejs sprites are also anchored at the center (NOT top left), so we may need to look into this
		gbodyDef.position.Set(160, 455); // it puts the 'center' of the object in the x,y corrdinate you provide here
		gbodyDef.rotation = 0.00;
		
		gbodyDef.AddShape(ground);
		var ground_body = world.CreateBody(gbodyDef);

		var box = (new lime.Sprite)
			.setFill(0,100,0)
			.setSize(320, 10);
		layer.appendChild(box);
		
		goog.events.listen(circle , ['touchstart', 'mousedown'],function(e){ 
			var pos = layer.screenToLocal(e.screenPosition);
			//create mouse Joint 
			var mouseJointDef = new box2d.MouseJointDef(); 
			mouseJointDef.body1 = world.GetGroundBody(); 
			mouseJointDef.body2 = circle_body; 
			mouseJointDef.target.Set(pos.x, pos.y); 
			mouseJointDef.maxForce = 5000 * circle_body.m_mass; 
			mouseJointDef.collideConnected = true; 
			mouseJointDef.dampingRatio = 0; 
			mouseJointDef.frequencyHz = 100; 
			//Add the mouseJoint to the world. 
			var mouseJoint = world.CreateJoint(mouseJointDef); 
			e.swallow(['touchend', 'mouseup'],function(e){
				world.DestroyJoint(mouseJoint); 
			});
			e.swallow(['mousemove', 'touchmove'],function(e){
				var pos = layer.screenToLocal(e.screenPosition);
				mouseJoint.SetTarget(new box2d.Vec2(pos.x, pos.y));
			});
		});

		lime.scheduleManager.schedule(function(dt) {
			world.Step(dt / 1000, 3);
			var cPos = circle_body.GetCenterPosition().clone();
			//var rot = circle_body.GetRotation();
			//circle.setRotation(-rot/Math.PI*180);
			circle.setPosition(cPos);
			var gPos = ground_body.GetCenterPosition().clone();
			//var rot = ground_body.GetRotation();
			//box.setRotation(-rot/Math.PI*180);
			box.setPosition(gPos);
			
			b2Label1.setText('dt:' + dt + " cPos.x = " + cPos.x + " cPos.y = " + cPos.y);
			b2Label2.setText(" gPos.x = " + gPos.x + " gPos.y = " + gPos.y);
		}, this);
	}
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('soft_eng.start', soft_eng.start);
