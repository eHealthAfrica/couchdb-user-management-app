function (doc) {

  var key = "admin-level:unassigned";

  if (doc.lomis_stock && doc.lomis_stock.mobile && Object.keys(doc.lomis_stock.mobile).length > 0) {
    key = "admin-level:facility";
  }
  else if (doc.lomis_stock && doc.lomis_stock.dashboard) {
    key = doc.lomis_stock.dashboard.access.level;
  }
  emit(key, doc);
}
