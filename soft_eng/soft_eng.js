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


soft_eng.WIDTH = 320;
soft_eng.HEIGHT = 460;


// entrypoint
soft_eng.start = function(){

    /*

    There is no box2d integration in LimeJS yet. This file only
    shows that box2d is in correct path.

    */

	//director
	soft_eng.director = new lime.Director(document.body, soft_eng.WIDTH, soft_eng.HEIGHT);
	soft_eng.director.makeMobileWebAppCapable();

	var gamescene = new lime.Scene();

	var layer = new lime.Layer;
	layer.setPosition(0, 0);
	gamescene.appendChild(layer);

	// set active scene
	soft_eng.director.replaceScene(gamescene);
/*	
    // new API proposal

	var physics = new lime.Physics(layer).setGravity(0,10);
	physics.world
	
	circle.enablePhysics(physics).setAngularDamping(.1).setDesity(.5);
	circle.enablePhysics(physics,bodyDef);
	
	circle.getPhysicsBody();
	
	var phdata = new lime.PhysicsData(lime.ASSETS.filename);
	var circle = phdata.createShape('icecream',physics).setPosition(100,0).setFill();
	

*/
	

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
	circleDef.restitution =.8;
	circleDef.friction = 1;
	// circle object
	var cbodyDef = new box2d.BodyDef;
	cbodyDef.position.Set( soft_eng.WIDTH/2, soft_eng.HEIGHT/2 );
    cbodyDef.angularDamping = .001;
	
	cbodyDef.AddShape(circleDef);
	var circle_body = world.CreateBody(cbodyDef);

	// ground sprite
    var ground = new box2d.BoxDef;
	ground.restitution = .9
	ground.density = 0;
	ground.friction = 1;
	ground.extents.Set(160, 5); // so it looks like we are supposed to set half the value? it'll be interpreted sa 320x10..
    //ground.SetVertices([[-30,-5],[30,-10],[30,10],[-30,10]]); // actually not a box
    // ground object
    var gbodyDef = new box2d.BodyDef;
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
        var pos = circle_body.GetCenterPosition().clone();
        var rot = circle_body.GetRotation();
        circle.setRotation(-rot/Math.PI*180);
        circle.setPosition(pos);
        var pos = ground_body.GetCenterPosition().clone();
        var rot = ground_body.GetRotation();
        box.setRotation(-rot/Math.PI*180);
        box.setPosition(pos);
    },this);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('soft_eng.start', soft_eng.start);
