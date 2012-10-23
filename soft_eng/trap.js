goog.provide('soft_eng.Trap');

soft_eng.Trap = function(radius, row, col, world) {
	var self = this;
	
	console.log('inside trap');
	
    var circleDef = new b2FixtureDef;
	circleDef.shape = new b2CircleShape(radius/2);
    circleDef.density = 0.1;
    circleDef.restitution = 0.0;
    circleDef.friction = 0.3;
	
	var space = 0.535; // space allocated for each maze block (in a 28x20 maze)
	
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody; // holes don't move
    bodyDef.position.x = row * space + space/2;
    bodyDef.position.y = col * space + space/2;
	
    var body = world.CreateBody(bodyDef);
	body.CreateFixture(circleDef);
	
	// add a tag to the body object to represent the maze object type (goal, block, trap, ball)
	var data = { "tag": MazeEnum.TRAP };
	body.SetUserData(data);
	
    return body;
}
