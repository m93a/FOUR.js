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

// rounds tiny numbers to zero
function roundTiny(n){
  if(Math.abs(n) < Number.EPSILON)
  return 0;
  return n;
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
 * Returns the lower of width & height
 * @name FOUR.Matrix#dimension
 */

Object.defineProperty(FOUR.Matrix.prototype,"dimension",{
  configurable: true,
  enumerable: true,
  get: function(){ return Math.min(this.height, this.width); }
});


/**
 * Multiplies two matrices, returns a new one
 * @param   {FOUR.Matrix}  A
 * @param   {FOUR.Matrix}  B  A.width === B.height
 * @param   {FOUR.Matrix} [C] write into this matrix
 * @returns {FOUR.Matrix}  C
 */

FOUR.Matrix.multiply = function multiply(A, B, C){
  if( !( A instanceof FOUR.Matrix &&
         B instanceof FOUR.Matrix &&
         A.width == B.height        )){
    throw new TypeError("Arguments 1 and 2 must be two matrices, the width of the former one has to be equal to the height of the latter one.");
  }
  
  if( C instanceof FOUR.Matrix ){
    if( C.width !== B.width || C.height !== A.height ) C.resize( B.width, A.height);
    C.zero();
    
  }else{
    C = new FOUR.Matrix(B.width, A.height);
    if(B.width === A.height) C.zero();
  }
  
  
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
  else if( list instanceof FOUR.Matrix ){ list = list.elements; }
  
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



/**
 * Sets the rotation submatrix of this matrix to the rotation specified by Euler angles, the rest of the matrix is identity.
 * @param {FOUR.Euler} euler
 * @param {number=0} xOffset
 * @param {number=0} yOffset
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.makeRotationFromEuler = (function(){
  var tempArr = [];
  var resArr  = [];
  return function makeRotationFromEuler(euler, xOffset, yOffset){
    if(!(euler instanceof FOUR.Euler)) throw new TypeError("Argument 1 must inherit from FOUR.Euler.");
    if( this.width !== this.height ) throw new TypeError("This is not a square matrix.");
    
    var ee = euler.elements;
    var te = this.elements;
    var eD = euler.dimension;
    var tD = this.dimension;
    var w = this.width;
    var el = euler.length;
    var tl = this.length;
    var order = euler.__order;
    
    if(eD>tD) throw new TypeError("Rotation vector must be smaller than the matrix");
    
    this.identity();
    var temp = tempArr[w] = tempArr[w] || new FOUR.Matrix(w);
    var res  =  resArr[w] =  resArr[w] || new FOUR.Matrix(w);
    
    for(var i=0, l=order.length; i<l; i++){
      var n = order[i];
      var r = euler.__rotationFromNumber( n );
      
      temp.forEach(function(v,x,y){
        if( x===y ){
          if( x===r[0] || x===r[1] ){
            return roundTiny(Math.cos(ee[n]));
            
          }else{
            return 1;
          }
          
        }else{
          if( x===r[0] && y===r[1] ){
            return roundTiny( -Math.sin(ee[n]) );
            
          }else if( x===r[1] && y===r[0] ){
            return roundTiny( Math.sin(ee[n]) );
            
          }else{
            return 0;
          }
        }
      });
      
      FOUR.Matrix.multiply(this,temp,res);
      this.set(res);
    }
    
    return this;
  }
})();



FOUR.Matrix.prototype.scale = function scale( v ){
  if( typeof v === "number" ){
    this.forEach( n=>v*n );
  
  }else if( v instanceof FOUR.Vector ){
    
    var ve = v.elements;
    var l = ve.length;
    
    this.forEach( function(n,x,y){
      if( x<l && y<l ) return n*ve[x];
    });
    
  }else throw new TypeError("Argument 1 must be either a vector or a scalar.");
  return this;
};



FOUR.Matrix.prototype.setPosition = function setPosition( v ){
  if( v instanceof FOUR.Vector ){
    
    var te = this.elements;
    var w = this.width;
    var ve = v.elements;
    var l = Math.min(ve.length, w);
    
    for(var i=0; i<l; i++){
      te[ (i+1)*w -1 ] = ve[i];
    }
    
  }else throw new TypeError("Argument 1 must be either a vector or a scalar.");
  return this;
};



/**
 * Composes a transformation matrix from position, rotation and scale
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */
FOUR.Matrix.prototype.compose = function compose( position, rotation, scale ){}; //TODO
FOUR.Matrix.prototype.decompose = function decompose( position, rotation, scale ){}; //TODO


})(this);