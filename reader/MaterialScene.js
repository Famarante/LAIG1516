function MaterialScene(scene, id) {
    CGFappearance.call(this, scene);
    this.id = id;
}
MaterialScene.prototype = Object.create(CGFappearance.prototype);
MaterialScene.prototype.constructor = MaterialScene;