Sorting and Filtering
---------------------



* Sorting:\
For sorting users presented in the table, the UMS relies on couchDB views.\
A single view is expected for each fields that would be used for sorting.\
The expected view is characterised as follows:\

Design Document: _design/couchdb-user-management-app\
Index name: by_[FIELD NAME]\

where [FIELD_NAME] represents the name of the field.
For instance, if we were to sort by the field ROLE, a view having an index name of 
by_role is expected to be found in the design document _design/couchdb-user-management-app of the 
_users table.



