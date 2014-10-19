define(["text!views/templates/photoTemplate.html",
		"controllers/requestController",
		"controllers/photoController",
		"models/photo",
		"./uploadPhoto",
		"./navbar",],function (photoTemplate, request, photoController, photo, uploadNewPhoto, navbar){
	var requestObj = new request(null),
		photoObj  = new photo(null),
		currentuser,
		photoArray=[],
		photoIndex,
		enableAction,
		updateAction,
		updateTitleAndDesc,
		updateComments,
		getComments,
		uploadComments,
		checkHasActed,
		paginateNext,
		paginatePrev,
		updatePagination,
		currentPage = 1,
		noOfItems = 1,
		totalItems,
		comPhotoTemplate = Handlebars.compile($(photoTemplate).html());
		Handlebars.registerHelper('getPhotoImage', function(obj) {
			var result = '<img id="photoImg" src="http://'+window.location.host + '/photos/' + obj.id + '/' + obj.fileName + '" width="200" height="200"/>';
			return new Handlebars.SafeString(result);
		});
		Handlebars.registerHelper('getMainPhotoImage', function(obj) {
			var result = '<img id="photoImg" src="http://'+window.location.host + '/photos/' + obj.id + '/' + obj.fileName + '/>';
			return new Handlebars.SafeString(result);
		});

		//this function will check if the user has already done any actions on the photo, if yes
		//returns the action. otherwise null
		checkHasActed = function (callback) {
			var i, hasActed = null;
			if(photoArray[localStorage.selectedPhotoIndex].likes){
				for (i = 0; i< photoArray[localStorage.selectedPhotoIndex].likes.length; i+=1) {
					if(photoArray[localStorage.selectedPhotoIndex].likes[i].user.toLowerCase() === localStorage.currentUser.toLowerCase()){
						hasActed = "like";
						break
					}
				}
			} 
			if(photoArray[localStorage.selectedPhotoIndex].disLikes){
				for (i = 0; i< photoArray[localStorage.selectedPhotoIndex].disLikes.length; i+=1) {
					if(photoArray[localStorage.selectedPhotoIndex].disLikes[i].user.toLowerCase() === localStorage.currentUser.toLowerCase()){
						hasActed = "disLike";
						break
					}
				}
			}
			if(photoArray[localStorage.selectedPhotoIndex].loves){
				for (i = 0; i< photoArray[localStorage.selectedPhotoIndex].loves.length; i+=1) {
					if(photoArray[localStorage.selectedPhotoIndex].loves[i].user.toLowerCase() === localStorage.currentUser.toLowerCase()){
						hasActed = "love";
						break
					}
				}
			}
			if(photoArray[localStorage.selectedPhotoIndex].craps){
				for (i = 0; i< photoArray[localStorage.selectedPhotoIndex].craps.length; i+=1) {
					if(photoArray[localStorage.selectedPhotoIndex].craps[i].user.toLowerCase() === localStorage.currentUser.toLowerCase()){
						hasActed = "crap";
						break
					}
				}
			}
			callback(hasActed);
		}
		updateAction = function() {
			$('.photoBtnLikeCount').empty().append(photoArray[localStorage.selectedPhotoIndex].likes.length);
			$('.photoBtnDislikeCount').empty().append(photoArray[localStorage.selectedPhotoIndex].disLikes.length);
			$('.photoBtnLoveCount').empty().append(photoArray[localStorage.selectedPhotoIndex].loves.length);
			$('.photoBtnBullCount').empty().append(photoArray[localStorage.selectedPhotoIndex].craps.length);
		}
		updateTitleAndDesc = function () {
			$('.photoDetTitle').empty().append(photoArray[parseInt(localStorage.selectedPhotoIndex,10)].title || "");
			$('.photoDetDescription').empty().append(photoArray[parseInt(localStorage.selectedPhotoIndex,10)].description || "");
		};
		enableAction = function (){
			checkHasActed(function(hasActedData){
				var element;
				if(hasActedData !== null){
					$('.photoBtnInd').css('cursor', 'default');
					$('.photoBtnUndo').html("Undo " + hasActedData);
					$('.photoBtnUndo').show();
					if(hasActedData === "like"){
						$('.photoBtnLike').css("background-image", "url('../images/like_hvr.png')")
					}
					if(hasActedData === "disLike"){
						$('.photoBtnDislike').css("background-image", "url('../images/dislike_hvr.png')")
					}
					if(hasActedData === "love"){
						$('.photoBtnLove').css("background-image", "url('../images/love_hvr.png')")
					}
					if(hasActedData === "photoBtnBull"){
						$('.photoBtnLike').css("background-image", "url('../images/crap_hvr.png')!")
					}
				}
				else {
					$('.photoBtnInd').css('cursor', 'pointer');
					$('.photoBtnInd').live('click', function(e){
						var obj = {"user": localStorage.currentUser, "user_id": localStorage.currentUserId, "time": new Date().toISOString()},
						updatedValue;
						if($('.photoBtnLike').index(e.target) > -1){
							photoArray[localStorage.selectedPhotoIndex].likes.push(obj);
							element = $('.photoBtnLikeCount');
						}
						if($('.photoBtnDislike').index(e.target) > -1){
							photoArray[localStorage.selectedPhotoIndex].disLikes.push(obj);
							element = $('.photoBtnDislikeCount');
						}
						if($('.photoBtnLove').index(e.target) > -1){
							photoArray[localStorage.selectedPhotoIndex].loves.push(obj);
							element = $('.photoBtnLoveCount');
						}
						if($('.photoBtnBull').index(e.target) > -1){
							photoArray[localStorage.selectedPhotoIndex].craps.push(obj);
							element = $('.photoBtnBullCount');
						}
						photoArray[localStorage.selectedPhotoIndex].savePhoto(function (data){
							if(element.text()!==""){
								updatedValue = (parseInt(element.text(),10)) + 1;
								element.empty().append(updatedValue);
							}
							$('.photoBtnInd').css('cursor', 'default');
							$('.photoBtnInd').die('click');
						});

					});
				}
			})
		};

		getComments = function () {
			var html = "", i;
			html += "<div style='clear:both'></div>";
			for (i = 0; i < photoArray[localStorage.selectedPhotoIndex].comments.length; i += 1) {
				html += "<div class='indComment'>";
                html +=     "<div class='commentBy'> " + photoArray[localStorage.selectedPhotoIndex].comments[i].user+ "</div>";
                html += 	"<div style='clear:both'></div>";
                html +=     "<div class='commentText'>" + photoArray[localStorage.selectedPhotoIndex].comments[i].body+ "</div>";
                html += 	"<div style='clear:both'></div>";
                html +=     "<div class='commentTime'>" + new Date(photoArray[localStorage.selectedPhotoIndex].comments[i].createdTime).toLocaleString() + "</div>";
                html += "</div>";
			}
			return html;

        };
		updateComments = function () {
			var comments;
			$('#uploadCommentText').val("");
			if(photoArray[localStorage.selectedPhotoIndex].comments.length > 0 ){
				$('.commentsCount').empty().append(photoArray[localStorage.selectedPhotoIndex].comments.length);
				comments = getComments();
				$('.showCommentsContainer').empty().append(comments);
				$('.commentsCount').show();
				$('.showCommentsContainer').show();

			} else {
				$('.showCommentsContainer').hide();
				$('.commentsCount').hide();
			}
			return;
		}

		uploadComments = function () {
			if ($('#uploadCommentText').val().trim() !== "") {
				var commentObj = {};
				commentObj.user = localStorage.currentUser;
				commentObj.body = $('#uploadCommentText').val().trim()
				commentObj.createdTime = new Date().toISOString();
				photoArray[localStorage.selectedPhotoIndex].comments.push(commentObj);
				photoArray[localStorage.selectedPhotoIndex].savePhoto(function (savePhotoError, savePhotoData){
					if(!savePhotoError){
						updateComments();				
					}


				});
				
			}
		}
		updatePagination = function () {
			getTotalCount = function (){
				var options = {
					'startkey' : [localStorage.currentAlbum,null],
					'endkey' : [localStorage.currentAlbum,{}],
					'reduce':true,
					'group_level':1
				}
				photoObj.getAllPhotosSortedByDate(options, function(data){
					totalItems = data;
				});
			}
			getTotalCount();
			$('.photoPrevPage').hide();
		}
		paginatePrev = function () {
			var options = {
				'limit':noOfItems ,
				'endkey' : [localStorage.currentAlbum, null],
				'startkey' : [localStorage.currentAlbum, new Date(photoArray[photoArray.length - 1].createdTime).getTime()],
				'startkey_docid':photoArray[photoArray.length-1].id,
				'reduce':false,
				'skip':1,
				'descending': true
			}
			console.log("prev = > ", JSON.stringify(options));
			photoObj.getAllPhotosSortedByDate(options, function(data){
				currentPage -= 1
				photoArray = data;
				photoController.updatePhotoArray(photoArray);
				console.log(data);
				$("#photoPage").empty();
				$("#photoPage").html(comPhotoTemplate({user:localStorage.currentUser, data: photoArray}));
				if(currentPage === 1) {
					$('.photoPrevPage').hide();
				}	
			});

		}
		paginateNext = function () {
			var options = {
				'limit':noOfItems ,
				'startkey' : [localStorage.currentAlbum, new Date(photoArray[photoArray.length - 1].createdTime).getTime()],
				'endkey' : [localStorage.currentAlbum, {}],
				'startkey_docid':photoArray[photoArray.length-1].id,
				'reduce':false,
				'skip':1,
				'descending': false
			}
			//console.log("next = > ", JSON.stringify(options));
			photoObj.getAllPhotosSortedByDate(options, function(data){
				currentPage += 1
				photoArray = data;
				photoController.updatePhotoArray(photoArray);
				for (var i = 0; i < data.length; i+=1){
					console.log(data[i].createdTime);
				}
				$("#photoPage").empty();
				$("#photoPage").html(comPhotoTemplate({user:localStorage.currentUser, data: photoArray}));
				if(currentPage*noOfItems >= totalItems){
					$('.photoNextPage').hide();
				}
			});

		}
	return{
		getPhotoPage: function(user, album, callback){
			var options = {};
				options.startkey = [album,null];
				options.endkey = [album,{}];
				options.reduce = false;
				options.limit = noOfItems;
			photoObj.getAllPhotosSortedByDate(options, function(data){
				currentuser = user;
				photoArray = data;
				photoController.updatePhotoArray(photoArray);
				currentPage = 1;
				for (var i = 0; i < data.length; i+=1){
					console.log(data[i].createdTime);
				}
				$("#photoPage").empty();
				$("#photoPage").html(comPhotoTemplate({user:user, data: photoArray}));
				$("#landingPage").hide();
				$("#photoPage").show();
				localStorage.setItem('currentScreen', 'photo');
				updatePagination();
				navbar.updateNavbar();
				console.log(photoArray[0]);
				//$(".photoIndContainer").css('background-image','url(http://'+window.location.host+'/photos/'+data[0].id+'/'+data[0].fileName+')')
				/*$('#toLand').click(function(){
					$("#photoPage").hide();
					$("#landingPage").show();
					$('.btnback').hide();
					localStorage.setItem('currentScreen', 'landing');
					navbar.updateNavbar();
				});*/

				$('.photoNextPage').die().live('click', paginateNext)
				$('.photoPrevPage').die().live('click', paginatePrev)

				$('.photoIndContainer').live('click', function(e){
					if($('img').index(e.target) > -1){
						$('.overlay').show();
						$('.photoDetailsContainer').show();
						photoIndex = $(this).attr('id');
						localStorage.setItem('selectedPhotoIndex', photoIndex);
						console.log(photoIndex);
						var result = '<img class="ind_images" src=\"http://'+window.location.host + '/photos/' + photoArray[photoIndex].id + '/' + photoArray[photoIndex].fileName + '\"/>';
						$('.photo').empty();
						$('.photo').append(result);
						updateTitleAndDesc();
						updateAction();
						enableAction();
						updateComments();
						$('#uploadCommentButton').unbind().bind('click',uploadComments);

						
					}
					

				});
				$('.photoDetIndCont').live('click', function(e){

					if($('.showFullScreen').index(e.target) > -1){
						var result = '<img class="full_image" src=\"http://'+window.location.host + '/photos/' + photoArray[parseInt(localStorage.selectedPhotoIndex,10)].id + '/' + photoArray[parseInt(localStorage.selectedPhotoIndex,10)].fileName + '\"/>';
						var close_btn = "<div class='close_btn icons'></div>";
						$('.photoFullScreen').empty();
						$('.photoFullScreen').append(result);
						$('.photoFullScreen').after(close_btn);
						$('.photoDetIndCont').parent().hide();
						$('.photoFullScreen').show();
						$('.full_image').load(function(){
							$('.overlay').css('height',$('.full_image').css('height'));
						});
						$('.close_btn').click(function(){
							$('.photoDetIndCont').parent().show();
							$('.photoFullScreen').hide();
							$(this).hide();
						})
				  		
					}
					else if( $('.close').index(e.target) > -1){
						$(this).parent().hide();
						$('.overlay').hide();
					}
					else if($('.showNext').index(e.target) > -1){
						var newPhotoIndex = (parseInt(localStorage.selectedPhotoIndex,10))+1;
						if(newPhotoIndex < photoArray.length){
							localStorage.setItem('selectedPhotoIndex',newPhotoIndex)
							var result = '<img class="ind_images" src=\"http://'+window.location.host + '/photos/' + photoArray[newPhotoIndex].id + '/' + photoArray[newPhotoIndex].fileName + '\"/>';
							$('.photo').empty();
							$('.photo').append(result);
							updateAction();
							enableAction();
							updateTitleAndDesc();
							updateComments();
						}
					}
					else if($('.showPrev').index(e.target) > -1){
						var newPhotoIndex = (parseInt(localStorage.selectedPhotoIndex,10))-1;
						if(newPhotoIndex >= 0){
							localStorage.setItem('selectedPhotoIndex',newPhotoIndex)
							var result = '<img class="ind_images" src=\"http://'+window.location.host + '/photos/' + photoArray[newPhotoIndex].id + '/' + photoArray[newPhotoIndex].fileName + '\"/>';
							$('.photo').empty();
							$('.photo').append(result);
							updateAction();
							enableAction();
							updateTitleAndDesc();
							updateComments();
						}
					}
				});
				$("#photoUploadButton").live('click', function(){
					uploadNewPhoto.getUploadPage();
				});
				$(".photoBtnLikeCount").die().live('click', photoController.likedUsers)
				$(".photoBtnDislikeCount").die().live('click', photoController.dislikedUsers)
				$(".photoBtnLoveCount").die().live('click', photoController.lovedUsers)
				$(".photoBtnBullCount").die().live('click', photoController.crappedUsers)
				$('body').click(function(){
					$("#actedUserListContainer").hide();
				});
				
				
			});
			
		},
	}	
});