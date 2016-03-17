(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);


// Helper functions

// fast square
function sq(a){ a = +a; return +(a*a); }



/**
 * Vector represented by a column matrix
 * @constructor
 * @param {...number} any number of vector components
 *
 * @prop {number} width Always 1 hence it's a column vector
 */

FOUR.Vector = function constructor(){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  this.height   = arguments.length;
  this.elements = Array.from(arguments);
};

FOUR.Vector.prototype = Object.create(FOUR.Matrix.prototype);

Object.defineProperty( FOUR.Vector.prototype, "width",{
  configurable: true,
  enumerable:   true,
  writabe:     false,
  value:           1
});


/**
 * Returns the norm (i.e. magnitude) of the vector.
 * Note it differs from the inherited `length` property which
 * returns the dimension of the vector!
 */

FOUR.Vector.prototype.norm = function(){
  
  var sum = 0,
      i = -1;
  
  while(++i < this.height){
    sum += sq(this.elements[i]);
  }
  
  return Math.sqrt(sum);

};


/**
 * Returns the normalised vector – with the same direction as the original
 * but with the magnitude of one: û = u⃗ / ||u⃗||
 */

FOUR.Vector.prototype.unit = function(){
  
  
  
};


})(this);