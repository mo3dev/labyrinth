goog.provide('soft_eng.Ball');

soft_eng.Ball = function(radius, world) {
    var self = this;
	
    var circleDef = new box2d.CircleDef();
    circleDef.radius = radius;
    circleDef.density = 1.0;
    circleDef.restitution = 1.0;
    circleDef.friction = 0.0;
    
    var bodyDef = new box2d.BodyDef();
    bodyDef.position.Set(soft_eng.WIDTH/2, soft_eng.HEIGHT/2);
    bodyDef.angularDamping = .09;
    bodyDef.AddShape(circleDef);
    
    var body = world.CreateBody(bodyDef);
    return body;
}
