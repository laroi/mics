define(["text!views/templates/signupTemplate.html","controllers/requestController"],function (signupTemplate,request){
	var requestObj = new request(null);
	return{
		getSignupPage: function(callback){
			var	username,
				password,
				comSignupTemplate = Handlebars.compile($(signupTemplate).html()),
				doc;
			$("#loginPage").hide();
			$("#signinPage").html(comSignupTemplate());
			$('#sigupButton').click(function(){
				username = $("#signupUserName").val().trim();
				password = $("#signupPassword").val().trim();
				doc = {
					_id: "org.couchdb.user:"+username,
					name: username
    			};

				requestObj.signup(doc,password,function(data){
					if(data.name !== null){
						if(typeof callback === "function"){
							callback(0);
						}
					}		
				});
			});
		},
	}	
});