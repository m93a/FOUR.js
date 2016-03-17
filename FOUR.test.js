(function(){

function include( src ){
  document.write("<script src=\""+src+"\"></script>");
}


include("FOUR.js");

include("test/index.js");
include("test/math.js");


})();