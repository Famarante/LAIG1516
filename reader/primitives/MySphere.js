function MySphere(scene,args)
 {
 	CGFobject.call(this,scene);
	
	this.slices=args[1];
	this.stacks=args[2];
	this.radius=args[0];
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() 
 {
	var degToRad = Math.PI / 180.0;
	var alfa = 360 * degToRad / this.slices;
	var beta = 180 * degToRad / this.stacks;
	var offset=0;
	var beta_now = 0;
	var beta_then = beta;
	var k = 0;
	var aux = 4 * this.slices;
	
	for (j = 0; j < this.stacks; j++) 
	{	
		var alfa_now = 0;
		var t = 0;
		for (i = 0; i < this.slices; i++) 
		{
			var x0 = this.radius*Math.sin(beta_now) * Math.cos(alfa_now);
			var y0 = this.radius*Math.cos(beta_now);
			var z0 = this.radius*Math.sin(beta_now) * Math.sin(alfa_now);

			var x2 = this.radius*Math.sin(beta_then) * Math.cos(alfa_now);
			var y2 = this.radius*Math.cos(beta_then);
			var z2 = this.radius*Math.sin(beta_then) * Math.sin(alfa_now);

			alfa_now += alfa;

			var x1 = this.radius*Math.sin(beta_now) * Math.cos(alfa_now);
			var y1 = this.radius*Math.cos(beta_now);
			var z1 = this.radius*Math.sin(beta_now) * Math.sin(alfa_now);

			var x3 = this.radius*Math.sin(beta_then) * Math.cos(alfa_now);
			var y3 = this.radius*Math.cos(beta_then);
			var z3 = this.radius*Math.sin(beta_then) * Math.sin(alfa_now);
			//VERTICES
			this.vertices.push(x0,y0,z0);
			this.vertices.push(x1,y1,z1);
			this.vertices.push(x2,y2,z2);
			this.vertices.push(x3,y3,z3);
 			offset = t + k;
			//INDICES
			this.indices.push(offset,offset + 1,offset + 2);
			this.indices.push(offset + 3,offset + 2,offset + 1);
			t += 4;
			//NORMALS
			this.normals.push(x0,y0,z0);
            this.normals.push(x1,y1,z1);
			this.normals.push(x2,y2,z2);
            this.normals.push(x3,y3,z3);
			//TEXT COORD
			this.texCoords.push(1 - i / this.slices, j / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);
		}			
		beta_now += beta;
		beta_then += beta;
		k += aux;
	}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 MySphere.prototype.updateTextCoord=function(ampS,ampT)
 {
 	
 }