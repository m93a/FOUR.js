(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * Applies a transformation matrix to all vertices
 */

FOUR.ForEachVertexNode = function constructor(callback){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  FOUR.VisualNode.call(this);
  this.callback = callback;
  
};


FOUR.ForEachVertexNode.prototype = Object.create( FOUR.VisualNode.prototype );
FOUR.ForEachVertexNode.prototype.constructor = FOUR.ForEachVertexNode;


FOUR.ForEachVertexNode.prototype.processor = function( data ){
  var D = data.dimension;
  
  var v = new FOUR.Vector( D );
  var ve = v.elements;
  
  var source = data.faces[0];
  var l = source.length/D;
  var destination = new Float64Array( l*D );
  
  for(var i=0; i<l; i++){
    for(var j=0; j<D; j++){
      ve[j] = source[i*D+j];
    }
    
    this.callback(v);
    
    for(var j=0; j<D; j++){
      destination[i*D+j] = ve[j];
    }
  }
  
  data.faces[0] = destination;
};

})(this);