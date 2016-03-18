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


FOUR.TransformNode.prototype = Object.create( FOUR.VisualNode.prototype );
FOUR.TransformNode.prototype.constructor = FOUR.TransformNode;


FOUR.TransformNode.prototype.processor = function( data ){
  var D = data.dimension;
  var w = this.matrix.width;
  var h = this.matrix.height;
  var homogeneous = false;
  
  if( w === D ){
    var E = h;
  }else if( w === D+1 ){
    var E = h-1;
    homogeneous = true;
  }else{
    throw new TypeError("Width of the matrix must be D or D+1");
  }
  
  var v1 = new FOUR.Vector( w );
  var v2 = new FOUR.Vector( h );
  var v1e = v1.elements;
  var v2e = v2.elements;
  
  var source = data.faces[0];
  var l = source.length/D;
  var destination = new Float64Array( l*E );
  
  for(var i=0; i<l; i++){
    for(var j=0; j<D; j++){
      v1e[j] = source[i*D+j];
    }
    if(homogeneous) v1e[D] = 1;
    FOUR.Matrix.multiply(this.matrix, v1, v2);
    for(var j=0; j<E; j++){
      if(homogeneous){
        destination[i*E+j] = v2e[j] / v2e[E];
      }else{
        destination[i*E+j] = v2e[j];
      }
    }
  }
  
  data.dimension = E;
  data.faces[0] = destination;
};

})(this);