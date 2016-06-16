(function(global){ "use script";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

//Helper functions

// creates an array of length l filled with x
function filler(l,x){
  var arr = [];
  while(--l >= 0){
    arr.push(x);
  }
  return arr;
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

var order = "xyzwvutsrqponmlkjihgfedcba";


/**
 * @constructor
 */

FOUR.Euler = function constructor(D){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  this.dimension = D;
  var l = Math.nCr(D,2);
  this.elements = filler(l,0);
  
  this.__order = [];
  this.order = [0];
  
  this.width    = 1;
  this.height   = D;
  
};


Object.defineProperty(FOUR.Euler.prototype, "length",{
  configurable: true,
  enumerable: true,
  get: function(){
    return this.elements.length 
  }
});


FOUR.Euler.prototype.__rotationFromNumber = function( i ){
  if(i>=this.length) throw new TypeError("Index number "+i+" is out of bounds");
  
  var l = this.dimension;
  var t = 1, n = 1;
  while( i >= n*l - t ){
    n++; t+=n;
  }
  return [n-1, i - (n-1)*l + t];
}

FOUR.Euler.prototype.__numberFromRotation = function( n, m ){
  var l = this.dimension;
  if(Array.isArray(n)){ m = n[1]; n = n[0]; }
  n = n|0; m = m|0;
  
  if(Math.max(n,m)>=l) throw new TypeError("There's no "+Math.max(n,m)+"th axis.");
  if(Math.min(n,m)<0)  throw new TypeError("There's no "+Math.min(n,m)+"th axis.");
  if(m<=n) throw new TypeError("Second parameter must be larger than the first.");
  
  for(var i=1, t=0; i<=n; t+=i++);
  return n*l +m -t -n -1;
}


Object.defineProperty(FOUR.Euler.prototype, "order",{
  configurable: true,
  enumerable:   true,
  get: function(){
    var result = [];
    for(var i=0, l=this.__order.length; i<l; i++){
      result[i] = this.__rotationFromNumber(this.__order[i]);
      result[i] = order[ result[i][0] ] + order[ result[i][1] ];
    }
    return result;
  },
  set: function(o){
    if( typeof o[0] !== "number" ){
      if( !Array.isArray(o[0]) || typeof o[0][0] !== "number" ){
        o = (""+o).toLowerCase();
        
        if( this.length == 3 && o.length == 3 ){
          
          //Special case: 3D
          var n = "";
          for(var i=0; i<3; i++){
            switch(o[i]){
              case "x":
                n += "yz";
                break;
              case "y":
                n += "xz";
                break;
              case "z":
                n += "xy";
                break;
            }
          }
          
          o = n;
        }
        
        //Parse from string
        var a=[], b=[], j;
        for(var i=0, l=o.length; i<l; i++){
          j = order.indexOf(o[i]);
          if( j === -1 ) continue;
          b.push(j);
          if(b.length == 2){
            a.push(b);
            b=[];
          }
        }
        
        o = a;
      }
      
      //Parse from axis numbers
      var a = [];
      for(var i=0, l=o.length; i<l; i++){
        a.push( this.__numberFromRotation( o[i] ) );
      }
      
      o = a;
    }
    
    //Broken data correction
    var max = this.length-1;
    
    for(var i=0; i<o.length; i++)
      if(typeof o[i] !== "number" || o[i]<0 || o[i]>max)
        o.splice(i--,1);
    
    for(var i=0; i<=max; i++){
      var j = o.indexOf(i);
      
      if( j == -1 ){
        o.push(i);
      
      }else{
        var k = o.lastIndexOf(i);
        while( j !== k ){
          o.splice(k,1);
          k = o.lastIndexOf(i);
        }
      }
    }
    
    this.__order = o;
    needsUpdate(this);
  }
  
});


FOUR.Euler.prototype.set     = FOUR.Matrix.prototype.set;
FOUR.Euler.prototype.forEach = FOUR.Matrix.prototype.forEach;


})(this);