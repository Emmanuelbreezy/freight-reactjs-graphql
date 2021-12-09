export function random_userId_generator() {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 5; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }

 var rescombine = 'U'+result;
   return rescombine;
}


export function random_shipmentId_generator(length:Number) {
  var result           = '';
  var characters       = '0123456789876543210';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 
 var res = 'S'+result;
   return res;
}
