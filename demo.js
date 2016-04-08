window.onload = function(){

scene  = new FOUR.Scene(4);
shape  = new FOUR.Shape;
camera = new FOUR.Camera;

var mode = "perspective";

shape
 .extrude()  //line segment
 .extrude()  //square
 .extrude()  //cube
 .extrude(); //tesseract

scene.add(shape);
scene.add(camera);

camera.position.set( 0, 0, 1, 1 );

worldTransform = new FOUR.TransformNode(camera.matrix);

depthCueing = new FOUR.ColorNode(function(v,c){
  c[0] = 200*v.elements[2];
  c[1] = 200*v.elements[3];
  c[2] = 0;
  c[3] = 255;
});

camera.connect(worldTransform);
worldTransform.connect(depthCueing);


switch(mode){
  case "perspective":
    projection = new FOUR.TransformNode(
      new FOUR.Matrix([
        [ 1, 0, 0, 0, 0],
        [ 0, 1, 0, 0, 0],
        [ 0, 0, 1, 1, 0]
      ])
    );
    depthCueing.connect(projection);
    break;
    
  case "pythagorean":
    var abc = new FOUR.ForEachVertexNode(
      function(v){
        v[0] /= v[2]+v[3];
        v[1] /= v[2]+v[3];
      }
    );
    projection = new FOUR.TransformNode(
      new FOUR.Matrix([
        [ 1, 0, 0, 0 ],
        [ 0, 1, 0, 0 ]
      ])
    );
    depthCueing.connect( abc );
    abc.connect( projection );
    break;
}

canvas = new FOUR.CanvasNode( document.getElementById("canvas") );
projection.connect(canvas);

camera.running = true;
};