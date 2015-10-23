
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
	this.light=[];
	this.filename = 'scenes/'+filename;
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	// Here should go the calls for different functions to parse the various blocks
	//PARSE INITIALS
	var error = this.parseInitials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	//PARSE ILUMINATION
	var error = this.parseIlumination(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	//PARSE LIGHT
	var error = this.parseLight(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	//PARSE TEXTURES
	var error=this.parseTexture(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	//PARSE MATERIALS
	var error=this.parseMaterial(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	//PARSE LEAVES
	var error=this.parseLeaves(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	//PARSE NODES
	var error=this.parseNodes(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};
//Lê do ficherio .lsx o bloco INITIALS
MySceneGraph.prototype.parseInitials= function(rootElement) 
{
	var init=rootElement.getElementsByTagName('INITIALS');
	if(init==null)
	{
		return "<INITIALS> element is missing.";
	}
	if(init.length!=1)
	{
		return "Either zero or more than one <INITIALS> element found.";
	}
	var initials=init[0];
	//FRUSTUM
	var init=initials.getElementsByTagName('frustum');
	if(init==null)
	{
		return "<frustum> element is missing.";
	}
	if(init.length!=1)
	{
		return "Either zero or more than one <frustum> element found.";
	}
	var frus=init[0];
	this.frustum=[];
	this.frustum['near']=this.reader.getFloat(frus,'near',true);
	this.frustum['far']=this.reader.getFloat(frus,'far',true);
	//FRUSTUM TEST
	console.log("Frustum: ");
	console.log("near = "+this.frustum['near']);
	console.log("far = "+this.frustum['far']);
	//TRANSLATE
	var init=initials.getElementsByTagName('translation');
	if(init==null)
	{
		return "<translation > element is missing.";
	}
	if(init.length!=1)
	{
		return "Either zero or more than one <translation> element found.";
	}
	var trans=init[0];
	this.translate=['x','y','z'];
	this.translate[0]=this.reader.getFloat(trans,'x',true);
	this.translate[1]=this.reader.getFloat(trans,'y',true);
	this.translate[2]=this.reader.getFloat(trans,'z',true);
	//TRANSLATE TEST
	console.log("Translate: ");
	console.log("x = "+this.translate[0]);
	console.log("y = "+this.translate[1]);
	console.log("z = "+this.translate[2]);
	//ROTATION
	var init=initials.getElementsByTagName('rotation');
	if(init==null)
	{
		return "<rotation> element is missing.";
	}
	if(init.length!=3)
	{
		return "Either zero or more than one <rotation> element found.";
	}
	this.rotation=[[],[],[]];
	for(var i=0;i<3;i++)
	{
		var rot=init[i];
		this.rotation[i]['axis']=this.reader.getItem(rot,'axis',['x','y','z']);
		this.rotation[i]['angle']=this.reader.getFloat(rot,'angle',true);
		//ROTATION TEST
		console.log("Rotation: ");
		console.log("axis = "+this.rotation[i]['axis']);
		console.log("angle = "+this.rotation[i]['angle']);
	}	
	//SCALE
	var init=initials.getElementsByTagName('scale');
	if(init==null)
	{
		return "<scale> element is missing.";
	}
	if(init.length!=1)
	{
		return "Either zero or more than one <scale> element found.";
	}
	var sca=init[0];
	this.scale=['sx','sy','sz'];
	this.scale[0]=this.reader.getFloat(sca,'sx',true);
	this.scale[1]=this.reader.getFloat(sca,'sy',true);
	this.scale[2]=this.reader.getFloat(sca,'sz',true);
	//SCALE TEST
	console.log("Scale: ");
	console.log("sx = "+this.scale[0]);
	console.log("sy = "+this.scale[1]);
	console.log("sz = "+this.scale[2]);
	//REFERENCE
	var init=initials.getElementsByTagName('reference');
	if(init==null)
	{
		return "<reference> element is missing.";
	}
	if(init.length!=1)
	{
		return "Either zero or more than one <reference> element found.";
	}
	var ref=init[0];
	this.reference=this.reader.getFloat(ref,'length',true);
	console.log("Reference: ");
	console.log("length = "+this.reference);
};	
//Lê do ficherio .lsx o bloco ILLUMINATION
MySceneGraph.prototype.parseIlumination= function(rootElement) 
{
	var ilu=rootElement.getElementsByTagName('ILLUMINATION');
	if(ilu==null)
	{
		return "ILLUMINATION is missing";
	}
	if(ilu.length!=1)
	{
		return "Either zero or more than one <ILLUMINATION> element found.";
	}
	var ilumination=ilu[0];
	//AMBIENT
	var amb=ilumination.getElementsByTagName('ambient');
	if(amb==null)
	{
		return "<ambient> is missing";
	}
	if(amb.length!=1)
	{
		return "Either zero or more than one <ambient> element found.";
	}
	var ambient=amb[0];
	this.ambient=["r","g","b","a"];
	this.ambient[0]=this.reader.getFloat(ambient,"r",true);
	this.ambient[1]=this.reader.getFloat(ambient,"g",true);
	this.ambient[2]=this.reader.getFloat(ambient,"b",true);
	this.ambient[3]=this.reader.getFloat(ambient,"a",true);
	//AMBIENT TEST
	console.log("Ilumination: ");
	console.log("Ambient: ");
	console.log("r = "+this.ambient[0]);
	console.log("g = "+this.ambient[1]);
	console.log("b = "+this.ambient[2]);
	console.log("a = "+this.ambient[3]);
	//BACKGROUND
	var back=ilumination.getElementsByTagName('background');
	if(back==null)
	{
		return "<background> is missing";
	}
	if(back.length!=1)
	{
		return "Either zero or more than one <background> element found.";
	}
	var background=back[0];
	this.background=["r","g","b","a"];
	this.background[0]=this.reader.getFloat(background,"r",true);
	this.background[1]=this.reader.getFloat(background,"g",true);
	this.background[2]=this.reader.getFloat(background,"b",true);
	this.background[3]=this.reader.getFloat(background,"a",true);
	//AMBIENT TEST
	console.log("Background: ");
	console.log("r = "+this.background[0]);
	console.log("g = "+this.background[1]);
	console.log("b = "+this.background[2]);
	console.log("a = "+this.background[3]);
};
//Lê do ficherio .lsx o bloco LIGHTS
MySceneGraph.prototype.parseLight= function(rootElement)
{
	//TAG LIGHTS
	var lights=rootElement.getElementsByTagName('LIGHTS');
	if(lights==null)
	{
		return "LIGHTS is missing";
	}
	if(lights.length!=1)
	{
		return "Either zero or more than one <LIGHTS> element found.";
	}
	var tag_lights=lights[0];
	//TAG LIGHT
	var light=tag_lights.getElementsByTagName('LIGHT');
	if(light==null)
	{
		return "LIGHT is missing";
	}
	if(light.length<1)
	{
		return "Either zero or more than one <LIGHT> element found.";
	}
	//SAVE EACH LIGHT OF LIGHTS LIST
	//this.light=[];
	for(var i=0;i<light.length;i++)
	{
		var lig=light[i];
		var current_light=["id","enable","position","ambient","diffuse","specular"];
		current_light[2]=["x","y","z","w"];
		current_light[3]=["r","g","b","a"];
		current_light[4]=["r","g","b","a"];
		current_light[5]=["r","g","b","a"];
		//IDS
		current_light[0]=this.reader.getString(lig,'id',true);
		//ENABLE
		var ena=lig.getElementsByTagName('enable');
		var enable=ena[0];
		current_light[1]=this.reader.getBoolean(enable,'value',true);
		//POSITION
		var pos=lig.getElementsByTagName('position');
		var position=pos[0];
		current_light[2][0]=this.reader.getFloat(position,'x',true);
		current_light[2][1]=this.reader.getFloat(position,'y',true);
		current_light[2][2]=this.reader.getFloat(position,'z',true);
		current_light[2][3]=this.reader.getFloat(position,'w',true);
		//AMBIENT
		var amb=lig.getElementsByTagName('ambient');
		var ambient=amb[0];
		current_light[3][0]=this.reader.getFloat(ambient,'r',true);
		current_light[3][1]=this.reader.getFloat(ambient,'g',true);
		current_light[3][2]=this.reader.getFloat(ambient,'b',true);
		current_light[3][3]=this.reader.getFloat(ambient,'a',true);
		//DIFFUSE
		var dif=lig.getElementsByTagName('diffuse');
		var diffuse=dif[0];
		current_light[4][0]=this.reader.getFloat(diffuse,'r',true);
		current_light[4][1]=this.reader.getFloat(diffuse,'g',true);
		current_light[4][2]=this.reader.getFloat(diffuse,'b',true);
		current_light[4][3]=this.reader.getFloat(diffuse,'a',true);
		//SPECULAR
		var spec=lig.getElementsByTagName('specular');
		var specular=spec[0];
		current_light[5][0]=this.reader.getFloat(specular,'r',true);
		current_light[5][1]=this.reader.getFloat(specular,'g',true);
		current_light[5][2]=this.reader.getFloat(specular,'b',true);
		current_light[5][3]=this.reader.getFloat(specular,'a',true);
		//ADD TO ARRAY
		this.light[i]=current_light;
	}
	///////////////////////////////////////////
	//             TESTAR                    //
	///////////////////////////////////////////
};
//Lê do ficherio .lsx o bloco TEXTURES
MySceneGraph.prototype.parseTexture= function(rootElement)
{
	var textures=rootElement.getElementsByTagName('TEXTURES');
	if(textures==null)
	{
		return "TEXTURES is missing";
	}
	if(textures.length!=1)
	{
		return "Either zero or more than one <TEXTURES> element found.";
	}
	var tag_textures=textures[0];
	var texture=tag_textures.getElementsByTagName('TEXTURE');
	if(texture==null)
	{
		return "TEXTURE is missing";
	}
	if(texture.length<1)
	{
		return "Either zero or more than one <TEXTURE> element found.";
	}
	var path=this.filename.substring(0, this.filename.lastIndexOf("/"));
	this.texture=[];
	for(var i=0;i<texture.length;i++)
	{
		var tex=texture[i];
		var current_texture=["id","file","amplif_factor"];
		current_texture[2]=['s','t'];
		//ID
		current_texture[0]=this.reader.getString(tex,'id',true);
		//FILE PATH
		var fil=tex.getElementsByTagName('file');
		var file=fil[0];
		var path_to=path + '/' + this.reader.getString(file,'path',true);
		current_texture[1]=path_to;
		//AMPLIF_FACTOR
		var amp=tex.getElementsByTagName('amplif_factor');
		var amplif_factor=amp[0];
		current_texture[2][0]=this.reader.getFloat(amplif_factor,'s',true);
		current_texture[2][1]=this.reader.getFloat(amplif_factor,'t',true);
		this.texture[i]=current_texture;
	}
	//TEST
	console.log("Textures: ");
	for(var i=0;i<this.texture.length;i++)
	{
		console.log("Id = "+this.texture[i][0]);
		console.log("Path = "+this.texture[i][1]);
		console.log("s = "+this.texture[i][2][0]);
		console.log("t = "+this.texture[i][2][1]);
	}
};
//Lê do ficherio .lsx o bloco MATERIALS
MySceneGraph.prototype.parseMaterial= function(rootElement)
{
	//TAG MATERIALS
	var materials=rootElement.getElementsByTagName('MATERIALS');
	if(materials==null)
	{
		return "MATERIALS is missing";
	}
	if(materials.length!=1)
	{
		return "Either zero or more than one <MATERIALS> element found.";
	}
	var tag_materials=materials[0];
	//TAG MATERIAL
	var material=tag_materials.getElementsByTagName('MATERIAL');
	if(material==null)
	{
		return "MATERIAL is missing";
	}
	if(material.length<1)
	{
		return "Either zero or more than one <MATERIAL> element found.";
	}
	//SAVE EACH MATERIAL
	this.material=[];
	for(var i=0;i<material.length;i++)
	{
		var mat=material[i];
		var current_material=["id","shininess","specular","diffuse","ambient","emission"];
		current_material[2]=["r","g","b","a"];
		current_material[3]=["r","g","b","a"];
		current_material[4]=["r","g","b","a"];
		current_material[5]=["r","g","b","a"];
		//IDS
		current_material[0]=this.reader.getString(mat,'id',true);
		//SHININESS
		var shi=mat.getElementsByTagName('shininess');
		var shininess=shi[0];
		current_material[1]=this.reader.getFloat(shininess,'value',true);
		//SPECULAR
		var spe=mat.getElementsByTagName('specular');
		var specular=spe[0];
		current_material[2][0]=this.reader.getFloat(specular,'r',true);
		current_material[2][1]=this.reader.getFloat(specular,'g',true);
		current_material[2][2]=this.reader.getFloat(specular,'b',true);
		current_material[2][3]=this.reader.getFloat(specular,'a',true);
		//DIFFUSE
		var dif=mat.getElementsByTagName('diffuse');
		var diffuse=dif[0];
		current_material[3][0]=this.reader.getFloat(diffuse,'r',true);
		current_material[3][1]=this.reader.getFloat(diffuse,'g',true);
		current_material[3][2]=this.reader.getFloat(diffuse,'b',true);
		current_material[3][3]=this.reader.getFloat(diffuse,'a',true);
		//AMBIENT
		var amb=mat.getElementsByTagName('ambient');
		var ambient=amb[0];
		current_material[4][0]=this.reader.getFloat(ambient,'r',true);
		current_material[4][1]=this.reader.getFloat(ambient,'g',true);
		current_material[4][2]=this.reader.getFloat(ambient,'b',true);
		current_material[4][3]=this.reader.getFloat(ambient,'a',true);
		//EMISSION
		var emi=mat.getElementsByTagName('emission');
		var emission=emi[0];
		current_material[5][0]=this.reader.getFloat(emission,'r',true);
		current_material[5][1]=this.reader.getFloat(emission,'g',true);
		current_material[5][2]=this.reader.getFloat(emission,'b',true);
		current_material[5][3]=this.reader.getFloat(emission,'a',true);
		//ADD TO ARRAY
		this.material[i]=current_material;
	}
	for (var i=0;i<this.material.length;i++)
	{
		console.log("Materials: ");
		console.log("ID = "+this.material[i][0]);
		console.log("Shininess = "+this.material[i][1]);
		console.log("Specular = "+this.material[i][2]);
		console.log("Diffuse = "+this.material[i][3]);
		console.log("Ambient = "+this.material[i][4]);
		console.log("Emission = "+this.material[i][5]);
	}
};
//Lê do ficherio .lsx o bloco LEAVES
MySceneGraph.prototype.parseLeaves= function(rootElement)
{
	//TAG LEAVES
	var leaves=rootElement.getElementsByTagName('LEAVES');
	if(leaves==null)
	{
		return "LEAVES is missing";
	}
	if(leaves.length!=1)
	{
		return "Either zero or more than one <LEAVES> element found.";
	}
	var tag_leaves=leaves[0];
	//TAG LEAF
	var leaf=tag_leaves.getElementsByTagName('LEAF');
	if(leaf==null)
	{
		return "LEAF is missing";
	}
	if(leaf.length<1)
	{
		return "Either zero or more than one <LEAF> element found.";
	}
	this.leaves=[];
	for(var i=0; i<leaf.length;i++)
	{
		var lea=leaf[i];
		var current_leaf=["id","type","args"];
		current_leaf[2]=[];
		//ID
		current_leaf[0]=this.reader.getString(lea,'id',true);
		//LEAF TYPE
		var type=this.reader.getString(lea,'type',true);
		current_leaf[1]=type;
		//ARGS
		var agrs_aux=this.reader.getString(lea,'args',true);
		var args=agrs_aux.split(" ");
		switch(type)
		{
			//RECTANGLE
			case 'rectangle':
				current_leaf[2]['x1']=parseFloat(args[0]);
				current_leaf[2]['y1']=parseFloat(args[1]);
				current_leaf[2]['x2']=parseFloat(args[2]);
				current_leaf[2]['y2']=parseFloat(args[3]);
				break;
			//CYLINDER
			case 'cylinder':
				current_leaf[2]['height']=parseFloat(args[0]);
				current_leaf[2]['bottom_radius']=parseFloat(args[1]);
				current_leaf[2]['top_radius']=parseFloat(args[2]);
				current_leaf[2]['sections_along_heigth']=parseInt(args[3]);
				current_leaf[2]['parts_per_section']=parseInt([4]);
				break;
			//SPHERE
			case 'sphere':
				current_leaf[2]['radius']=parseFloat(args[0]);
				current_leaf[2]['parts_along_radius']=parseInt(args[1]);
				current_leaf[2]['parts_per_section']=parseInt(args[2]);
				break;
			//TRIANGLE
			case 'triangle':
				current_leaf[2]['x1'] = parseFloat(args[0]);
				current_leaf[2]['y1'] = parseFloat(args[1]);
				current_leaf[2]['z1'] = parseFloat(args[2]);
				current_leaf[2]['x2'] = parseFloat(args[4]);
				current_leaf[2]['y2'] = parseFloat(args[5]);
				current_leaf[2]['z2'] = parseFloat(args[6]);
				current_leaf[2]['x3'] = parseFloat(args[8]);
				current_leaf[2]['y3'] = parseFloat(args[9]);
				current_leaf[2]['z3'] = parseFloat(args[10]);
				break;
			default:
				return "Invalid Type."
		}
		this.leaves[i]=current_leaf;
	}
	//LEVEAS TEST
	for(var i=0; i<this.leaves.length; i++) 
	{
		console.log("ID = "+this.leaves[i][0]);
		console.log("Type = "+this.leaves[i][1]);
		console.log("Args = ");console.log(this.leaves[i][2]);
	}
};
//Lê do ficherio .lsx o bloco NODES
MySceneGraph.prototype.parseNodes= function(rootElement)
{
	//TAG NODES
	var nodes=rootElement.getElementsByTagName('NODES');
	if(nodes==null)
	{
		return "NODES is missing";
	}
	if(nodes.length!=1)
	{
		return "Either zero or more than one <NODES> element found.";
	}
	//TAG ROOT
	var aux=nodes[0]
	var root=aux.getElementsByTagName('ROOT');
	if(root==null)
	{
		return "ROOT is missing";
	}
	if(root.length<1)
	{
		return "Either zero or more than one <ROOT> element found.";
	}
	this.root=this.reader.getString(root[0],'id',true);
	//TAG NODE
	var node=aux.getElementsByTagName('NODE');
	if(node==null)
	{
		return "NODE is missing";
	}
	if(node.length<1)
	{
		return "Either zero or more than one <NODE> element found.";
	}
	this.nodes=[];
	for(var i=0;i<node.length;i++)
	{
		var no=node[i];
		//ID
		var aux_id=this.reader.getString(no,'id',true);
		var new_node=new Node(aux_id);
		//MATERIAL
		var mat=no.getElementsByTagName('MATERIAL');
		if(mat==null)
		{
			return "MATERIAL is missing";
		}
		if(mat.length<1)
		{
			return "Either zero or more than one <MATERIAL> element found.";
		}
		var mat_id=this.reader.getString(mat[0],'id',true);
		if(mat_id=="null")
			new_node.material=null;
		else
		{
			var boolean_found=false;
			for(var j=0;j<this.material.length;j++)
			{
				if(mat_id==this.material[j][0])
				{
					new_node.material=mat_id;
					boolean_found=true;
				}
			}
		}
		if(boolean_found==false)
		{
			return "The material don´t exist!";
		}
		//TEXTURE
		var tex=no.getElementsByTagName('TEXTURE');
		if(tex==null)
		{
			return "TEXTURE is missing";
		}
		if(tex.length<1)
		{
			return "Either zero or more than one <TEXTURE> element found.";
		}
		var tex_id=this.reader.getString(tex[0],'id',true);
		if(tex_id=="null")
			new_node.texture=null;
		else if(tex_id=="clear")
			new_node.texture="clear";
		else
		{
			var boolean_found_texture=0;
			for(var k=0;k<this.texture.length;k++)
			{
				if(tex_id==this.texture[k][0]);
				{
					new_node.texture=tex_id;
					boolean_found_texture=1;
				}
			}
		}
		if(boolean_found_texture==0)
		{
			return "The Texture don't exist";
		}
		//TRANSFORMATIONS
		var child=no.children;
		var matrix=mat4.create();
		mat4.identity(matrix);
		for(var t=0;t<child.length;t++)
		{
			
			switch(child[t].tagName)
			{
				case "TRANSLATION":
					var tra=['x','y','z'];
					tra[0]=this.reader.getFloat(child[t],'x',true);
					tra[1]=this.reader.getFloat(child[t],'y',true);
					tra[2]=this.reader.getFloat(child[t],'z',true);
					mat4.translate(matrix,matrix,tra);
					break;
				case "ROTATION":
					var rot1=['axis','angle'];
					rot1[0]=this.reader.getString(child[t],'axis',true);
					rot1[1]=this.reader.getFloat(child[t],'angle',true)*(Math.PI / 180.0);
					var axis=[];
					if(rot1[0]=='x')
						axis=[1,0,0];
					else if(rot1[0]=='y')
						axis=[0,1,0];
					else if(rot1[0]=='z')
						axis[0,0,1];
					mat4.rotate(matrix,matrix,rot1[1],axis);
					break;
				case "SCALE":
					var scal=['sx','sy','sz'];
					scal[0]=this.reader.getFloat(child[t],'sx',true);
					scal[1]=this.reader.getFloat(child[t],'sy',true);
					scal[2]=this.reader.getFloat(child[t],'sz',true);
					mat4.scale(matrix,matrix,scal);
					break;
			}
		}
		new_node.setMatrix(matrix);
		//DESCENDENTES
		var descendents=no.getElementsByTagName('DESCENDANTS');
		if(descendents==null)
		{
			return "DESCENDANTS is missing";
		}
		if(descendents.length<1)
		{
			return "Either zero or more than one <DESCENDANTS> element found.";
		}
		var aux_desc=descendents[0];
		var descendent=aux_desc.getElementsByTagName('DESCENDANT')
		if(descendent==null)
		{
			return "DESCENDANT is missing";
		}
		if(descendent.length<1)
		{
			return "Either zero or more than one <DESCENDANT> element found.";
		}
		for(var r=0;r<descendent.length;r++)
		{
			new_node.push(this.reader.getString(descendent[r],'id',true))
		}
		this.nodes[i]=new_node;
	}
	for(var i=0; i<this.nodes.length; i++) 
	{
		console.log(this.nodes[i].id);
		console.log(this.nodes[i].material);
		console.log(this.nodes[i].texture);
		console.log(this.nodes[i].matrix);
		console.log(this.nodes[i].descendents);
	}
}
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


