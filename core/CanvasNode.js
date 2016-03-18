(function(global){ "use strict";
var FOUR = global.FOUR = global.FOUR || Object.create(null);


FOUR.CanvasNode = function constructor(canvas){
  
  //if not called as an constructor
  if(!(this instanceof constructor)){
    var r;
    constructor.apply(r=Object.create(constructor.prototype),arguments);
    return r;
  }
  
  FOUR.VisualNode.call(this);
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.lineWidth = 2;
  this.lineJoin = "round";
  this.compositeOperation = "source-over";
  this.width  = 500;
  this.height = 500;
  
};


FOUR.CanvasNode.prototype = Object.create( FOUR.VisualNode.prototype );
FOUR.CanvasNode.prototype.constructor = FOUR.CanvasNode;


FOUR.CanvasNode.prototype.processor = function( data ){
  if(data.dimension !== 2){
    throw new Error("CanvasNode requires 2-dimensional data");
  }
  
  var canvas = this.canvas;
  var ctx    = this.ctx;
  
  var w = canvas.width = this.width;
  var h = canvas.height= this.height;
  
  var s = Math.min(w,h)/2;
  
  ctx.lineWidth = this.lineWidth;
  ctx.lineJoin  = this.lineJoin;
  ctx.globalCompositeOperation = this.compositeOperation;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  var vertices = data.faces[0];
  var colors   = data.colors;
  
  
  for(var edge of data.faces[1]){
    
    var i = edge[0];
    var j = edge[1];
    
    var x1 = s+s*vertices[i*2];
    var y1 = s+s*vertices[i*2+1];
    var x2 = s+s*vertices[j*2];
    var y2 = s+s*vertices[j*2+1];
    
    var r1 = colors[i*4];
    var g1 = colors[i*4+1];
    var b1 = colors[i*4+2];
    var a1 = colors[i*4+3];
    
    var r2 = colors[j*4];
    var g2 = colors[j*4+1];
    var b2 = colors[j*4+2];
    var a2 = colors[j*4+3];
    
    ctx.beginPath();
    ctx.moveTo( x1, y1 );
    ctx.lineTo( x2, y2 );
    ctx.closePath();
    
    var grad = ctx.createLinearGradient(x1,y1,x2,y2);
    grad.addColorStop(0, "rgba("+r1+","+g1+","+b1+","+a1+")" );
    grad.addColorStop(1, "rgba("+r2+","+g2+","+b2+","+a2+")" );
    
    ctx.strokeStyle = grad;
    ctx.stroke();
  }
};

})(this);