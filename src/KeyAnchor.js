var Particle         = require('famous/physics/bodies/Particle');
var PhysicsEngine    = require('famous/physics/PhysicsEngine');
var Spring           = require('famous/physics/forces/Spring');
var Vector             = require('famous/math/Vector');

function KeyAnchor(key, anchor, engine) {
    var spring = new Spring({
        period: 1.4,
        dampingRatio: 0.22
    });

    var springAnchor = new Particle({
        mass: 1,
        position: new Vector(anchor)
    });

    engine.addBody(springAnchor);
    engine.addBody(key.body);

    engine.attach(spring, springAnchor, key.body);
}

module.exports = KeyAnchor;
