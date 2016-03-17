(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

FOUR.LogNode = function constructor(){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  FOUR.VisualNode.call(this);
  
  
};


FOUR.LogNode.prototype = Object.create( FOUR.VisualNode.prototype );
FOUR.LogNode.prototype.constructor = FOUR.LogNode;


FOUR.LogNode.prototype.processor = function( data ){
  console.log(data);
};

})(this);