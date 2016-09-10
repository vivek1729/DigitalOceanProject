var app = angular.module('PokeTinder', ['ngMaterial','ngRoute', 'ngMessages']);
app.run( function($rootScope, $location) {

    // register listener to watch route changes
    /*$rootScope.$on( "$locationChangeStart", function(event, next, current) {
      if ( $rootScope.loggedUser == null ) {
        // no logged user, we should be going to #login
        if ( next.templateUrl == "../templates/login.html" ) {
          // already going to #login, no redirect needed
        } else {
          // not going to #login, we should redirect now
          $location.path( "/login" );
        }
      }         
    });*/
 })
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
