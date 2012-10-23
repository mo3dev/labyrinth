goog.provide('soft_eng.Ball');

soft_eng.Ball = function(radius, row, col, world)
{
	var self = this;
	var space = 0.535; // space allocated for each maze block (in a 28x20 maze)
	
	var circleDef = new b2FixtureDef;
	circleDef.shape = new b2CircleShape(radius/2);
	circleDef.density = 1.0;
	circleDef.restitution = 0.2;
	circleDef.friction = 0.0;

	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody; // ball is moving
	bodyDef.position.x = row * space + space/2;
	bodyDef.position.y = col * space + space/2;
	
	var body = world.CreateBody(bodyDef);
	body.CreateFixture(circleDef);
	
	// add a tag to the body object to represent the maze object type (goal, block, trap, ball)
	var data = { "tag": MazeEnum.BALL };
	body.SetUserData(data);
	
	return body;
}
