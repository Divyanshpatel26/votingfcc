'use strict';

angular.module('pollmodule',[])

app.controller('NewPollCtrl', function($scope, AuthService, $state,PollService,$http) {
    $scope.isLoggedIn = AuthService.isAuthenticated;
    
    if(!$scope.isLoggedIn()){
        $state.go('app.login');
    }
    else{
        $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.username);
                                    $scope.poll.username=$scope.memberinfo;


  });
    $scope.poll = {"name":"","description":""};
        $scope.poll.answers = [{name: 'option1', text: 'write here the first option'},{name: 'option2', text: 'write here the second optio'}]
        
    }
    $scope.newPoll = function(){
        for(var i=0;i<$scope.poll.answers;i++){
            $scope.poll.answers[0].count = 0;
        }
        console.log($scope.poll.answers);
        PollService.newpoll($scope.poll).then(function(msg){
       alert(msg);
   }),function(errmsg){
       console.log(errmsg);
   }
    }
    
    $scope.addInput = function(){
    var n = $scope.poll.answers.length;
    for(var i=0;i<n;i++){
        if($scope.poll.answers[i].text===""){
            alert("Errore! Tutti i campi di testo devono essere valorizzati!");
            return false;
        }
        
    }
    $scope.poll.answers.push({name: 'option'+(n+1), text: ''});
   

};



});
app.controller('PollViewController',function($scope,AuthService,$stateParams,$http,PollService,ngProgressFactory){
     $scope.isLoggedIn = AuthService.isAuthenticated;
        console.log("ciao");
        $http.get("api/poll/view/"+$stateParams.id).then(function(result){
            $scope.poll = result.data;
            $scope.options = result.data[0].answers;
        })
        $scope.vota = function(){
            $http.patch("api/poll/vota/"+$stateParams.id,{"choice":$scope.choice}).then(function(result){
                console.log(result);
            })
        }
        /*User Story: As an authenticated user, I can see the aggregate results of my polls.*/
        /* User Story: As an unauthenticated or authenticated user, I can see the results of polls in chart form. 
        (This could be implemented using Chart.js or Google Charts.)*/
        /* User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.*/
         $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.series = ['Series A'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 1000]];
        $scope.condividi = function(){
            var referer = "https://votingfcc-computerluca.c9users.io/#poll/view/"+$stateParams.id;
            console.log(referer);
            window.open("https://twitter.com/intent/tweet?text=Vote my poll at "+referer);
            
        }
        
    
    
    


});
app.controller('MyCtrl',function($scope,AuthService,$state,$http,PollService,ngProgressFactory){
    $scope.isLoggedIn = AuthService.isAuthenticated;
    if(!$scope.isLoggedIn()){
        $state.go('app.login');
    }
    else{
         $scope.elimina = function(id){
             console.log(id);
      $http.delete("api/poll/"+id).then(function(result){
          console.log(result);
      });
  }
        $http.get('/authentication/memberinfo').then(function(result) {
                $scope.progressbar = ngProgressFactory.createInstance();
              $scope.progressbar.start();
              $scope.progressbar.set(0);
        $scope.memberinfo={"username":""};
        
        $scope.memberinfo.username= result.data.msg;
        console.log($scope.memberinfo);
PollService.getpolls($scope.memberinfo).then(function(msg){
       $scope.mypolls = msg;
       $scope.progressbar.complete();
       
   }),function(errmsg){
       console.log(errmsg);
   }
  });
 

    }
})
