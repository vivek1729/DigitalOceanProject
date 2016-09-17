app
.config(function($routeProvider) {
    var TPLSOURCE = "../templates/";
    $routeProvider
    .when("/login", {
        templateUrl : TPLSOURCE+"login.html",
        controller: 'LoginController'
    })
    .when("/bio", {
        templateUrl : TPLSOURCE+"bio.html",
        controller: 'LoginController'
    })
    .when("/app", {
        templateUrl : TPLSOURCE+"app.html",
        controller: 'AppController'
    }).
     otherwise({
      redirectTo: '/login'
   });
});