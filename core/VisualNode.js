(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
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
  var props = ["processor","destructive","inputDimension",
               "outputDimension","colors"];
  
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
    __out: {writable: true, value:[]},
    __in:  {writable: true, value:0 }
  });
  
}



//node description properties
FOUR.VisualNode.prototype.processor       =  null;
FOUR.VisualNode.prototype.destructive     = false;
FOUR.VisualNode.prototype.inputDimension  =     0;
FOUR.VisualNode.prototype.outputDimension =     0;
FOUR.VisualNode.prototype.colors          =     0;



Object.defineProperty(FOUR.VisualNode.prototype, "__feed", { value: function(food){
  
  if(food.fragile && this.destructive){
    //TODO clone
  }
  
}});



FOUR.VisualNode.prototype.connect = function(node){
  if(node instanceof FOUR.VisualNode){
    
    if( this.__out.indexOf(node) !== -1 ) return;
    
    this.__out.push(node);
    node.__in = this;
    
  }else{
    throw new TypeError("Argument 1 has to be an instance of FOUR.VisualNode");
  }
};


FOUR.VisualNode.prototype.disconnect = function(node){
  if(node instanceof FOUR.VisualNode){
    
    var index = this.__out.indexOf(node);
    if(index !== -1) this.__out.splice(index,1);
    if(node.__in === this) node.__in=null;
    
  }else{
    throw new TypeError("Argument 1 has to be an instance of FOUR.VisualNode");
  }
}


})(this);