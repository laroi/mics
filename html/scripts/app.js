/*jslint browser:true, sloppy:true, nomen:true, devel:true*/
/*globals requirejs, pp, $*/

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: "scripts",
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
//        "jquery": "http://code.jquery.com/jquery-1.9.1.min",
    //"jquery": "lib/jquery-1.9.1.js",      
//        "couch": "http://" + document.location.host + "/_utils/script/jquery.couch",
        "lib": "lib",
        "text":"lib/text"
        //http://localhost:5984/nl_interactiveblueprints_version3_demo/_design/app/controller/admin_controller.js
        //"couch": "http://192.168.1.90:5984/_utils/script/jquery.couch"  // FIXME: point this to the right location on deployment
    }//,

});
requirejs(["views/login",
            "views/signup",
            "views/landing",
            "views/navbar",
            "controllers/requestController"], 
function (login, signup, landing, navbar, request) {
    var requestObj = new request( null),
        currentUser;
    $("document").ready(function(){
        
        requestObj.getSession(function(sessionData){
                if(sessionData.userCtx.name === null){
                    localStorage.clear();
                    login.getLoginPage();            
                }
                else{
                    currentUser = sessionData.userCtx;
                    landing.getLandingPage(currentUser,function(data){
                        navbar.updateNavbar();
                    });
                }
                navbar.updateNavbar();
            })
        
    });
})