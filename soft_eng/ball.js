goog.provide('soft_eng.Ball');
goog.require('goog.object');
soft_eng.Ball = function(pos, world) {
	var radius = 0.4;
	var self = this;
	
	this.circleDef = new b2FixtureDef();
	this.circleDef.shape = new b2CircleShape(radius/2);
	this.circleDef.density = 0.5;
	this.circleDef.restitution = 0.25;
	this.circleDef.friction = 0.0;

	this.bodyDef = new b2BodyDef();
	this.bodyDef.type = b2Body.b2_dynamicBody; // ball is moving
	this.bodyDef.position.x = pos.x;
	this.bodyDef.position.y = pos.y;
	
	this.startingPosition = goog.object.clone(pos);
	
	this.body = world.CreateBody(this.bodyDef);
	this.body.CreateFixture(this.circleDef);
	
	// add a tag to the body object to represent the maze object type (goal, block, trap, ball)
	var data = { "tag": MazeEnum.BALL, "startingPosition": this.startingPosition, "ball": this, "flaggedForDeletion": false, "hasReachedTheGoal": false };
	this.body.SetUserData(data);
	
	this.sprite = (new lime.Circle)
		.setFill('#FF0000')
		.setSize(radius * soft_eng.SCALE, radius * soft_eng.SCALE);
}
