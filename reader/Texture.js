function Texture(scene, id, amps, ampt)
{
    CGFappearance.call(this, scene);
    this.id=id;
    this.amp_s=amps;
    this.amp_t=ampt;
}
Texture.prototype = Object.create(CGFappearance.prototype);
Texture.prototype.constructor = Texture;