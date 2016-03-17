(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * Applies a transformation matrix to all vertices
 */

FOUR.TransformNode = function constructor(matrix){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  FOUR.VisualNode.call(this);
  this.matrix = matrix;
  
};


FOUR.LogNode.prototype = Object.create( FOUR.VisualNode.prototype );
FOUR.LogNode.prototype.constructor = FOUR.LogNode;


FOUR.LogNode.prototype.processor = function( data ){
  var D = data.dimension;
  
  var v1 = new Vector( D+1 );
  var v2 = new Vector( D+1 );
  var v1e = v1.elements;
  var v2e = v2.elements;
  
};

})(this);