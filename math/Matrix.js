(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);


// Helper functions

// performs mathematically correct modulo operation
function mod(n,m){
  n = n%m;
  if(n<0) n+=m;
  return n;
}

// creates an array of length l filled with x
function filler(l,x){
  var arr = [];
  while(--l >= 0){
    arr.push(x);
  }
  return arr;
}



/**
 * Matrix of any dimesions
 * @name Matrix^2
 * @constructor
 * @param {number[][]} list two-dimensional array of numbers
 */


/**
 * Square matrix of any size
 * @name Matrix^3
 * @constructor
 * @param {number[]} list one-dimensional array of lenght n^2
 */


/**
 * Square matrix of any size
 * @name Matrix^4
 * @constructor
 * @param {...number} n^2 numbers to fill the matrix
 */


/**
 * Empty matrix of dimensions 0x0
 * @name Matrix^5
 * @constructor
 */


/**
 * Matrix of any dimensions
 * @constructor
 * @param {number} width
 * @param {number} height
 * 
 * @prop {number} width
 * @prop {number} height
 * @prop {number} length is equal to width*height
 */

FOUR.Matrix = function constructor( w, h ){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  var te = this.elements = [];
  
  if(typeof w === "undefined" && typeof h === "undefined"){ w=h=0; }
  
  else if(
    arguments.length > 2 &&
    Number.isInteger(Math.sqrt(arguments.length))
  ){
    w = Array.from(arguments);
  }
  
  if(Array.isArray(w)){
    if( typeof w[0].valueOf() === "number" ){
      var side = Math.sqrt( w.length );
      
      if( side !== (side|0) ) { throw TypeError("This is not a square matrix. Use two-dimensional array as an argument."); }
      
      this.width  = side;
      this.height = side;
      
      var i = -1, l = w.length;
      
      while(++i < l){
        te[i] = +w[i];
      }
      
    }else if( Array.isArray(w[0]) ){
      var lw = this.width  = w[0].length;
      var lh = this.height = w   .length;
      
      var i = -1, l = lw*lh;
      while(++i < l){
        te[i] = +w[ (i/lw)|0 ][ i%lw ];
      }
      
      
    }else{
      throw TypeError("Invalid arguments.");
    }
    
  }else{
    if(arguments.length>2){
      throw TypeError("Invalid arguments.");
    }
    
    if( isNaN(+h) )  { h = w; }
    
    this.width  = +w;
    this.height = +h;
    
    h === w ? this.identity() : this.zero();
    
  }
  
};


/**
 * Multiplies two matrices, returns a new one
 * @param   {FOUR.Matrix} A
 * @param   {FOUR.Matrix} B A.width === B.height
 * @returns {FOUR.Matrix} C
 */

FOUR.Matrix.multiply = function multiply(A, B){
  if( !( A instanceof FOUR.Matrix &&
         B instanceof FOUR.Matrix &&
         A.width == B.height        )){
    throw new TypeError("Arguments 1 and 2 must be two matrices, the width of the former one has to be equal to the height of the latter one.");
  }
  
  var C = new Matrix(B.width, A.height);
  (B.width == A.height) && C.zero();
  
  var i  = -1,
      l  = C.length,
      w  = C.width,
      h  = C.height,
      Ae = A.elements,
      Be = B.elements,
      Ce = C.elements;
  
  while( ++i < l ){
    var j = -1;
    while( ++j < h ){
      
      Ce[i] += Ae[ j + ((i/w)|0) * h ]
             * Be[ j*w + i%w         ];
      
    }
  }
  
  return C;
}


Object.defineProperty( FOUR.Matrix.prototype, "length",{
  configurable: true,
  enumerable:   true,
  set: ()=>undefined,
  get: function(){
    return +this.width * +this.height;
  }
});



/**
 * @callback FOUR.Matrix#forEach~callback
 * @param value one entry of the matrix
 * @param x horizontal coordinate of the value
 * @param y vertical coordinate of the value
 */

/**
 * Execute the callback function for every entry of the matrix
 * @param {FOUR.Matrix#forEach~callback} callback
 */

FOUR.Matrix.prototype.forEach = function forEach( f ){
  var x = -1, y, w = this.width, h = this.height;
  var te = this.elements;
  while(++x < w){
    y = -1;
    while(++y < h){
      var n = f.call(this,te[x+y*w],x,y);
      if( typeof n === "number" || n instanceof Number ) { te[x+y*w] = +n; }
    }
  }
  return this;
};


/**
 * Check for matrix equality
 * @returns {boolean} equal
 */

FOUR.Matrix.prototype.equals = function equals( m ){
  
  if( this.width !== m.width
  || this.height !== m.height ){ return false; }
  
  var te = this.elements,
      me = m.elements,
      i = -1,
      l = te.length;
  
  while(++i < l){
    if( +te[i] !== +me[i] ){ return false; }
  }
  
  return true;
};


/**
 * Change dimensions of the matrix without changing values in the intersection
 * @param {number} w new matrix width
 * @param {number} h new matrix height
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.resize = function resize( w, h ){
  var tw = this.width, th = this.height, te = this.elements;
  var i, l;
  
  if( h !== th ){
    i = tw*th-1;
    this.height = h;
    l = te.length = tw*h;
    
    while(++i < l){
      te[i] = 0;
    }
  }
  
  var min = Math.min( tw,   w );
  var al  = Math.max( w-tw, 0 );
  var add =   filler( al,   0 );
  var rm  = Math.max( tw-w, 0 );
  
  if( w !== tw ){
    i=-1;
    while(++i < h) te.splice( (i+1)*(min+al), rm, ...add );
    this.width = w;
  }
  
  return this;
};


/**
 * Fill the matrix with all zeros
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.zero = function zero(){
  this.forEach(function(){return 0;});
  return this;
};


/**
 * Fill the main diagonal with ones and the other entries with zeros
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.identity = function identity(){
  this.forEach(function(n,x,y){return +(x===y)});
  return this;
};


/**
 * Set entries of the matrix using an array of numbers
 * @name Matrix#set^2
 * @param {number[]} list
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

/**
 * Set entries of the matrix
 * @param {...number} entry
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.set = function set( list ){
  var i = -1, te = this.elements, l = te.length;
  
  if( arguments.length === l ){ list = arguments; }
  
  while(++i<l){
    te[i] = +list[i];
  }
  return this;
}


/**
 * Resize this matrix to the size of another one and copy the entries from it
 * @param {FOUR.Matrix} copyFrom
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.copy = function copy( m ){
  this.width  = m.width;
  this.height = m.height;
  this.elements.length = m.elements.length;
  this.set(m.elements);
  return this;
};


/**
 * Computes the determinant of the matrix using Bareiss algorithm
 * @returns {number} determinant
 */
/*
FOUR.Matrix.prototype.determinant = function determinant(){
  var result = 0, x = -1, y, a, b, w = this.width, h = this.height;
  while(++x < w){
    y = -1;
    a = b = 1;
    while(++y < h){
      a *= this.elements[ mod(x+y,w) + y*w ];
      b *= this.elements[ mod(x-y,w) + y*w ];
    }
    result += a - b;
  }
  return result;
};*/
FOUR.Matrix.prototype.determinant = (function(){
  
  var tmp = FOUR.Matrix();
  
  return function determinant(){
    
    tmp.copy(this);
    
    var te = tmp.elements,
        l  = tmp.width,
        i, j, k;
    
    if( this.height !== l ){ throw new RangeError("Non-square matrices do not have a determinant.") }
    if( l === 0 ){ return 1; }
    
    for( i =     0; i < (l-1); i++ )
    for( j = (i+1); j <     l; j++ )
    for( k = (i+1); k <     l; k++ ){
      
      te[j*l + k] =
        te[j*l + k] *
        te[i*l + i] -
        te[j*l + i] *
        te[i*l + k];
      
      if(i){
        te[j*l + k] /= te[(i-1)*(l+1)]
      }
      
    }

     return te[(l-1)*(l+1)];
  };
  
})();


/**
 * Transposes the matrix; note that matrix m×n will be n×m after tranposition
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.transpose = function transpose(){
  var x = -1, y, tmp,
      w = this.width,
      h = this.height,
      m = Math.max(w,h),
      te = this.elements;
  
  this.resize(m,m);
  
  while(++x < m){
    y = -1;
    while(++y < x){
      tmp         = te[x + y*m];
      te[x + y*m] = te[y + x*m];
      te[y + x*m] = tmp;
    }
  }
  
  this.resize(h,w);
  return this;
}


})(this);