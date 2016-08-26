(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);

/**
 * @constructor
 * @extends FOUR.Object
 * @extends FOUR.VisualNode
 */

FOUR.Camera = function constructor(){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  FOUR.VisualNode.call(this,true);
  
  this.camera = this;
  var self = this;
  
  var running = false;
  function checkForUpdates(){
    if(!self.scene || !self.__out)
      return running = false;
    
    for(var obj of self.scene.__set){
      if(obj.needsUpdate){
        self.update();
        break;
      }
    }
    
    if(running)
      requestAnimationFrame(checkForUpdates);
  }
  
  Object.defineProperty(this,"running",{
    configurable: true,
    enumerable: true,
    get: function(){ return running; },
    set: function(a){
      if(a && !running){
        running = true;
        checkForUpdates();
      }else{
        running = a;
      }
    }
  });
  
}

FOUR.Camera.prototype = Object.create( FOUR.Object.prototype );
FOUR.Camera.prototype.constructor = FOUR.Camera;

FOUR.Camera.prototype.connect    = FOUR.VisualNode.prototype.connect;
FOUR.Camera.prototype.disconnect = FOUR.VisualNode.prototype.disconnect;
FOUR.Camera.prototype.__feed     = FOUR.VisualNode.prototype.__feed;

FOUR.Camera.prototype.destructive = false;
FOUR.Camera.prototype.processor = function(){};



FOUR.Camera.prototype.update = function update(){
  
  if(!this.scene) return;
  if(!this.__out.length) return;
  
  var PI2 = 2*Math.PI;
  this.rotation.forEach(function(a){
    return (a+PI2)%PI2;
  });
  
  var D = this.scene.dimension;
  
  var v1 = new FOUR.Vector( D+1 );
  var v2 = new FOUR.Vector( D+1 );
  var v1e = v1.elements;
  var v2e = v2.elements;
  
  
  var length = 0;
  for(shape of this.scene.__set){
    if(shape instanceof FOUR.Shape) length += shape[0].length;
  }
  
  var vertices = new Float64Array(length);
  
  var food = {
    fragile:   false,
    dimension: this.scene.dimension,
    faces: [ vertices ],
    colors: new Uint8ClampedArray( 4*length/D )
  };
  
  var j = 0;
  for(shape of this.scene.__set){
    var offset = j;
    if(shape.dimension === 0){
      if(shape.needsUpdate){
        shape.matrix.compose(
          shape.position,
          shape.rotation,
          shape.scale
        );
        shape.needsUpdate = false;
      }
      continue;
    }
    
    var sD = shape.dimension;
    
    shape.matrix.compose(
      shape.position,
      shape.rotation,
      shape.scale
    );
    shape.needsUpdate = false;
    
    
    for(var j=0, l=shape[0].length; j<l;){
      v1.zero();
      for(var k=0; k<sD; k++, j++){
        v1e[k] = shape[0][j];
      }
      v1e[D] = 1;
      FOUR.Matrix.multiply(shape.matrix, v1, v2);
      j -= sD;
      for(var k=0; k<D; k++, j++){
        vertices[j] = v2e[k]/v2e[D];
      }
    }
    
    for(var k=1; k<=D; k++){
      for(var n=0, l=shape[k].length; n<l; n++){
        var arr = food.faces[k] = food.faces[k] || [];
        arr[n] = shape[k][n]
        arr[n].forEach((a)=>a+offset);
      }
    }
  }
  
  this.__feed(food);
  
};


})(this);