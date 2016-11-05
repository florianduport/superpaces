var TutorCtrl = angular.module('TutorCtrl', []);


/*
 *
 * HomePage Tutor Controller
 */
TutorCtrl.controller('superpacesHomepageTutor', function($scope, $sails, $sce, RESOURCES) {

	$scope.logoutUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOGOUT);
	$scope.authFbUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_FACEBOOK);
	$scope.authTwitterUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_TWITTER);
	$scope.registerUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_REGISTERUSER);

	$sails.get(RESOURCES.CONFIG.API_AUTH_GETUSER)
		.success(function(data, status, headers, jwr) {
			$scope.user = data;
		})
		.error(function(data, status, headers, jwr) {
			console.log(data);
		});

});


/*
 *
 * Login Tutor Controller
 */
TutorCtrl.controller('superpacesTutorLogin', function($scope, $http, $sails, $location, $sce, RESOURCES) {
	$scope.loginUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOCAL);
	$scope.logoutUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOGOUT);
	$scope.authFbUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_FACEBOOK);
	$scope.authTwitterUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_TWITTER);
	$scope.registerUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_REGISTERUSER);


	$sails.get(RESOURCES.CONFIG.API_AUTH_GETUSER)
		.success(function(data, status, headers, jwr) {
			$scope.user = data;
			if ($scope.user !== undefined && $scope.user.id !== undefined) {
				$location.path('/');
			}
		})
});



/*
 *
 * Register Tutor Controller
 */
TutorCtrl.controller('superpacesTutorRegister', function($scope, $sails, $location, $sce, RESOURCES) {
	$scope.loginUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOCAL);
	$scope.logoutUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_LOGOUT);
	$scope.authFbUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_FACEBOOK);
	$scope.authTwitterUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_TWITTER);
	$scope.registerUrl = $sce.trustAsResourceUrl(RESOURCES.CONFIG.BASEAPIURL + RESOURCES.CONFIG.API_AUTH_REGISTERUSER);


	$sails.get(RESOURCES.CONFIG.API_AUTH_GETUSER)
		.success(function(data, status, headers, jwr) {
			$scope.user = data;
			if ($scope.user !== undefined && $scope.user.id !== undefined) {

				$location.path('/');
			}
		});

});