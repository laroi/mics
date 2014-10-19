define([], function () {
	var requestController = function(database){
		var getDoc, 
			saveDoc,
			getView,
			login,
			signup,
			db,
			getSession,
			upload;
		if(database) {
			
		}
		return{
			getDoc : function(doc_id, database, callback){
				db = $.couch.db(database);
				db.openDoc(doc_id, {
				    success: function(data) {
				        if(typeof callback === "function"){
				        	callback(data);
				        }
				    },
				    error: function(status) {
				        console.log(status);
				    }
				});
			},
			saveDoc : function(doc, database, callback){
				db = $.couch.db(database);
				db.saveDoc(doc, {
				    success: function(data) {
				        if(typeof callback === "function"){
				        	callback(data);
				        }
				    },
				    error: function(status) {
				        console.log(status);
				    }
				});
			},
			getView : function(viewName, database, options, callback){
				db = $.couch.db(database);
				options.success = function(data) {
				        if(typeof callback === "function"){
				        	callback(data);
				        }
				    };
				options.error =  function(status) {
				        console.log(status);
				    },
				db.view(viewName, options);
			},
			login : function(username, password, callback){
				$.couch.login({
				    name: username,
				    password: password,
				    success: function(data) {
				        if(typeof callback === "function"){
				        	callback(data);
				        }
				    },
				    error: function(status) {
				        callback(status);
				    }
				});
			},
			signup: function(doc, password, callback){
				var self = this;
				console.log(self);
				$.couch.signup(doc, password, {
				    success: function(data) {
				    	var userDoc = {};
				    	userDoc.name = doc.name;
				    	userDoc.type = "PSA.User";
				    	self.saveDoc(userDoc, "photos", function (saveUserDocData){
				    		if(typeof callback === "function"){
								callback(data);
					        }
				    	});
				         
				    },
				    error: function(status) {
				        console.log(status);
				    }
				});
			},
			getSession: function(callback){
				$.couch.session({
				    success: function(data) {
				        if(typeof callback === "function"){
				        	callback(data);
				        }
				    }
				});
			},
			upload:function (id, rev, file, url, callback) {
                var name = encodeURIComponent(file.name),
                type = file.type,
                fileReader = new FileReader();
                
                var putRequest = new XMLHttpRequest();
	
                putRequest.open('PUT', url +
                        encodeURIComponent(id) + '/' +
                        name + '?rev=' + rev, true);     
                putRequest.setRequestHeader('Content-Type', type);
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = function (readerEvent) {
                    putRequest.send(readerEvent.target.result);
                };
                putRequest.onreadystatechange = function (response) {
                    if (putRequest.readyState === 4) {
                        console.log(name, "uploaded")
                        callback(undefined, response);
                    }
                };
            }

		}
	}
	return requestController

})