(function(global){ "use strict";

var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * @constructor
 */

FOUR.Scene = function constructor(D){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  this.__set = new Set;
  this.dimension = D;
}


FOUR.Scene.prototype.add = function add( obj ){
  if( obj instanceof FOUR.Object ){
    if( this.dimension < obj.dimension ){
      throw new TypeError("Cannot add a "+obj.dimension+"-dimensional object into a "+this.dimension+"-dimensional scene.");
    }
    if( obj.scene !== null ){
      obj.scene.remove( obj );
    }
    this.__set.add( obj );
    obj.scene = this;
    obj.transform = new Matrix( this.dimension+1 );
  }else{
    throw new TypeError("Only instances of FOUR.Object can be added to the scene.");
  }
}


FOUR.Scene.prototype.rm =
FOUR.Scene.prototype.remove = function remove( obj ){
  if( obj instanceof FOUR.Object &&
      obj.scene === this            ){
    
    this.__set.delete( obj );
    obj.scene = null;
    obj.transform = null;
    
  }
}


})(this);