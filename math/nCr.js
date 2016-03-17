//http://stackoverflow.com/a/11809815/1137334

Math.nCr = function nCr(n,r){
  
  if(r>n/2) r = n - r;
  var result = 1;
  
  for(var i=1; i<=r; i++){
    result *= n - r + i;
    result /= i;
  }
  
  return result;
  
}