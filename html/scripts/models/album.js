define(["controllers/requestController"],function (request){
	var requestObj = new request(null),
		albumArray = [];
	var Album = function(name){
		return{
			id:null,
			rev:null,
			name: name || "Untitled",
			type: "PSA.Album",
			createdTime: null,
			createdBy:null,
			album:null,
			blocked:[],
			readOnly:[],
			noOfLikes:null,
			noOfComments:null,
			likes:[],
			comments:[],
			noOfPhotos:null,
			saveAlbum: function(callback){
				requestObj.saveDoc(this,"photos",function(data){
					console.log(data);
					callback(data);
				});
			},
			getAlbumsByDate:function(options, callback){
				var options = options || {};
				albumArray = [];
				requestObj.getView("getAlbums/byTime","photos",options,function(data){
					var i, albObj;
					if(options&& options.reduce){
						callback(data.rows[0].value);
						return;
					} else {
						for(i=0 ; i< data.rows.length; i++){
							albObj = new Album(null);
							albObj.id = data.rows[i].id;
							albObj.rev = data.rows[i].value.rev;
							albObj.name = data.rows[i].value.name;
							albObj.createdBy = data.rows[i].value.createdBy;
							albObj.createdTime = data.rows[i].value.createdTime;
							albObj.blocked = data.rows[i].value.blocked;
							albObj.noOfLikes = data.rows[i].value.likes;
							albObj.noOfComments = data.rows[i].value.noOfComments;
							albObj.readOnly = null,
							albumArray.push(albObj);
						}
						//console.log(data);
						callback(albumArray);
					}
				});
			},
			getAlbumsByUser:function(callback){
				requestObj.getView("getAlbums/byUser","photos",{}, function(data){
					console.log(data);
					callback(data);
				});
			},
			getAlbumsByName:function(callback){
				requestObj.getView("getAlbums/byUser","photos", {}, function(data){
					console.log(data);
					callback(data);
				});
			},
			getThumbImagesByAlbum : function(album, callback){
				var options = {
					'startkey':album,
					'endkey' : album,
					'limit': 5
				}
				requestObj.getView("getThumbnail/byAlbum","photos", options, function(data){
					callback(null, data);
				});
			}
		}
	}
	return 	Album;
});