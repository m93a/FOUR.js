(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);


// Helper functions

// fast square
function sq(a){ a = +a; return +(a*a); }

// creates an array of length l filled with x
function filler(l,x){
  var arr = [];
  while(--l >= 0){
    arr.push(x);
  }
  return arr;
}


/**
 * Empty vector of dimension D
 * @name FOUR.Vector^2
 * @constructor
 * @param {number} D
 */

/**
 * Vector represented by a column matrix
 * @constructor
 * @param {...number} more than one number of vector components
 *
 * @prop {number} width Always 1 hence it's a column vector
 */

FOUR.Vector = function constructor( D ){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  if(arguments.length === 1){
    this.elements = filler(D,0);
  
  }else{
    this.elements = Array.from(arguments);
  }
  
  this.height   = this.elements.length;
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