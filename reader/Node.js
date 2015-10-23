//Construtor para objetos do tipo Node
function Node(id)
{
    this.id=id
    this.material=null;
    this.texture=null;
    this.matrix=mat4.create(); //MATRIZ DAS TRANFORMAÇÕES GEOMÉTRICAS
    this.descendents=[];
};
//Adiciona descendente nodename ao this.descendents
Node.prototype.push=function (nodename)
{
    this.descendents.push(nodename);
};
//Altera a this.matrix para a matriz matrix
Node.prototype.setMatrix=function(matrix)
{
    this.matrix=mat4.clone(matrix);
};
//Altera o this.texture para a textura texture
Node.prototype.setTexture=function(texture)
{
    this.texture=texture;  
};
//Altera o this.material para o material material
Node.prototype.setMaterial=function(material)
{
    this.material=material;  
};