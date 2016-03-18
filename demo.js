window.onload = function(){

scene  = new FOUR.Scene(4);
shape  = new FOUR.Shape;
camera = new FOUR.Camera;

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

projection = new FOUR.TransformNode(
  FOUR.Matrix([ [ 1, 0, 0, 0, 0 ],
                [ 0, 1, 0, 0, 0 ],
                [ 0, 0, 1, 1, 0 ] ])
);

canvas = new FOUR.CanvasNode( document.getElementById("canvas") );

camera.connect(worldTransform);
worldTransform.connect(depthCueing);
depthCueing.connect(projection);
projection.connect(canvas);

camera.running = true;
};

function rotate(){
  console.log("asdf");
  camera.rotation.set(
    document.getElementById("rot0").value*2*Math.PI/360,
    document.getElementById("rot1").value*2*Math.PI/360,
    document.getElementById("rot2").value*2*Math.PI/360,
    document.getElementById("rot3").value*2*Math.PI/360,
    document.getElementById("rot4").value*2*Math.PI/360,
    document.getElementById("rot5").value*2*Math.PI/360
  );
}