define([
	"text!views/templates/loginTemplate.html",
	"text!views/templates/landingTemplate.html",
	"views/landing",
	"views/navbar",
	"controllers/requestController"
	], 
	function (
	loginTemplate,
	landingTemplate,
	landing,
	navbar,
	request
	) {
	var requestObj = new request(null),
		self,
		currentUser,
		comLoginTemplate = Handlebars.compile($(loginTemplate).html()),
		loginEvent,
		signUpEvent;
	loginEvent = function (inUsername, inPassword) {
				var username,
					password;
				if(inUsername && inPassword){
					username = inUsername;
					password = inPassword
				} else {
					username = $("#loginUserName").val().trim();
					password = $("#loginPassword").val().trim();
				}
				requestObj.login(username,password,function(data){
					var options = {};
					if(data === 401){
						callback(401)
					}
					else if(data.name !== null){
						options.startkey = [data.name];
                            options.endkey = [data.name];
                            requestObj.getView("getUser/byName","photos", options, function(userData){
                                currentUser = data.name;
                                localStorage.setItem('currentUser', data.name);
                                if(userData.rows && userData.rows.length > 0 && userData.rows[0].value._id) {
                                    localStorage.setItem('currentUserId', userData.rows[0].value._id);
                                }
                                landing.getLandingPage(currentUser,function(data){
                                    navbar.updateNavbar();
                                });

                            });
					} 
				});
	};
	signUpEvent = function () {
		var username,
			password;
		username = $("#signupUserName").val().trim();
		password = $("#signupPassword").val().trim();
		doc = {
			_id: "org.couchdb.user:"+username,
			name: username
		};

		requestObj.signup(doc,password,function(data){
			if(data.name !== null){
				loginEvent(username, password);
				//Success sign up
			}		
		});
	}
		
	return {
		getLoginPage : function(){
			localStorage.setItem('currentScreen', 'login');
			$("#loginPage").html(comLoginTemplate());
			$('#LoginButton').bind('click', loginEvent);
			$('#sigupButton').bind('click', signUpEvent);
		}
	}
	

	})