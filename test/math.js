(function(global){ "use strict";

var Matrix = global.FOUR.Matrix;

global.FOUR.test.math = {
  
  "Matrix (square)": function squareMatrix(){
    var square1 = new Matrix(3,3);
    
    var square2 = Matrix(3);
    
    var square3 = new Matrix([
      1,0,0,
      0,1,0,
      0,0,1
    ]);
    
    var square4 = Matrix([
      [1,0,0],
      [0,1,0],
      [0,0,1]
    ]);
    
    var square5 = Matrix(1,0,0,
                         0,1,0,
                         0,0,1);
    
    return square1.equals(square2) &&
           square1.equals(square3) &&
           square1.equals(square4) &&
           square1.equals(square5) &&
           square2.equals(square3) &&
           square2.equals(square4) &&
           square2.equals(square5) &&
           square3.equals(square4) &&
           square3.equals(square5) &&
           square4.equals(square5);
  },
  
  
  
  "Matrix (rectangular)": function rectMatrix(){
    var rect1 = Matrix(2,3);
    
    var rect2 = new Matrix([
      [0,0],
      [0,0],
      [0,0]
    ]);
    
    var rect3 = Matrix(2);
    
    var catched = false;
    
    try{
      Matrix([1,2,3,4,5,6]);
      
    }catch(e){
      catched = true;
    }
    
    
    return catched &&
           rect1.equals(rect2) &&
           rect2.equals(rect1) &&
          !rect2.equals(rect3) &&
          !rect3.equals(rect2);
  },
  
  
  
  "Matrix#equals": function matrixEquals(){
    return Matrix([ 0, 1, 1,
                    2, 3, 5,
                    8,13,21 ]).equals(
           
           Matrix([[0, 1, 1],
                   [2, 3, 5],
                   [8,13,21]]) )&&
           
           Matrix([[1,2],[3,4],[5,6]]).equals({
             width: 2,
             height: 3,
             elements: [1,2,3,4,5,6]
           })&&
           
           ! Matrix([ 42, 23, 13, 3.1415926 ]).equals( Matrix([ 42, 23, 7, 3.1415926 ]) );
  },
  
  
  
  "Matrix#forEach": function matrixForEach(){
    var resource = Matrix([
      [ 1, 2, 3, 4 ],
      [ 5, 6, 7, 8 ],
      [ 9,10,11,12 ]
    ]);
    
    var result = [[],[],[]];
    
    resource.forEach(function(v,x,y){
      result[y][x] = v;
    });
    
    
    var rewrite = Matrix([[ 1, 2, 3, 4 ],[ 5, 6, 7, 8 ],[ 9,10,11,12 ]])
    .forEach(function(v){
      return v - 6;
    });
    
    var rewrited = Matrix([
      [ -5, -4, -3, -2 ],
      [ -1,  0,  1,  2 ],
      [  3,  4,  5,  6 ]
    ]);
    
    
    return resource.equals( Matrix(result) ) &&
           rewrite .equals( rewrited );
  },
  
  
  
  "Matrix#zero": function matrixZero(){
    var m = Matrix([1,2,3,4,5,6,7,8,9]);
    var n = Matrix(15,2);
    var o = Matrix([
      [20, 30, 42],
      [23, 32, 40]
    ]);
    
    function check(v){
      if(v !== 0){ throw void 0; }
    };
    
    try{
      m.zero().forEach(check);
      n.zero().forEach(check);
      o.zero().forEach(check);
    }catch(e){
      return false;
    }
    
    return true;
    
  },
  
  
  
  "Matrix#identity": function matrixIdentity(){
    var m = Matrix([1,2,3,4,5,6,7,8,9]);
    var n = Matrix(15,2);
    var o = Matrix([
      [20, 30, 42],
      [23, 32, 40]
    ]);
    
    function check(v,x,y){
      if( x===y ){
        if( v !== 1 ){ throw void 0; }
      }else{
        if( v !== 0 ){ throw void 0; }
      }
    }
    
    try{
      m.identity().forEach(check);
      n.identity().forEach(check);
      o.identity().forEach(check);
    }catch(e){
      return false;
    }
    
    return true;
    
  },
  
  
  
  "Matrix#set": function matrixSet(){
    var m = Matrix(3);
    var n = Matrix(5,2);
    var o = Matrix(2,5);
    
    m.set(1,2,3,4,5,6,7,8,9);
    n.set(0,1,1,2,3,5,8,13,21,34);
    o.set([0,1,1,2,3,5,8,13,21,34]);
    
    var rm = Matrix([
      1,2,3,
      4,5,6,
      7,8,9
    ]);
    
    var rn = Matrix([
      [  0,  1,  1,  2,  3],
      [  5,  8, 13, 21, 34]
    ]);
    
    var ro = Matrix([
      [ 0, 1 ],
      [ 1, 2 ],
      [ 3, 5 ],
      [ 8,13 ],
      [21,34 ]
    ]);
    
    return m.equals(rm) && n.equals(rn) && o.equals(ro);
  },
  
  
  
  "Matrix#copy": function matrixCopy(){
    var m = Matrix(3);
    var n = Matrix(5,2);
    var o = Matrix(2,5);
    
    m.set(1,2,3,4,5,6,7,8,9);
    n.set(0,1,1,2,3,5,8,13,21,34);
    o.set([0,1,1,2,3,5,8,13,21,34]);
    
    var rm = Matrix().copy(m);
    var rn = Matrix().copy(n);
    var ro = Matrix().copy(o);
    
    return m.equals(rm) && n.equals(rn) && o.equals(ro);
  },
  
  
  
  "Matrix#resize": function matrixResize(){
    return Matrix(3).resize(3,4).equals( Matrix([ [1,0,0], [0,1,0], [0,0,1], [0,0,0] ]) ) &&
           Matrix(3).resize(4,2).equals( Matrix([ [1,0,0,0], [0,1,0,0] ]) ) &&
           Matrix(1, 2, 3,
                  4, 5, 6,
                  7, 8, 9) .resize( 2, 2 ) .equals( Matrix(1, 2,
                                                           4, 5) );
  },
  
  
  "Matrix#determinant": function matrixDeterminant(){
    return Matrix(3, 8, 4, 6                         ).determinant() === -14 &&
           Matrix(1, 2, 1, 3, 0, 4, 8, 4, 10         ).determinant() ===   0 &&
           Matrix(1,2,2,1,0,2,0,0,-1,-4,-2,-1,1,4,4,1).determinant() ===   0 &&
           Matrix(1,0,2,-1,3,0,0,5,2,1,4,-3,1,0,5,0  ).determinant() ===  30 &&
           Matrix(  4,-1, 1,   4, 5, 3,   -2, 0, 0   ).determinant() ===  16;
  },
  
  
  "Matrix.multiply": function matrixMultiply(){
    console.log("TODO test for Matrx.multiply");
    return 1;
  }
  
};

})(this);