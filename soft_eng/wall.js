goog.provide('soft_eng.Wall');

soft_eng.Wall = function(position, width, height, world) {
    var self = this;

    var fixDef = new b2FixtureDef;
    fixDef.density = 0;
    fixDef.friction = 0;
    fixDef.restitution = 0;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(width, height);
         
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody; // walls don't move
    bodyDef.position.x = position.x;
    bodyDef.position.y = position.y;
    
    var body = world.CreateBody(bodyDef);
	body.CreateFixture(fixDef);
	
    return body;
}
