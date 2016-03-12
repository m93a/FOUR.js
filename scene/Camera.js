(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * @constructor
 */

FOUR.Camera = function constructor(){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  this.camera = this;
  
}

FOUR.Camera.prototype.connect    = FOUR.VisualNode.prototype.connect;
FOUR.Camera.prototype.disconnect = FOUR.VisualNode.prototype.disconnect;


})(this);