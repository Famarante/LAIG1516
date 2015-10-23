function LightScene(scene, an, id) {
    CGFlight.call(this, scene, an);
    this.id = id;
}

LightScene.prototype = Object.create(CGFlight.prototype);
LightScene.prototype.constructor = LightScene;