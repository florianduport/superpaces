var Messages = angular.module('Resources',[]);

Messages.constant("RESOURCES",{
	"MESSAGES" : {
		"SUCESS_CREATE_COURSE" : "<b>Félicitations !</b> Vous avez créé une nouvelle Colle.",
		"ERROR_2" : "My error 2"
	},
	"CONFIG" : {
		//Base URLs DEV
		"BASEURL" : "177.10.0.10",
		"BASEAPIURL" : "http://177.10.0.11:1337",

		//Base URLs PROD
		/*
		"BASEURL" : "137.74.40.175",
		"BASEAPIURL" : "http://137.74.40.175:1337",
		*/

		//API Paths
		"API_AUTH_GETUSER" : "/auth/getUser",
		"API_AUTH_REGISTERUSER" : "/auth/registerUser",
		"API_AUTH_LOCAL" : "/auth/local",
		"API_AUTH_LOGOUT" : "/auth/logout",
		"API_AUTH_FACEBOOK" : "/auth/facebook",
		"API_AUTH_TWITTER" : "/auth/twitter",

		"API_COURSE_CREATE" : "/course/create",
		"API_COURSE_EDIT" : "/course?id=",
		"API_COURSE_BY_TUTOR" : "/course?tutor=",
		"API_COURSE_UPLOAD" : "/course/upload"
	}
});