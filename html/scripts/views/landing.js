define(["text!views/templates/landingTemplate.html",
		"controllers/requestController",
		"views/createAlbum",
		"views/photo",
		"models/album",
		"./navbar"],function (landingTemplate, request, createAlbum, photo, album, navbar){
	var requestObj = new request(null),
		albumObj  = new album(null),
		albumArray = [],
		currentuser,
		updateCover,
		updatePagination,
		paginateNext,
		paginatePrev,
		currentPage = 0,
		noOfItems = 1,
		totalItems,
		comLandingTemplate = Handlebars.compile($(landingTemplate).html());
		updateCover = function (){
			$('.albumIndContainer').each(function(index, element){
				var album = $(element).attr('id'),
				html = "";
				albumObj.getThumbImagesByAlbum(album, function(error, data){
					var i;
					if(!error){
						for(i = 0; i < data.rows.length; i += 1) {
							html += "<div class='albumCoverIndCont'>";
							html += "<img src ='/photos/"+data.rows[i].id+"/"+data.rows[i].value+"' class='indCoverImg'>";
							html += "</div>";
						}
					$(element).find('.albumImgContainer').append(html);
					}

				})

			});
			
		}
		paginateNext = function(){
			var options = {
				'limit':noOfItems,
				'startkey':[new Date(albumArray[albumArray.length-1].createdTime).getTime()],
				'startkey_docid':albumArray[albumArray.length-1].id,
				'reduce':false,
				'skip':1,
				'descending': false
			}
			albumObj.getAlbumsByDate(options, function(data){
				currentPage += 1
				albumArray = data;
				console.log(data);
				$("#landingPage").empty();
				$("#landingPage").html(comLandingTemplate({ data: data}));
				if(currentPage*noOfItems >= totalItems){
					$('.nextPage').hide();
				}
				updateCover();		
			});
		

		}
		paginatePrev = function () {
			var options = {
				'limit':noOfItems,
				'startkey':[new Date(albumArray[albumArray.length-1].createdTime).getTime()],
				'startkey_docid':albumArray[albumArray.length-1].id,
				'reduce':false,
				'skip':1,
				'descending': true
			}
			albumObj.getAlbumsByDate(options, function(data){
				currentPage -= 1
				albumArray = data;
				console.log(data);
				$("#landingPage").empty();
				$("#landingPage").html(comLandingTemplate({ data: data}));
				if(currentPage === 1) {
					$('.prevPage').hide();
				}
				updateCover();		
			});

		}
		updatePagination = function () {
			getTotalCount = function (){
				var options = {
					'reduce':true,
					'group_level':0
				}
				albumObj.getAlbumsByDate(options, function(data){
					totalItems = data;
				});
			}
			getTotalCount();
			$('.prevPage').hide();
		}
			

	return{
		getLandingPage: function(user, callback){
			var options = {
				'limit':noOfItems,
				'reduce':false,
				'descending': false
			};
			localStorage.setItem('currentScreen', 'landing');
			albumObj.getAlbumsByDate(options, function(data){
				currentuser = user;
				albumArray = data;
				$("#landingPage").empty().html(comLandingTemplate({ data: data}));
				$("#loginPage").hide();
				$("#landingPage").show();
				currentPage += 1;
				updateCover();
				updatePagination();
				navbar.updateNavbar();
				callback("done");
				$("#uploadButton").live('click', function(e){
					createAlbum.getCreateAlbumPage(currentuser,function(data){

					});
				});
				$('.albumIndContainer').live('click', function(){
					localStorage.currentAlbum = $(this).attr('id');
					photo.getPhotoPage(localStorage.currentUser, localStorage.currentAlbum, function(data){
						
					});
				});
				$('.nextPage').die().live('click',paginateNext);
				$('.prevPage').die().live('click',paginatePrev);
			});
			
		},
	}	
});