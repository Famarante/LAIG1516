function MyOpenCylinder(scene, args) 
{
    CGFobject.call(this, scene);
	//ARGUMENTOS
	this.height = args[0];
    this.botRadius = args[1];
    this.topRadius = args[2];
	this.stacks = args[3];
    this.slices = args[4];
	//ARRAYS
	this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];
	
    this.initBuffers();
}

MyOpenCylinder.prototype = Object.create(CGFobject.prototype);
MyOpenCylinder.prototype.constructor = MyOpenCylinder;

MyOpenCylinder.prototype.initBuffers = function () 
{
    var delta = (this.botRadius - this.topRadius) / this.slices;
    var angle = (2 * Math.PI) / this.stacks;
    
    for (var i = 0; i < this.stacks + 1; i++) 
	{
        for (var j = 0; j < this.slices + 1; j++) 
		{
            var radius = this.botRadius - delta * j;
            var x=Math.cos(angle * i);
            var y=Math.sin(angle * i);
            //VERTICES
            this.vertices.push(radius * x,radius * y,(j * 1/this.slices) * this.height);
            //NORMALS
            this.normals.push(radius * x, radius * y, 0);
            //TEXT COORD
            this.texCoords.push(1 - i / this.stacks,j / this.slices);
        }
    }
    //INDICES
    for (var i = 0; i < this.stacks; i++) 
	{
        for(var j = 0; j < this.slices; j++)
		{
            var offset = (this.slices + 1) * i;
            this.indices.push(j + offset, j + offset + this.slices + 1, j + offset + 1);
            this.indices.push(j + offset + 1, j + offset + this.slices + 1, j + offset + this.slices + 2);
        }
    }

   this.primitiveType = this.scene.gl.TRIANGLES;
   this.initGLBuffers();
};