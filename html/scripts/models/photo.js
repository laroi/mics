define(["controllers/requestController"],function (request){
	var requestObj = new request(null),
		photoArray = [],
		getAllPhotosSortedByDate,
		savePhoto;
	var Photo = function(name){
		return{
			id:null,
			_rev:null,
			_attachments:{},
			title:null,
			album:null,
			fileName:null,
			createdBy:null,
			createdTime:null,
			description:null,
			comments:[],
//			actions:[],
			blocked:[],
			readOnly:[],
			type: "PSA.Photo",
			//Photo List Functions
			getAllPhotosSortedByDate : function(options, callback){
				requestObj.getView("getPhotos/byDate","photos", options, function(data){
					if(options&& options.reduce){
						callback(data.rows[0].value);
						return;
					} 
					var i, photoObj;
					photoArray = [];
					for(i=0 ; i< data.rows.length; i++){
						photoObj = new Photo(null);
						photoObj.id = data.rows[i].id || null;
						photoObj._rev = data.rows[i].value._rev || null;
						photoObj.title = data.rows[i].value.title|| null;
						photoObj._attachments = data.rows[i].value._attachments|| {};
						photoObj.fileName = data.rows[i].value.fileName|| null;
						photoObj.album = data.rows[i].value.album|| null;
						photoObj.createdBy = data.rows[i].value.createdBy|| null;
						photoObj.createdTime = data.rows[i].key[1]|| null;
						if(data.rows[i].value.actions){
							photoObj.likes = data.rows[i].value.actions[0].likes|| [];
							photoObj.disLikes = data.rows[i].value.actions[1].disLikes|| [];
							photoObj.loves = data.rows[i].value.actions[2].loves || [];
							photoObj.craps = data.rows[i].value.actions[3].craps || [];
						}
						photoObj.blocked = data.rows[i].value.blocked || [];
						photoObj.comments = data.rows[i].value.comments || [];
						photoObj.readOnly = data.rows[i].value.readOnly || null;
						photoArray.push(photoObj);
					}
					//console.log(data);
					callback(photoArray);
				});
			},
			savePhoto: function (callback) {
				self= this;
				var xhr;
				 doc = {
                        _id : this.id || undefined,
                        _rev: this._rev || undefined,
                        _attachments: this._attachments || undefined,
                        title: this.title,
                        fileName: this.fileName,
                        createdBy: this.createdBy,
                        createdTime: this.createdTime,
                        description: this.description,
                        album : this.album,
                        comments: this.comments,
                        blocked: this.blocked,
                        readOnly: this.readOnly,
						actions:[{"likes": this.likes},{"disLikes": this.disLikes},{"loves": this.loves},{"craps": this.craps}],
                        type: this.type
                    };


                $.couch.db("photos").saveDoc(doc, { 
                    success : function (data) {
                        if (typeof callback === "function") {
                            self._rev = data.rev;
                            callback(undefined, data);
                            
                        }
                    },
                    error : function (data) {
                    	callback(data, undefined);
                    }
                });
			}, 
			getAllPhotosSortedByUser : function(album, callback){

			},
			getAllPhotosSortedByTitle : function(album, callback){

			},
			filterByDate : function(date, album, callback){

			},
			filterByUser : function(user, album, callback){

			},
			//Photo Detail Function
			getPhotoDetail: function(obj, callback){
				
			}
		}
	}
	return 	Photo;
});
