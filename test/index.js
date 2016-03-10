(function(global){ "use strict";

global.FOUR = global.FOUR||{};

function own(obj,prop){
  return Object.prototype.hasOwnProperty.call(obj,prop);
}

global.FOUR.test = function test(){
  var succeeded = true;
  var units = test;
  var tests, name, result, e;
  var tested = 0, failed = 0;
  
  for(name in units){
    if(!own(units,name)){ continue; }
    tests = units[name];
    
    for(name in tests){
      if(!own(tests,name)){ continue; }
      
      tested++;
      
      try{
        result = tests[name]();
      }catch(e){
        result = false;
      }
      
      if(!result){
        succeeded = false; failed++;
        console.log("FOUR: "+name+" failed" + (e ? " with an error: "+e : "") );
      }
    }
  }

  if(succeeded){ console.log("FOUR: All of the "+tested+" tests returned success."); }
  else{ console.log("FOUR: "+failed+" out of "+tested+" tests failed."); }
  
  return failed;
};

})(this);