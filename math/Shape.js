(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * Flat array of vertices. The nth coordinate of the mth vector has this index: `m*dimension + n`.
 * @name Shape#0
 * @type {number[]}
 */

/**
 * An n-dimensional shape
 * @constructor
 * 
 * @prop {number}        dimension - Dimension of the geometric object
 * @prop {number}        length    - Number of different types of n-faces of the geometric object – ie. dimension + 1
 * @prop {Float64Array}  0         - Flat array of vertices
 * @prop {...number[][]} 1..length - 2D arrays of n-faces. Informally Array.< Face.< Integer = index of vertex > >.
 */

FOUR.Shape = function(){
  this.dimension = 0;
  this[0] = new Float64Array(0);
};

Object.defineProperty(FOUR.Shape, "length", {
  configurable: true,
  enumerable: true,
  get: function(){ return this.dimension+1 }
});


/**
 * Extend the shape by one dimension creating a hyperprism of height 1.
 * The original shape is now the base of the prism.
 */

FOUR.Shape.prototype.extrude = function extrude(height){
  height = +height/2 || .5;
  var t = this;
  var D = t.dimension;
  
  if( D === 0 ){
    t[0] = new Float64Array(2);
    t[0][0] = -height;
    t[0][1] =  height;
    t[1] = [[0,1]];
    
  }else{
    
    var base = t[0];
    var baseVertices = base.length/D;
    D++;
    
    //The new polytope has twice as many vertices (two bases)
    var prism = new Float64Array( 2 * baseVertices * D );
    
    for( var i = 0, l = prism.length/2; i < l; i++ ){
      if( (i+1) % D ){
        prism[i  ] =
        prism[i+l] = base[i - (i/D|0)];
      }else{
        prism[i  ] = -height;
        prism[i+l] =  height;
      }
    }
    
    t[0] = prism;
    var sides = t[1];
    var offset = prism.length/D/2;
    for( var f = 1; f < D; f++ ){
      
      var tf = t[f];
      
      var ridges = f === 1 ? offset : facets;
      var facets = t[f].length;
      
      for( var i = 0, l = tf.length; i < l; i++ ){
        tf[i+l] = [];
        for( var j = 0; j < tf[i].length; j++ ){
          tf[i+l][j] = tf[i][j] + offset;
        }
      }
      
      for( var i = 0, l = ridges; i < l; i++ ){
        if(f === 1){
          tf.push([ i, i+l ]);
        }else{
          tf.push([].concat( t[f-1][i], Array.from(t[f-1][i+l]).reverse() )); //TODO make clearer
        }
      }
    }
    
    tf = (t[f]=[[]]) [0];
    for( var i = 0, l = 2*offset; i < l; i++ ){
      if(i<offset) tf.push(i);
      else         tf.push(3*offset-1-i);
    }
  
  }
  
  t.dimension++;
  return t;
}

})(this);