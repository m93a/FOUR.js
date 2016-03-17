(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * @constructor
 */

FOUR.Object = function constructor(){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
}

FOUR.Object.prototype.scene     = null;
FOUR.Object.prototype.matrix    = null;
FOUR.Object.prototype.position  = null;
FOUR.Object.prototype.rotation  = null;
FOUR.Object.prototype.scale     = null;
FOUR.Object.prototype.dimension =    0;
FOUR.Object.prototype.needsUpdate = false;

FOUR.Object.prototype.updateMatrix = function updateMatrix(){
  if( !this.scene ) throw new Error("Matrix can only be updated when the object is in a scene.");
  this.matrix.compose(
    this.position,
    this.rotation,
    this.scale
  );
  this.needsUpdate = false;
};



})(this);