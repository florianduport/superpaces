var Messages = angular.module('Resources',[]);

Messages.constant("RESOURCES",{
	"MESSAGES" : {
		"SUCCESS_CREATE_COURSE" : "<b>Félicitations !</b> Vous avez créé une nouvelle Colle.",
		"SUCCESS_UPDATE_COURSE" : "<b>Félicitations !</b> Vous avez modifié votre Colle. <a href='/#!/dashboard'>Voir mes Colles</a>",
		"UPLOAD_ERROR" : "<b>Fichier non comforme !</b><br/>Verifiez que : <br/><ul><li>La taille du fichier : < 500 Ko</li><li>Format : JPG, PNG</li></ul>",
		"ERROR_2" : "My error 2",
		"MODAL" : [
			{
				"ID" : "0",
				"TITLE" : "Confirmez la suppression",
				"MESSAGE" : "Voulez-vous vraiment supprimer cet élément ?"
			}
		]
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
		"API_COURSE_UPLOAD" : "/course/upload",


		//Other value
		"ALLOWED_FILE_TYPES" : ["image/jpeg","image/png"]
	}
});