goog.provide('soft_eng.Ball');

soft_eng.Ball = function(radius, row, col, world)
{
	var self = this;
	var space = 0.535; // space allocated for each maze block (in a 28x20 maze)
	
	this.circleDef = new b2FixtureDef();
	this.circleDef.shape = new b2CircleShape(radius/2);
	this.circleDef.density = 0.5;
	this.circleDef.restitution = 0.2;
	this.circleDef.friction = 0.0;

	this.bodyDef = new b2BodyDef();
	this.bodyDef.type = b2Body.b2_dynamicBody; // ball is moving
	this.bodyDef.position.x = row * space + space/2;
	this.bodyDef.position.y = col * space + space/2;
	
	this.body = world.CreateBody(this.bodyDef);
	this.body.CreateFixture(this.circleDef);
	
	// add a tag to the body object to represent the maze object type (goal, block, trap, ball)
	var data = { "tag": MazeEnum.BALL };
	this.body.SetUserData(data);
}
