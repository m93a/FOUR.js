(function(){

var orig = new URL('.',document.currentScript.src);

function include( src ){
  document.write("<script src=\"" + new URL(src, orig) + "\"></script>");
}


include("math/nCr.js");
include("math/random.js");
include("lib/clone/object-clone.js");

include("core/constants.js");
include("core/clone.js");
include("core/VisualNode.js");

include("scene/Object.js");
include("scene/Scene.js");
include("scene/Camera.js");

include("math/Matrix.js");
include("math/Vector.js");
include("math/Euler.js");
include("math/Shape.js");

include("core/LogNode.js");
include("core/TransformNode.js");
include("core/ForEachVertexNode.js");
include("core/ColorNode.js");
include("core/CanvasNode.js");


})();