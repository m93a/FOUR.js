(function(global){ "use strict";


Int8Array.prototype.clone =
Uint8Array.prototype.clone =
Uint8ClampedArray.prototype.clone =
Int16Array.prototype.clone =
Uint16Array.prototype.clone =
Int32Array.prototype.clone =
Uint32Array.prototype.copy =
Float32Array.prototype.clone =
Float64Array.prototype.clone =

function clone(){
  var l    = this.length,
      copy = new this.constructor(l);
  
  for( var i=0; i<l; i++ )
    copy[i] = this[i];
  
  return copy;
};



Array.isTypedArray = function isTypedArray(a){
  return a instanceof Int8Array        ||
         a instanceof Uint8Array       ||
         a instanceof Uint8ClampedArray||
         a instanceof Int16Array       ||
         a instanceof Uint16Array      ||
         a instanceof Int32Array       ||
         a instanceof Uint32Array      ||
         a instanceof Float32Array     ||
         a instanceof Float64Array;
};



Array.prototype.clone =
function clone(){
  var l    = this.length,
      copy = [];
  
  for( var i=0; i<l; i++ ){
    var x = this[i];
    if( Array.isTypedArray(x) ){
      copy[i] = i.clone();
    }else{
      copy[i] = Object.clone(x);
    }
  }
  
  return copy;
};


})(this);