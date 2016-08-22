'use strict';

angular.module('usermodule',[])


    app.controller('IndexController', ['$translate', '$scope','AuthService','$http','$state', function ($translate, $scope,AuthService,$http,$state) {
    
     $scope.memberinfo="";
      $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
      };
       $scope.isLoggedIn = AuthService.isAuthenticated;
       $scope.logout=AuthService.logout;
       if($scope.isLoggedIn()){
       $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.memberinfo);
  });
       }
   
    }]);


app.controller('LoginCtrl', function($scope, AuthService, $state,$http) {
  $scope.user = {
    name: '',
    password: ''
  };
    $scope.isLoggedIn = AuthService.isAuthenticated;
       
    
    if(($scope.isLoggedIn())){
			$state.go("app.my");
			
	 $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.memberinfo);
  });
	}
	$scope.logout=function(){
	         AuthService.logout;
	         $state.go("/");

	}
  $scope.login=function(){
    
	  AuthService.login($scope.user)
	  .then(function(msg) {
 $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.memberinfo);
      $state.go("app.my");
  });
  
      }, function(errMsg) {
      alert(errMsg);
	 
});
    

  
}
});
 
app.controller('RegisterCtrl', function($scope, AuthService, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
  if(AuthService.isAuthenticated()){
      $state.go('app.my');
    }
  $scope.signup = function() {
    AuthService.register($scope.user)
     .then(function(msg) {
		alert("Effettua il login ora per accedere ai contenuti del sito");
	  $state.go('app.login');
  }), function(errMsg) {
    console.log(errMsg);
	}
};
});
 

