goog.provide('Ball');

Ball = function(world_size, world) {
    var self = this;
    var size = new goog.math.Coordinate(0.75, 0.75);
    var sprite = new lime.Circle()
        .setFill(new lime.fill.LinearGradient().addColorStop(0.49,200,0,0).addColorStop(.5,0,0,250))
        .setSize(size.x, size.y);
    
    var circleDef = new box2d.CircleDef();
    circleDef.radius = size.x/2;
    circleDef.density = 1.0;
    circleDef.restitution = 1.0;
    circleDef.friction = 0.0;
    
    var bodyDef = new box2d.BodyDef();
    bodyDef.position.Set(world_size.x, world_size.y);
    bodyDef.angularDamping = .09;
    bodyDef.AddShape(circleDef);
    
    var body = world.CreateBody(bodyDef);
    
    this.getBody = function() { return body; }
}
