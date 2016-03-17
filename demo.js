
var scene  = new FOUR.Scene(4),
    shape  = new FOUR.Shape,
    camera = new FOUR.Camera;

shape
 .extrude()  //line segment
 .extrude()  //square
 .extrude()  //cube
 .extrude(); //tesseract

scene.add(shape);
scene.add(camera);

camera.position.set( 0, 0, 1, 0 );


var logger = new FOUR.LogNode;
camera.connect(logger);