define(["text!views/templates/uploadPhotoTemplate.html", "controllers/requestController", "models/photo", './navbar'],function (uploadPhotoTemplate,request, photoModel, navbar){
	var requestObj = new request(null);
	return{
		getUploadPage: function(callback){
			imgArray = [];
			var	comUploadPhotoTemplate = Handlebars.compile($(uploadPhotoTemplate).html()),
				doc,
				delImg,
				updateDescription,
				updateTitle;
				localStorage.setItem('currentScreen', 'uploadPhoto');
				navbar.updateNavbar();
				delImg = function () {
					var index;
					$(".del_img").live('click', function () {
						index = $(this).parent().attr('data-index');
						imgArray.splice([index - 1], 1);
						$(this).parent().remove(); 

					});
				}
				updateTitle = function () {
					var index;
					$('.img_title').find('input').live('blur', function () {
						index = parseInt($(this).parent().parent().attr('data-index'),10);
						imgArray[index - 1].title = $(this).val();
					});
				}
				updateDescription = function () {
					var index;
					$('.img_desc').find('textarea').live('blur', function () {
						index = parseInt($(this).parent().parent().attr('data-index'),10);
						imgArray[index - 1].description = $(this).val();
					});
				}
			$("#uploadPhotoPage").empty();
			$("#uploadPhotoPage").html(comUploadPhotoTemplate);
			$("#photoPage").hide()
			$("#uploadPhotoPage").show();

			$("#btnCancel").click(function(){
				imgArray = [];
				$("#photoPage").show();
				$("#uploadPhotoPage").hide();

			});

			$("#imgUpload").change(function(e){
				if(typeof FileReader == "undefined") return true;
				$('.fileListCont').empty();
			    var elem = $(this);
			    var files = e.target.files;
			    $(".fileList").css('display', 'inline-block');
			    for (var i=0, file; file=files[i]; i++) {
			        if (file.type.match('image.*')) {
			            var reader = new FileReader();
			            reader.onload = (function(theFile) {
			            	var file = theFile;
			                return function(e) {
			                	var image = e.target.result;
			                	var obj = {};
			                	obj.image = image;
			                	obj.name = file.name;
			                	obj.type = file.type;
			                	imgArray.push(obj);
			                    var html =  "<div class='ind_img_cont' data-index='" + imgArray.length + "' data-name='" +file.name + "'>";
			                    html += 		"<div class='del_img'></div>";
			                    html +=     	"<div class='ind_img'>";
			                   	html +=     		"<img class = 'ind_img' src = '"+image+"'/>";
			                   	html +=     	"</div>";
			                   	html +=     	"<div class='img_title'>";
			                   	html +=				"<input type='text'>";
			                   	html +=     	"</div>";
			                   	html +=     	"<div class='img_desc'>";
			                   	html +=				"<textarea></textarea>";
			                   	html +=     	"</div>";
			                	html +=     "</div>";
			                	$('.fileListCont').append(html);
			                };
			            })(file);
			            reader.readAsDataURL(file);
			        }
			    }
			    updateTitle();
			    updateDescription();
			    delImg();
			});

			$("#uploadMore").change(function(e){
				if(typeof FileReader == "undefined") return true;
			    var elem = $(this);
			    var files = e.target.files;
			    for (var i=0, file; file=files[i]; i++) {
			    	console.log(file);
			        if (file.type.match('image.*')) {
			            var reader = new FileReader();
			            reader.onload = (function(theFile) {
			            	var file = theFile;
			                return function(e) {
			                	var image = e.target.result;
			                	var obj = {};
			                	obj.image = image;
			                	obj.name = file.name;
			                	obj.type = file.type;
			                	imgArray.push(obj);
			                    var html =  "<div class='ind_img_cont' data-index='" + (imgArray.length) + "'' data-name = '" + file.name + "''>";
			                    html += 		"<div class='del_img'></div>";		
			                    html +=     	"<div class='ind_img'>";
			                   	html +=     		"<img class = 'ind_img' src = '"+image+"'/>";
			                   	html +=     	"</div>";
			                   	html +=     	"<div class='img_title'>";
			                   	html +=				"<input type='text'>";
			                   	html +=     	"</div>";
			                   	html +=     	"<div class='img_desc'>";
			                   	html +=				"<textarea></textarea>";
			                   	html +=     	"</div>";
			                	html +=     "</div>";
			                	$('.fileListCont').append(html);
			                };
			            })(file);
			            reader.readAsDataURL(file);
			        }
			    }
			    delImg();
			});
			var upload = function (files, id, rev, url,callback) {
				var file = files.shift();
	            uploadatt(id, rev, file[0], url, function(data){
					if(files.length>0){
						upload(files,id,data.rev,url,function(data){});
					}
					if(files.length === 0){
						callback(data);
					}
				});
            }
			$("#btnUpload").click(function(){
				var i;
				for (i = 0; i < imgArray.length; i += 1) {
					var photoObj;
					photoObj = new photoModel(null);
					photoObj.title = imgArray[i].title;
					photoObj.fileName = imgArray[i].name;
					photoObj.createdBy = localStorage.currentUser;
					photoObj.createdTime = new Date().toISOString();
					photoObj.description = imgArray[i].description;
					photoObj._attachments[imgArray[i].name] = {  // Set the correct content-type and add the base64 data.
                        "content_type": imgArray[i].type,
                        "data": imgArray[i].image.substr(23)
                    };
                    photoObj.album = localStorage.currentAlbum;
					photoObj.savePhoto(function(error,data){
						console.log(data);
					});
				}
				
				
			});
		}
	}	
});