(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * @constructor
 * @extends FOUR.Object
 * @extends FOUR.VisualNode
 */

FOUR.Camera = function constructor(){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  this.camera = this;
  
  Object.defineProperty(this,"__out",{value:[]});
  
}

FOUR.Camera.prototype = Object.create( FOUR.Object.prototype );
FOUR.Camera.prototype.constructor = FOUR.Camera;

FOUR.Camera.prototype.connect    = FOUR.VisualNode.prototype.connect;
FOUR.Camera.prototype.disconnect = FOUR.VisualNode.prototype.disconnect;



FOUR.Camera.prototype.update = function update(){
  
  if(!this.scene) return;
  
  var lengths = [];
  for(shape of this.scene.__set){
    
  }
  
};


})(this);