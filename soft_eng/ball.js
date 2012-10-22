goog.provide('soft_eng.Ball');

soft_eng.Ball = function(radius, world) {
    var self = this;
	
    var circleDef = new b2FixtureDef;
	circleDef.shape = new b2CircleShape(radius);
    circleDef.density = 1.0;
    circleDef.restitution = 0.2;
    circleDef.friction = 1.0;
	
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody; // ball is moving
    bodyDef.position.x = soft_eng.WIDTH/2;
    bodyDef.position.y = soft_eng.HEIGHT/2;
	
	
    var body = world.CreateBody(bodyDef);
	body.CreateFixture(circleDef);
	
    return body;
}
