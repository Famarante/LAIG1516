function MyCircle(scene, slices,radius) {
	CGFobject.call(this,scene);
	this.slices=slices;
	this.vertices = [];
	this.indices = [];
	this.normals= [];
	this.texCoords= [];
	this.radius=radius;
	this.alfa=360/slices;
	this.angle=0;
	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor=MyCircle;

MyCircle.prototype.initBuffers = function () {	
    var x;
	var y;
	var z=0;
	var beta=0;
	var degToRad = Math.PI / 180.0;
    this.vertices.push(0,0,0);//centro
	for(var i=0;i<this.slices+1;i++)
    {
        x=this.radius*Math.cos(this.angle*degToRad);
        y=this.radius*Math.sin(this.angle*degToRad);
        this.vertices.push(x,y,0);
        this.angle += this.alfa;		
    }

	for(var i=0;i<this.slices;i++)
    {
        this.indices.push(0);
        this.indices.push(i+1);
        this.indices.push(i+2);
    }

    for(var k=0; k<this.vertices.length/3;k++)
    {
        this.normals.push(Math.cos(beta*degToRad),Math.sin(beta*degToRad),0);
    }
   
    this.angle=0;
    this.texCoords.push(0.5,0.5);
    for(var i=0;i<this.slices+1;i++)
    {      
        x=(Math.cos(this.angle*degToRad)/2+0.5);
        y=(Math.sin(this.angle*degToRad)/2+0.5);
        this.texCoords.push(x,y);
        this.angle += this.alfa;	
    }
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};