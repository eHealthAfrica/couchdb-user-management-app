function (doc, req) {

  var getValues =  function (object) {
    var keys =  Object.keys(object);
    var values = [];
    for (var i in keys) {
      var value =  object[keys[i]];
      if ( typeof(value) ===  'object') {
        values = values.concat( getValues(value));
      }else{
        values.push(String(value));
      }
    }
    return values;
  }

  var docValues = getValues(doc);
  for (var i in docValues) {
    if (docValues[i].indexOf(req) > -1) {
      return true;
    }
  }

  return false;
}
