function MyCylinder(scene, args)
{
    CGFobject.call(this,scene);
    this.top=new MyCircle(scene,args[3],args[2]);
    this.top.initBuffers();
    this.bottom=new MyCircle(scene,args[3],args[1]);
    this.bottom.initBuffers();
    this.prism=new MyOpenCylinder(scene,args);
    this.prism.initBuffers();
    this.height=args[0];
    
}

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.display=function()
{
   this.prism.display();
   this.scene.pushMatrix();
        this.scene.translate(0,0,this.height);
        this.top.display();
   this.scene.popMatrix();
   this.scene.pushMatrix();
        this.scene.rotate(180*(Math.PI / 180.0),0,1,0);
        this.bottom.display();
   this.scene.popMatrix();
}
 MyCylinder.prototype.updateTextCoord=function(ampS,ampT)
 {
 	
 }