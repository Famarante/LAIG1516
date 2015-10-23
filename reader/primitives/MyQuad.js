function MyQuad(scene, args) 
{
    CGFobject.call(this,scene);
    this.args= args;
    this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function () 
{

    this.vertices = [
        this.args[0], this.args[3], 0,
        this.args[2], this.args[3], 0,
        this.args[2], this.args[1], 0,
        this.args[0], this.args[1], 0
    ];

    this.indices = [
        0, 1, 2,
        0, 2, 3,
    ];

    this.normals = [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];
    
    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
MyQuad.prototype.updateTextCoord=function(ampS,ampT)
{
    this.texCoords =[
       0,0,
       (this.args[2]-this.args[0])/ampS,0,
       (this.args[2]-this.args[0])/ampS,(this.args[1]-this.args[3])/ampT,
       0,(this.args[1]-this.args[3])/ampT
    ];
    this.updateTexCoordsGLBuffers();
}