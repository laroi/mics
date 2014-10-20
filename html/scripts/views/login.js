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
		validateUser,
		validatePassword,
		signUpEvent;
		validateUser = function(user){
			if(user.length < 3) {
				return false;
			}
			return true;
		};
		validatePassword = function(password) {
			if(password.length ===0 || password.length < 6) {
				return false;
			} 
			return true;
		}
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
		if(!validateUser(username)) {
			alert ("Invalid User name");
			return false;
		}
		if(!validatePassword(password)) {
			alert ("Invalid password");
			return false;
		}
		doc = {
			_id: "org.couchdb.user:"+username,
			name: username
		};

		requestObj.signup(doc,password,function(data){
			if(data.name && data.name !== null){
				loginEvent(username, password);
				//Success sign up
			} else if (data = 409) {
				alert("User name exists");
			} else {
				alert("some error has happened");
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