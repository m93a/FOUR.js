(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);


FOUR.ColorNode = function constructor(callback){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  FOUR.VisualNode.call(this);
  this.callback = callback;
  
};


FOUR.ColorNode.prototype = Object.create( FOUR.VisualNode.prototype );
FOUR.ColorNode.prototype.constructor = FOUR.ColorNode;


FOUR.ColorNode.prototype.processor = function( data ){
  var D = data.dimension;
  
  var v = new FOUR.Vector( D );
  var c = new Uint8ClampedArray( 4 );
  var e = v.elements;
  
  var vertices = data.faces[0];
  var colors   = data.colors;
  var l = vertices.length/D;
  
  for(var i=0; i<l; i++){
    for(var j=0; j<D; j++){
      e[j] = vertices[i*D+j];
    }
    for(var j=0; j<4; j++){
      c[j] = colors[i*4+j];
    }
    
    this.callback(v,c);
    
    for(var j=0; j<4; j++){
      colors[i*4+j] = c[j];
    }
  }
};

})(this);