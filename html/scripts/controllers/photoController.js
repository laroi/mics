define(['text!../views/templates/actedUserList.html'], function (actedUserListTemplate) {
	var updatePhotoArray, 
		updateActedUsers,
		likedUsers,
		dislikedUsers,
		lovedUsers,
		crappedUsers,
		photoArray,
		postionDiv,
		comActedUserList = Handlebars.compile($(actedUserListTemplate).html());
		updatePhotoArray = function(inArray) {
			photoArray = inArray;
		};
		postionDiv = function(action){
			var offset,
			doOffset = function (){
				$('#actedUserListContainer').css('top', offset.top+20);
				$('#actedUserListContainer').css('left', offset.left);
			};
			switch (action){
				case "like" :
					offset = $('.photoBtnLikeCount').offset();
					doOffset();
					break;
				case "dislike" :
					offset = $('.photoBtnDislikeCount').offset();
					doOffset();
					break;
				case "love" :
					offset = $('.photoBtnLoveCount').offset();
					doOffset();
					break;
				case "crap" :
					offset = $('.photoBtnBullCount').offset();
					doOffset();
					break;
			}

		}
		updateActedUsers = function(action){

			var i, list = [];
			for(i = 0; i < photoArray[localStorage.selectedPhotoIndex][action].length; i += 1) {
				list.push(photoArray[localStorage.selectedPhotoIndex][action][i].user);
				//console.log(photoArray[localStorage.selectedPhotoIndex][action][i].user);
			}
			$('#actedUserListContainer').empty();
			return comActedUserList({list:list, action:action})
			
		};
		likedUsers = function(e){
			if($(e.target).hasClass('photoBtnLikeCount')){
				var retVal = updateActedUsers("likes");
				$("#actedUserListContainer").append(retVal);
				$('#actedUserListContainer').show();
				postionDiv("like");
			}
			return;
		};
		dislikedUsers = function(e){
			if($(e.target).hasClass('photoBtnDislikeCount')){
				var retVal = updateActedUsers("disLikes");
				$("#actedUserListContainer").append(retVal);
				$('#actedUserListContainer').show();
				postionDiv("dislike");
			}
			return;
		};
		lovedUsers = function(e){
			if($(e.target).hasClass('photoBtnLoveCount')){
				var retVal = updateActedUsers("loves");
				$("#actedUserListContainer").append(retVal);
				$('#actedUserListContainer').show();
				postionDiv("love");
			}
			return;
		};
		crappedUsers = function(e){
			if($(e.target).hasClass('photoBtnBullCount')){
				var retVal = updateActedUsers("craps");
				$("#actedUserListContainer").append(retVal);
				$('#actedUserListContainer').show();
				postionDiv("crap");
			}
			return;
		};


	return {
		updatePhotoArray: updatePhotoArray,
		likedUsers: likedUsers,
		dislikedUsers: dislikedUsers,
		lovedUsers: lovedUsers,
		crappedUsers: crappedUsers
	}

})