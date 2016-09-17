app
.controller('AppController',['$scope', '$http', '$rootScope','$location', function($scope, $http, $rootScope, $location){
	$scope.counter = 0;
	$scope.prospectsLength = 0;
	$scope.prospect = null;
	$scope.initProspects = function(){
		$http.post("http://localhost:3000/users/nearby/30", JSON.stringify($rootScope.loggedUser))
		.then(function successCallback(response) {
			if(response.data.status === "success")
		    	{ 
		    		$rootScope.prospects = response.data.result;
		    		$scope.prospectsLength = $rootScope.prospects.length;
		    		$scope.prospect = $rootScope.prospects[0];
		    		console.log($scope.prospectsLength);
		    		console.log($rootScope.prospects);
		    		console.log($scope.count);

		    	}
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	}
	$scope.initProspects(); //Call init function

	$scope.nextProspect = function(){
		$scope.counter = $scope.counter + 1;
		$scope.prospect = $rootScope.prospects[$scope.counter];
	};

	$scope.roundDistance = function(x){
		return Math.round(x);
	}
}]);
