app
.controller('AppController',['$scope', '$http', '$rootScope','$location', function($scope, $http, $rootScope, $location){
	$scope.initProspects = function(){
		$http.post("http://localhost:3000/users/nearby/30", JSON.stringify($rootScope.loggedUser))
		.then(function successCallback(response) {
			if(response.data.status === "success")
		    	console.log(response.data.result);
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	}
	$scope.initProspects(); //Call init function
}]);
