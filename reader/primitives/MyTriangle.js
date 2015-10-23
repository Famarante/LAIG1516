function MyTriangle(scene, args) 
{
    CGFobject.call(this,scene);
    this.args= args;
    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () 
{

    this.vertices = [
        this.args[0], this.args[1], this.args[2],
        this.args[3], this.args[4], this.args[5],
        this.args[6], this.args[7], this.args[8]
    ];

    this.indices = [
        0, 1, 2,
    ];
    var V1 = vec3.fromValues(this.args[3] - this.args[0], this.args[4] - this.args[1], this.args[5] - this.args[2]);
    var V2 = vec3.fromValues(this.args[6] - this.args[3], this.args[7] - this.args[4], this.args[8] - this.args[5]);
    var VN = vec3.create();
    vec3.cross(VN, V1, V2);
    vec3.normalize(VN, VN);
	
	this.normals = [
		VN[0], VN[1], VN[2],
		VN[0], VN[1], VN[2],
		VN[0], VN[1], VN[2]
    ];

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
MyTriangle.prototype.updateTextCoord=function(ampS,ampT)
{
    var CB=Math.sqrt(Math.pow((this.args[6]-this.args[3]),2)+Math.pow((this.args[7]-this.args[4]),2)+Math.pow((this.args[8]-this.args[5]),2));
    var AC=Math.sqrt(Math.pow((this.args[6]-this.args[0]),2)+Math.pow((this.args[7]-this.args[1]),2)+Math.pow((this.args[8]-this.args[2]),2));
    var AB=Math.sqrt(Math.pow((this.args[3]-this.args[0]),2)+Math.pow((this.args[4]-this.args[1]),2)+Math.pow((this.args[5]-this.args[2]),2));

    var cos_beta=(CB*CB-AC*AC+AB*AB)/2*CB*AB;
    var sin_beta=Math.sqrt(1-cos_beta*cos_beta);
    this.texCoords=[
        0,0,
        AB/ampS,0,
        (AB-(CB*cos_beta))/ampS,(CB*sin_beta)/ampT
    ]
this.updateTexCoordsGLBuffers();
}