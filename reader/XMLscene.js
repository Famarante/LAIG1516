function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) 
{
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
	this.primitives = [];
	this.lights=[];
    this.materials=[];
    this.textures=[];
    this.loadedTextures=[];
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.enableTextures(true);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
	
	this.axis=new CGFaxis(this);

	this.defaultAppearance=new CGFappearance(this);
	this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);

    this.scene_material;
	
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () 
{
  	this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	//INITIALS
	//FRUSTUM
	this.camera.near=this.graph.frustum['near'];
	this.camera.far=this.graph.frustum['far'];
	//ILLUMINATION SETTINGS FROM XML
	//BACKGROUND
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	//AMBIENT
	this.setGlobalAmbientLight(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
	this.initLights();
	this.initLeaves();
	this.initMaterials();
	this.initTextures();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();
	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	this.setDefaultAppearance();
	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		 //APPLY INITIALS
		 //translation from INITIALS
		 this.translate(this.graph.translate[0],this.graph.translate[1],this.graph.translate[2]);
		 //rotation from INITIALS
		 for(var i =0; i<this.graph.rotation.length;i++)
		 {
			var aux_r=this.graph.rotation[i]
		 	switch(aux_r['axis'])
		 	{
		 		case 'x':
		 			this.rotate(aux_r['angle']*(Math.PI / 180),1,0,0);
		 			break;
		 		case 'y':
		 			this.rotate(aux_r['angle']*(Math.PI / 180),0,1,0);
		 			break;
		 		case 'z':
		 			this.rotate(aux_r['angle']*(Math.PI / 180),0,0,1);
		 			break;
		 	}
		 }
		 //scale from INITIALS
		 this.scale(this.graph.scale[0],this.graph.scale[1],this.graph.scale[2]);
		 //update light
		 for (var i = 0; i < this.lights.length; i++)
         {
         	this.lights[i].update();
         } 
         this.initLoadGraph(this.graph.root, this.defaultAppearance, null);
	};	
    this.shader.unbind();
};
//Inicializa o array this.lights com as as luzes e respectivos argumentos provenientes do xml
XMLscene.prototype.initLights=function()
{
	this.shader.bind();
	this.lights_ids = [];
	for(var i=0;i<this.graph.light.length;i++)
	{
		var current_ligth=this.graph.light[i];
		var id = this.graph.light[i][0];
		var scene_light=new CGFlight(this,i);
		scene_light.id=current_ligth[0];
		if(current_ligth[1]==1)
		{
			scene_light.enable();
		}
		else
		{
			scene_light.disable();
		}
		scene_light.setPosition(current_ligth[2][0],current_ligth[2][1],current_ligth[2][2],current_ligth[2][3]);
		scene_light.setAmbient(current_ligth[3][0],current_ligth[3][1],current_ligth[3][2],current_ligth[3][3]);
		scene_light.setDiffuse(current_ligth[4][0],current_ligth[4][1],current_ligth[4][2],current_ligth[4][3]);
		scene_light.setSpecular(current_ligth[5][0],current_ligth[5][1],current_ligth[5][2],current_ligth[5][3]);
		scene_light.setVisible(true);
		scene_light.update();
		this.lights[i]=scene_light;
		this.lights_ids[id] = current_ligth[1]; 
	}
    this.shader.unbind();
    this.interface.change_lights();
}
//Inicializa o array this.materials com as os materiais e respectivos argumentos provenientes do xml
XMLscene.prototype.initMaterials=function()
{
	for(var i=0;i<this.graph.material.length;i++)
	{
		var current_material=this.graph.material[i];
		var scene_material=new MaterialScene(this,current_material[0]);
		scene_material.setShininess(current_material[1]);
		scene_material.setSpecular(current_material[2][0],current_material[2][1],current_material[2][2],current_material[2][3]);
		scene_material.setDiffuse(current_material[3][0],current_material[3][1],current_material[3][2],current_material[3][3]);
		scene_material.setAmbient(current_material[4][0],current_material[4][1],current_material[4][2],current_material[4][3]);
		scene_material.setEmission(current_material[5][0],current_material[5][1],current_material[5][2],current_material[5][3]);
		this.materials[i]=scene_material;
	}
}
//Inicializa o array this.textures com as as texturas e respectivos argumentos provenientes do xml
XMLscene.prototype.initTextures=function()
{
	for(var i=0;i<this.graph.texture.length;i++)
	{
		var aux_text=this.graph.texture[i];
		var temp_text= new Texture(this,this.graph.texture[i][0],this.graph.texture[i][2][0],this.graph.texture[i][2][1]);
		//temp_text.loadTexture(this.graph.texture[i][1]);
		this.textures[i]=temp_text;
		var temp_text2= new CGFtexture(this,'scenes/images/' + this.graph.texture[i][0] + '.png');
		this.loadedTextures[i]=temp_text2;
	}
}
//Inicializa o array this.primitives com as primitivas e respectivos argumentos provenientes do xml
XMLscene.prototype.initLeaves=function()
{
	for(var i=0;i<this.graph.leaves.length;i++)
	{
		var aux_leaf=this.graph.leaves[i];
		switch(aux_leaf[1])
		{
			case 'sphere':
				var radius=aux_leaf[2]['radius'];
				var par=aux_leaf[2]['parts_along_radius'];
				var pps=aux_leaf[2]['parts_per_section'];
				var leaf=new MySphere(this, [radius,par,pps]);
				leaf.id=aux_leaf[0];
				this.primitives[i]=leaf;
				break;
			case 'rectangle':
				var xt=aux_leaf[2]['x1'];
				var yt=aux_leaf[2]['y1'];
				var xb=aux_leaf[2]['x2'];
				var yb=aux_leaf[2]['y2'];
				var leaf=new MyQuad(this,[xt,yt,xb,yb]);
				leaf.id=aux_leaf[0];
				this.primitives[i]=leaf;
				break;
			case 'triangle':
				var x1=aux_leaf[2]['x1'];
				var y1=aux_leaf[2]['y1'];
				var z1=aux_leaf[2]['z1'];
				var x2=aux_leaf[2]['x2'];
				var y2=aux_leaf[2]['y2'];
				var z2=aux_leaf[2]['z2'];
				var x3=aux_leaf[2]['x3'];
				var y3=aux_leaf[2]['y3'];
				var z3=aux_leaf[2]['z3'];
				var leaf=new MyTriangle(this,[x1,y1,z1,x2,y2,z2,x3,y3,z3]);
				leaf.id=aux_leaf[0];
				this.primitives[i]=leaf;
				break;
			case 'cylinder':
				var height=aux_leaf[2]['height'];
				var bot_radius=aux_leaf[2]['bottom_radius'];
				var top_radius=aux_leaf[2]['top_radius'];
				var stack=aux_leaf[2]['sections_along_heigth'];
				var slices=aux_leaf[2]['parts_per_section'];
				var leaf=new MyCylinder(this,[height,bot_radius,top_radius,stack,slices]);
				leaf.id=aux_leaf[0];
				this.primitives[i]=leaf;
				break;
		}
	}
}
//Aplica as tranformações geométricas, as texturas e os materiais aos nós do grafo de cena    IMPORTANTEEEE TENTAR MODIFICAR
XMLscene.prototype.initLoadGraph=function(node, previous_material, previous_texture)
{	
	var node_aux;
	var bool;

	for(var i=0;i<this.graph.nodes.length;i++)
	{
		if(node==this.graph.nodes[i].id)
		{
			node_aux=this.graph.nodes[i];	
			break;
		}
		else
		{
			node_aux='null';
		}
	}
	if(node_aux==null)
	{
		return "ERROR";
	}
	else
	{
		//verificar se é folha
		for(var i=0;i<this.graph.leaves.length;i++)
		{
			if(node_aux.descendents[0]==this.graph.leaves[i].id)
			{
				bool=true;
				break;
			}
			else
			{
				bool=false;
			}
		}
		if(bool==false&node_aux.descendents.length>1)
		{
			for(var i=0;i<node_aux.descendents.length;i++)
			{
				this.pushMatrix();
					this.multMatrix(node_aux.matrix);
					var tex=this.getTextureById(node_aux.texture);
					var mat=this.getMaterialById(node_aux.material);

					this.scene_material=new MaterialScene(this, mat);
					
					if(mat!='null')
					{
						this.scene_material = this.materials[mat];
					}
					else{
						this.scene_material.setShininess(previous_material.shininess);
						this.scene_material.setSpecular(previous_material.specular[0],previous_material.specular[1],previous_material.specular[2],previous_material.specular[3]);
						this.scene_material.setDiffuse(previous_material.diffuse[0],previous_material.diffuse[1],previous_material.diffuse[2],previous_material.diffuse[3]);
						this.scene_material.setAmbient(previous_material.ambient[0],previous_material.ambient[1],previous_material.ambient[2],previous_material.ambient[3]);
						this.scene_material.setEmission(previous_material.emission[0],previous_material.emission[1],previous_material.emission[2],previous_material.emission[3]);
					}

					if(tex!='null')
					{
						this.scene_material.setTexture(this.loadedTextures[tex]);
						this.scene_material.setTextureWrap(this.textures[tex].amp_s, this.textures[tex].amp_t);				
					}
					else if(tex == 'clear'){
						this.scene_material.setTexture(null);
					}
					else
					{
						if(previous_texture){
						
							var tex_temp=this.getTextureById(previous_texture.id);
							this.scene_material.setTexture(this.loadedTextures[tex_temp]);
						}
					}
					this.scene_material.apply();
					if(this.textures[tex])
						this.initLoadGraph(node_aux.descendents[i], this.scene_material, this.textures[tex].id);
					else{
						this.initLoadGraph(node_aux.descendents[i], this.scene_material, null);
					}
				this.popMatrix();
			}
		}
		else
		{
			this.pushMatrix();

				var indice=0;

				for(var j=0;j<this.primitives.length;j++)
				{
					if(this.primitives[j].id==node_aux.descendents[0])
						indice=j;
				}
					
					var tex1;
					if(node_aux.texture == 'clear'){
						tex1='clear';
					}
					else{
						tex1=this.getTextureById(node_aux.texture);
					}

					var mat1=this.getMaterialById(node_aux.material);

					if(mat1!='null')
					{
						this.scene_material = this.materials[mat1];
					}
					else{
						
						this.scene_material.setShininess(previous_material.shininess);
						this.scene_material.setSpecular(previous_material.specular[0],previous_material.specular[1],previous_material.specular[2],previous_material.specular[3]);
						this.scene_material.setDiffuse(previous_material.diffuse[0],previous_material.diffuse[1],previous_material.diffuse[2],previous_material.diffuse[3]);
						this.scene_material.setAmbient(previous_material.ambient[0],previous_material.ambient[1],previous_material.ambient[2],previous_material.ambient[3]);
						this.scene_material.setEmission(previous_material.emission[0],previous_material.emission[1],previous_material.emission[2],previous_material.emission[3]);
					}

					if(tex1!='null'&tex1!='clear')
					{
						this.primitives[indice].updateTextCoord(this.textures[tex1].amp_s,this.textures[tex1].amp_t);
						this.scene_material.setTexture(this.loadedTextures[tex1]);
						this.scene_material.setTextureWrap(this.textures[tex1].amp_s, this.textures[tex1].amp_t);				
					}
					else if(tex1 == 'clear'){
						this.scene_material.setTexture(null);
					}
					else
					{
						if(previous_texture){
							var tex_temp=this.getTextureById(previous_texture);
							this.primitives[indice].updateTextCoord(this.textures[tex_temp].amp_s,this.textures[tex_temp].amp_t);
							this.scene_material.setTexture(this.loadedTextures[tex_temp]);
							this.scene_material.setTextureWrap(this.textures[tex_temp].amp_s, this.textures[tex_temp].amp_t);
						}
					}


					this.scene_material.apply();
					
				this.multMatrix(node_aux.matrix);

				this.primitives[indice].display();
				
			this.popMatrix();
		}
	}
}
//Função que retorna, se existir, o indice do array this.textures onde está localizada a textura com o identificador id. Se não existir
//return 'null'
XMLscene.prototype.getTextureById=function(id)
{
	for(var i=0;i<this.textures.length;i++)
	{
		if(id==this.textures[i].id)
		{
			return i;
		}
	}
	return 'null';
}
//Função que retorna, se existir, o indice do array this.materials onde está localizada o material com o identificador id. Se não existir
//return 'null'
XMLscene.prototype.getMaterialById=function(id)
{
	for(var i=0;i<this.materials.length;i++)
	{
		if(id==this.materials[i].id)
		{
			return i;
		}
	}
	return 'null';
}
XMLscene.prototype.turn_on_off = function(id, on_off) 
{
    
    for (var i = 0; i < this.lights.length; i++) 
    {
        if (id == this.lights[i].id) 
        {
            if(on_off)
            {
           		this.lights[i].enable();
            } 
            else 
            {
            	this.lights[i].disable();
            }
            break;
        }
    }
}