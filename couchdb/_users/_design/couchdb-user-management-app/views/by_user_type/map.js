function (doc) {
  var key = '';
  if (doc.lomis_stock &&  doc.lomis_stock.mobile  && Object.keys(doc.lomis_stock.mobile).length > 0) {
    key = 'Mobile';
  }
  else if (doc.lomis_stock && doc.lomis_stock.dashboard && Object.keys(doc.lomis_stock.dashboard).length > 0) {
    key = 'Dashboard';
  }
  else {
    key = 'Unassigned';
  }
  emit(key, doc);
}
