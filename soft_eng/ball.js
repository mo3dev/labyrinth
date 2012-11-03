goog.provide('soft_eng.Ball');

soft_eng.Ball = function(pos, world)
{
	var radius = 0.4;
	var self = this;
	
	this.circleDef = new b2FixtureDef();
	this.circleDef.shape = new b2CircleShape(radius/2);
	this.circleDef.density = 0.5;
	this.circleDef.restitution = 0.2;
	this.circleDef.friction = 0.0;

	this.bodyDef = new b2BodyDef();
	this.bodyDef.type = b2Body.b2_dynamicBody; // ball is moving
	this.bodyDef.position.x = pos.x;
	this.bodyDef.position.y = pos.y;
	
	this.startingPosition = this.bodyDef.position;
	
	this.body = world.CreateBody(this.bodyDef);
	this.body.CreateFixture(this.circleDef);
	
	// add a tag to the body object to represent the maze object type (goal, block, trap, ball)
	var data = { "tag": MazeEnum.BALL };
	this.body.SetUserData(data);
	
	this.sprite = (new lime.Circle)
		.setFill(new lime.fill.LinearGradient().addColorStop(0.49,200,0,0).addColorStop(.5,0,0,250))
		.setSize(radius * soft_eng.SCALE, radius * soft_eng.SCALE);
}
