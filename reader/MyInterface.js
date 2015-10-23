function MyInterface() 
{
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) 
{
	CGFinterface.prototype.init.call(this, application);
	application.interface = this;
	this.gui = new dat.GUI();
	return true;
};

MyInterface.prototype.setScene = function(scene) 
{
    this.scene = scene;
    scene.interface = this;
};

MyInterface.prototype.change_lights = function() 
{
    var luzes=this.gui.addFolder("Luzes");
	luzes.open();
	var scene=this;
    for (actual_light in this.scene.lights_ids) 
    {
        
        luzes.add(this.scene.lights_ids,actual_light).onChange(function(value) 
        {
             scene.scene.turn_on_off(this.property, value);
        });
    }
};