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

//marks obj as needsUpdate
function needsUpdate(self){
  self.needsUpdate = true;
  if(self.object){
    self.object.needsUpdate = true;
    if(self.object.scene){
      self.object.scene.needsUpdate = true;
    }
  }
}

//get row of matrix
function getRow( M, n ){
  var w = M.width;
  var e = M.elements;
  return e.slice( n*w, (n+1)*w );
}

//set row of matrix
function setRow( M, n, a ){
  var w = M.width;
  var e = M.elements;
  var l = Math.min( a.length, w );
  
  for(var i=0, j=n*w; i<l; i++, j++)
    e[j] = a[i];
}

//get col of matrix
function getColumn( M, n ){
  var w = M.width;
  var h = M.height;
  var e = M.elements;
  var a = [];
  for(var i=0; i<h; i++)
    a[i] = e[ i*w + n ];
  return a;
}

//set col of matrix
function setColumn( M, n, a ){
  var w = M.width;
  var l = Math.min(M.height, a.length);
  var e = M.elements;
  for(var i=0; i<l; i++)
    e[ i*w + n ] = a[i];
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
  
  
  C.forEach(function(v,x,y){
    var row = getRow(A,y);
    var col = getColumn(B,x);
    for(var i=0, l=row.length; i<l; i++){
      v += row[i]*col[i];
    }
    return v;
  });
  
  return C;
}


/**
 * Adds two matrices, returns a new one
 * @param   {FOUR.Matrix}  A
 * @param   {FOUR.Matrix}  B  has same dimensions as A
 * @param   {FOUR.Matrix} [C] write into this matrix
 * @returns {FOUR.Matrix}  C
 */

FOUR.Matrix.add = function add(A, B, C){
  if( !( A instanceof FOUR.Matrix &&
         B instanceof FOUR.Matrix &&
         A.width  == B.width &&
         A.height == B.height        )){
    throw new TypeError("Arguments 1 and 2 must be two matrices of the same dimensions.");
  }
  
  if( C instanceof FOUR.Matrix ){
    if( C.width !== A.width || C.height !== A.height ) C.resize(A.width, A.height);
    C.zero();
    
  }else{
    C = new FOUR.Matrix(A.width, A.height);
    if(A.width === A.height) C.zero();
  }
  
  for(var i = 0; i < A.length; i++){
    C.elements[i] = A.elements[i] + B.elements[i];
  }
  
  return C;
  
};


/**
 * Subtracts two matrices, returns a new one
 * @param   {FOUR.Matrix}  A
 * @param   {FOUR.Matrix}  B  has same dimensions as A
 * @param   {FOUR.Matrix} [C] write into this matrix
 * @returns {FOUR.Matrix}  C
 */

FOUR.Matrix.sub = function add(A, B, C){
  if( !( A instanceof FOUR.Matrix &&
         B instanceof FOUR.Matrix &&
         A.width  == B.width &&
         A.height == B.height        )){
    throw new TypeError("Arguments 1 and 2 must be two matrices of the same dimensions.");
  }
  
  if( C instanceof FOUR.Matrix ){
    if( C.width !== A.width || C.height !== A.height ) C.resize(A.width, A.height);
    C.zero();
    
  }else{
    C = new FOUR.Matrix(A.width, A.height);
    if(A.width === A.height) C.zero();
  }
  
  for(var i = 0; i < A.length; i++){
    C.elements[i] = A.elements[i] - B.elements[i];
  }
  
  return C;
  
};


/**
 * Returns the result of multiplying this matrix with
 * another matrix M.
 * @see {@link FOUR.Matrix.multiply}
 * @argument {FOUR.Matrix} M
 */
FOUR.Matrix.prototype.multiply = function multiply(M){
  return FOUR.Matrix.multiply(this,M);
};


/**
 * Returns the result of adding this matrix to another matrix M.
 * @see {@link FOUR.Matrix.add}
 * @argument {FOUR.Matrix} M
 */
FOUR.Matrix.prototype.add = function add(M){
  return FOUR.Matrix.add(this,M);
};


/**
 * Returns the result of subtracting matrix M from this one.
 * @see {@link FOUR.Matrix.add}
 * @argument {FOUR.Matrix} M
 */
FOUR.Matrix.prototype.sub = function add(M){
  return FOUR.Matrix.sub(this,M);
};


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
      if( typeof n === "number" || n instanceof Number ) { te[x+y*w] = +n; needsUpdate(this); }
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
  
  needsUpdate(this);
  
  return this;
};


/**
 * Fill the matrix with all zeros
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.zero = function zero(){
  this.forEach(()=>0);
  needsUpdate(this);
  return this;
};


/**
 * Fill the matrix with all ones
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.one = function one(){
  this.forEach(()=>1);
  needsUpdate(this);
  return this;
};


/**
 * Fill the main diagonal with ones and the other entries with zeros
 * @returns {FOUR.Matrix} Returns `this` for chaining
 */

FOUR.Matrix.prototype.identity = function identity(){
  this.forEach(function(n,x,y){return +(x===y)});
  needsUpdate(this);
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
  
  needsUpdate(this);
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
  needsUpdate(this);
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
FOUR.Matrix.prototype.compose = function compose( translation, euler, scale ){
  this.makeRotationFromEuler( euler );
  this.scale( scale );
  this.setPosition( translation );
  
  translation.needsUpdate =
  euler.needsUpdate =
  scale.needsUpdate =
  this.needsUpdate = false;
  
  if(this.object){ this.object.needsUpdate = true; }
  
  return this;
};



/**
 * Inverse of a homogeneous coord transformation matrix.
 * FIXME doesn't work
 * @returns{Matrix}
 */

//http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche53.html

FOUR.Matrix.prototype.inverseTransformation = function(){
  var w = this.width;
  if(this.height !== w) throw new TypeError("Matrix must be square");
  
  var center = this.submatrix(0, w-2, 0, w-2);
  var lightSide = this.submatrix(0,w-2,w-1,w-1);
  
  center.transpose();
  
  var darkSide = FOUR.Matrix.multiply( center, lightSide );
  darkSide.scale( -1 );
  
  var inv = center.augment( darkSide );
  inv.height++;
  for(var i=0; i<w-1; i++){
    inv.elements.push(0);
  }
  inv.elements.push(1);
  
  return inv;
};


/**
 * Calculate the inverse matrix.
 * FIXME does not work
 * @returns {Matrix}
 */

FOUR.Matrix.prototype.inverse = function inverse(){
  if( this.width !== this.height ) {
    throw new TypeError( 'Matrix must be square' );
  }
  
  var M = this.augment( FOUR.Matrix( this.width ) ),
      row, row_before, new_row, i, j, k, factor, rows, columns;
  
  try{
    M = M.decomposeLU();
    rows    = M.height;
    columns = M.width;
    
    // TODO The following two loops can probably be rewritten into something smarter
    for( i = rows; i > 1; i-- ) {
      row_before = getRow( M, i-1 );
      row = getRow( M, i );
      factor = row_before[i - 1] / row[i - 1];
      
      new_row = [];
      for( k = 0; k < columns; k++ ) {
        new_row[k] = row_before[k] - row[k] * factor;
      }
      setRow( M, i-1, new_row );
    }
    
    for( j = 1; j <= rows; j++ ) {
      row = getRow( M, j );
      new_row = [];
      
      for( k = 0; k < columns; k++ ) {
        new_row[k] = row[k] / row[j - 1];
      }
      
      setRow( M, j, new_row );
    }
  } catch( e ) {
    // TODO if caching attributes like the determinant is introduced, replace this by checking
    // the determinant and throw a general error here
    throw new TypeError("Matrix is singular");
  }
  
  return M.submatrix( 1, rows, this.width+1, columns );
};


/**
 * Extract a submatrix.
 * @param {number} rowStart Row index where to start the cut
 * @param {number} rowEnd Row index where to end the cut
 * @param {number} columnStart Column index where to start the cut
 * @param {number} columnEnd Column index where to end the cut
 * @returns {Matrix}
 */
FOUR.Matrix.prototype.submatrix = function (rowStart, rowEnd, columnStart, columnEnd) {
  if( Math.min(rowStart, columnStart) < 0 ||
      rowEnd     >= this.height ||
      columnEnd  >= this.width  ||
      rowStart    > rowEnd      ||
      columnStart > columnEnd   ){
          throw new TypeError( "Out of bounds" );
  }

  var mResult = rowEnd - rowStart + 1,
      nResult = columnEnd - columnStart + 1;

  var Result = new FOUR.Matrix( nResult, mResult );
  for( var i = rowStart; i <= rowEnd; i++ ) {
    var origRow = getRow( this, i );
    var newRow  = origRow.slice( columnStart, columnEnd+1 );
    setRow( Result, i - rowStart, newRow );
  }

  return Result;
};


FOUR.Matrix.prototype.decomposeLU = function () {
  var swappedRows = 0,
      LU = new FOUR.Matrix;
      LU.copy(this);
  
  var i, j, k,
      row_k, column_k, row_i,
      rows = this.height,
      columns = this.width;
  
  var pivot, maxArg, currArg, tempRow;
  
  for( k = 1; k <= rows; k++ ) {
    pivot = 0;
    maxArg = -1;
    
    column_k = getColumn( LU, k );
    for( i = k; i <= rows; i++ ) {
      currArg = Math.abs( column_k[i - 1] );
      
      if( currArg >= maxArg ) {
        pivot = i;
        maxArg = currArg;
      }
    }
    
    if( column_k[pivot - 1] === 0 ) {
      throw new TypeError( "Matrix is singular" );
    }
    
    if( pivot !== k ) {
      tempRow = getRow( LU, pivot );
      
      setRow( LU, pivot, getRow( LU, k ) );
      setRow( LU, k, tempRow );
      
      swappedRows++;
    }
    
    row_k = getRow( LU, k );
    for( i = k + 1; i <= rows; i++ ) {
      row_i = getRow( LU, i );
      
      for( j = k; j < columns; j++ ) {
        row_i[j] = row_i[j] - row_k[j] * ( row_i[k - 1] ) / row_k[k - 1];
      }
      
      row_i[k - 1] = 0;
      setRow( LU, i, row_i );
    }
  }
  
  // as a "hidden property" we attach the number of swapped rows
  LU.swappedRows = swappedRows;
  
  return LU;
};



/**
 * Augment with another matrix.
 * @param {Matrix} M
 * @returns {Matrix}
 */
FOUR.Matrix.prototype.augment = function (M) {
  var rows = this.height,
      columns = this.width,
      columnsM = M.width;
  
  if( rows !== M.height ) {
    throw new TypeError( 'Number of rows must match' );
  }
  
  var Result = new FOUR.Matrix( columns + columnsM, rows );
  
  for( var i = 0; i < columns; i++ ) {
    setColumn( Result, i, getColumn( this, i ) );
  }
  for( var j = 0; j < columnsM; j++ ) {
    setColumn( Result, j + columns, getColumn( M, j ) );
  }
  
  return Result;
};


})(this);