define([
	"text!views/templates/navbarTemplate.html",
	"controllers/requestController"
	], 
	function (
	navbarTemplate,
	request
	) {
	var requestObj,
		self,
		comNavbarTemplate = Handlebars.compile($(navbarTemplate).html()),
		updateSessionValues,
		gotoLandingPage,
		gotoPhotoPage;
		updateSessionValues = function (){
			if(!localStorage.currentUser){
				$('.logout').hide();
				$('.userName').empty();
			}
		};
		gotoLandingPage = function () {
			$("#photoPage").hide();
			$("#landingPage").show();
			localStorage.setItem('currentScreen', 'landing');
			self.updateNavbar();
		};
		gotoPhotoPage = function () {
			$("#photoPage").show();
			$('#uploadPhotoPage').hide();
			localStorage.setItem('currentScreen', 'photo');
			self.updateNavbar();
		};
	return {
		updateNavbar : function(){
			$("#nav_bar").html(comNavbarTemplate({"user":localStorage.currentUser}));
			updateSessionValues();
			//logout function
			self = this;
			$('.logout').click(function(){
				$.couch.logout()
				localStorage.clear();
				setTimeout(function(){window.location.reload();}, 2000);
					
				
			})
			$('#uploadButton').css('visibility', 'hidden');
			$('#toLand').css('visibility', 'hidden');
			$('#photoUploadButton').css('visibility', 'hidden');
			if(localStorage.currentScreen === 'landing'){
				$('#uploadButton').css('visibility', 'visible');
			}
			if(localStorage.currentScreen === 'photo'){
				$('#toLand').css('visibility', 'visible');
				$('#photoUploadButton').css('visibility', 'visible');
				$('#toLand').die().live('click', gotoLandingPage);
			}
			if(localStorage.currentScreen === 'uploadPhoto'){
				$('#toLand').css('visibility', 'visible');
				$('#toLand').die().live('click', gotoPhotoPage);
			}
			
		}
	}
	

	});


			/*$('#toLand').click(function(){
					$("#photoPage").hide();
					$("#landingPage").show();
					$('.btnback').hide();
					localStorage.setItem('currentScreen', 'landing');
					navbar.updateNavbar();
				});*/