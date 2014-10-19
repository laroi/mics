define(["controllers/requestController"],function (request){
	var requestObj = new request(null);
	var User = function(name){
		return{
			getAllUsers:function(callback){
				requestObj.getView("users/getAllUsers","photos",function(data){
					console.log(data);
					callback(data);
				});
			}
		}
	}
	return 	User;
});