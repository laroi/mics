define(["text!views/templates/createAlbumTemplate.html","controllers/requestController",
	"models/album"],function (createAlbum,request,album){
	var requestObj = new request(null),
	comCreateTemplate = Handlebars.compile($(createAlbum).html());
	return{
		getCreateAlbumPage: function(user, callback){
			$("#createAlbumPage").html(comCreateTemplate({user:user}));
			$("#loginPage").hide();
			$("#createAlbumPage").show();
			$("#landingPage").hide();
			localStorage.setItem('currentScreen', 'createAlbum');
			$("#toLandFromCreateAlbum").click(function(){
				$("#createAlbumPage").hide();
				$("#landingPage").show();
			})
			$("#CreateAlbumButton").click(function(){
				var name = $("#albumTitleText").val().trim(),
					dt   = new Date();
				objAlbum = new album(name);
				objAlbum.createdTime = dt.toISOString();
				objAlbum.createdBy = user.name;
				objAlbum.saveAlbum(function(data){
					console.log("done");
				});
			})
			$('#cancel').click(function () {
				$('#createAlbumPage').hide();
				$('#landingPage').show();
				localStorage.setItem('currentScreen', 'landing');
			});
		},
	}	
});