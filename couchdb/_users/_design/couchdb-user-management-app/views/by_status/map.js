function (doc) {
  var status =  doc.status || 'inactive';
  emit(status, doc);
}
