(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * Tato třída provádí magii
 * Tlačí mě čas :( – až budu mít možnost, dodělám dokumentaci
 * FIXME Pokud něco nefunguje, příčina bude tady
 * @constructor
 */

FOUR.VisualNode = function constructor(){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  
  //node description properties cannot be modified on instances
  var props = ["processor","destructive"];
  
  function forceInheritance(prop){
    return function(){
      return Object.getPrototypeOf(this)[prop];
    };
  }
  
  props.forEach( prop =>
    Object.defineProperty( this, prop, {
      enumerable: true,
      get: forceInheritance(prop)
    })
  );
  
  
  //set up internal properties
  Object.defineProperties(this,{
    __out: {value:[]},
    __in:  {value: 0, writable: true}
  });
  
}



//node description properties
FOUR.VisualNode.prototype.processor       =  null;
FOUR.VisualNode.prototype.destructive     = false;


FOUR.VisualNode.prototype.camera = null;



Object.defineProperty(FOUR.VisualNode.prototype, "__feed", { value: function(food){
  var D = food.dimension;
  if(D !== food.faces.length){ throw InternalError("Assert D === faces.length"); }
  if(typeof this.processer !== "function"){ throw InternalError("Assert this.processor is a function"); }
  
  //clone data before modifying
  if(food.fragile && this.destructive){
    var old = food;
    food = {
      fragile:   false,
      dimension: D,
      faces:     old.faces .clone(),
      colors:    old.colors.clone()
    };
  }
  
  var data = {
    fragile:   false,
    dimension: D,
    faces:     food.faces,
    colors:    food.colors
  };
  
  this.processor(data);
  
  D = food.dimension = data.dimension;
  food.fragile = food.fragile || data.fragile;
  
  while(D>food.faces.length) food.faces.push([]);
  food.faces.length = D;
  
  while(D>food.color.length) food.color.push( new Uint8Clamped(0) );
  food.color.length = D;
  
  this.__out[0].__feed(food);
  for(var i = 1; i < this.__out.length; i++){
    this.__out[i].__feed({
      fragile:   false,
      dimension: D,
      faces:     old.faces .clone(),
      colors:    old.colors.clone()
    });
  }
  
}});



FOUR.VisualNode.prototype.connect = function(node){
  if(node instanceof FOUR.VisualNode){
    
    if( this.__out.indexOf(node) !== -1 ) return;
    
    this.__out.push(node);
    node.__in = this;
    
    node.camera = this.camera;
    
  }else{
    throw new TypeError("Argument 1 has to be an instance of FOUR.VisualNode");
  }
};


FOUR.VisualNode.prototype.disconnect = function(node){
  if(node instanceof FOUR.VisualNode){
    
    var index = this.__out.indexOf(node);
    if(index !== -1) this.__out.splice(index,1);
    if(node.__in === this){
      node.__in=null;
      node.camera=null;
    }
    
  }else{
    throw new TypeError("Argument 1 has to be an instance of FOUR.VisualNode");
  }
}


})(this);