goog.provide('soft_eng.Block');

soft_eng.Block = function(side, row, col, world)
{
	var self = this;
	var space = 0.535; // space allocated for each maze block (in a 28x20 maze)
	
    var fixDef = new b2FixtureDef;
    fixDef.density = 0.1;
    fixDef.friction = 0.3;
    fixDef.restitution = 0.0;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(side/2, side/2); // it takes half the side (coord from the middle)
	
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody; // walls don't move
    bodyDef.position.x = row * space + space/2;
    bodyDef.position.y = col * space + space/2;
    
    var body = world.CreateBody(bodyDef);
	body.CreateFixture(fixDef);
	
	// add a tag to the body object to represent the maze object type (goal, block, trap, ball)
	var data = { "tag": MazeEnum.BLOCK };
	body.SetUserData(data);
	
    return body;
}
