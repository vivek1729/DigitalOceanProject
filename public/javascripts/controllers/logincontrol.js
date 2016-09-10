app
.controller('LoginController',['$scope', '$http', '$rootScope','$location', function($scope, $http, $rootScope, $location){
	$scope.username = "";
	$scope.password = "";
	$scope.addInfo = {gender:null,pref:null,bio:null};
	$scope.initMap = function(){
		// Try HTML5 geolocation.
	  if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      $scope.pos = {
	      	type:"coords",
	        coords: {latitude: position.coords.latitude,longitude: position.coords.longitude}
	      };
	      console.log($scope.pos);
	    }, function() {
	      console.error("Couldn't load location for some reason");
	    });
	  }
	};


	$scope.attemptLogin = function(){
		var data_obj = {username: $scope.username, password: $scope.password, position: $scope.pos};
		var payload = JSON.stringify(data_obj);
		//Do a post request and send payload
		$http.post("http://localhost:3000/users/login", payload)
		.then(function successCallback(response) {
			if(response.data.status === "success")
		    	$rootScope.loggedUser = response.data.profile;
		    //If gender and bio not set redirect to complete login page else
		    if(!response.data.hasOwnProperty("gender"))
        		$location.path( "/bio" );
        	//Otherwise redirect to the app home page
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });

	};
	$scope.setGender = function(gender){
		$scope.addInfo.gender = gender;
	};
	$scope.setPreference = function(pref){
		$scope.addInfo.pref = pref;
	};
	$scope.signup = function(){
		$rootScope.loggedUser.gender = $scope.addInfo.gender;
		$rootScope.loggedUser.pref = $scope.addInfo.pref;
		$rootScope.loggedUser.bio = $scope.addInfo.bio;
		console.log($rootScope.loggedUser);
		$http.post("http://localhost:3000/users/completeProfile", JSON.stringify($rootScope.loggedUser))
		.then(function successCallback(response) {
			if(response.data.status === "success")
		    	console.log("Yeppa!!");
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		//One can now send this data to server to complete login Flow.
	};
	$scope.initMap(); //Get locations here :)
}]);