'use strict';

angular.module('usermodule',[])


    app.controller('IndexController', ['$translate', '$scope','AuthService','$http','$state', function ($translate, $scope,AuthService,$http,$state) {
    
     $scope.memberinfo="";
      $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
      };
       $scope.isLoggedIn = AuthService.isAuthenticated;
       $scope.logout=AuthService.logout;
       
    
    if(!($scope.isLoggedIn())){
			$state.go("app.login");
		
	}
    }]);


app.controller('LoginCtrl', function($scope, AuthService, $state,$http) {
  $scope.user = {
    name: '',
    password: ''
  };
  $scope.login=function(){
	  AuthService.login($scope.user)
	  .then(function(msg) {
 $http.get('/memberinfo').then(function(result) {
     console.log("merda");
      $scope.memberinfo = result.data.msg;
  });
  
      }, function(errMsg) {
      alert(errMsg);
	 
});
    if(AuthService.isAuthenticated()){
        console.log('ciao');
    }

  
}
});
 
app.controller('RegisterCtrl', function($scope, AuthService, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
    if(AuthService.isAuthenticated()){
      $state.go('app');
    }
  $scope.signup = function() {
    AuthService.register($scope.user)
     .then(function(msg) {
		alert("Effettua il login ora per accedere ai contenuti del sito");
	  $state.go('app.login');
  }), function(errMsg) {
      alert("Registration failed"+errMsg);
	}
};
});
 

