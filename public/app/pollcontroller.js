'use strict';

angular.module('pollmodule',[])

app.controller('AllPollsController', function($scope, AuthService, $state,PollService,$http) {
    $scope.polls =[];

    $http.get("/api/poll/get").then(function(result){
        $scope.polls = result.data.msg;
    });
    
    
    
    
});

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
            alert("Errore! All text fields need to be valued!");
            return false;
        }
        
    }
    $scope.poll.answers.push({name: 'option'+(n+1), text: ''});
   

};



});
app.controller('PollViewController',function($scope,AuthService,$stateParams,$http,PollService,ngProgressFactory){
                $scope.new_option = "";

     $scope.isLoggedIn = AuthService.isAuthenticated;
        $http.get("api/poll/view/"+$stateParams.id).then(function(result){
            $scope.poll = result.data;
            $scope.options = result.data[0].answers;
        })
        $scope.vota = function(){
            if(!$scope.choice){
                alert("Error! You have to choose an option!")
            }
            else{
            $http.patch("api/poll/vota/"+$stateParams.id,{"choice":$scope.choice}).then(function(result){
                alert("Poll voted successfully. You can see the result of the poll updated");
                $scope.view_poll_results();
            })
            }
        }
        /*User Story: As an authenticated user, I can see the aggregate results of my polls.*/
        /* User Story: As an unauthenticated or authenticated user, I can see the results of polls in chart form. 
        (This could be implemented using Chart.js or Google Charts.)*/
        /* User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.*/
        $scope.view_poll_results = function(){
        $http.get("api/poll/view/"+$stateParams.id).then(function(result){
            $scope.poll = result.data;
            $scope.options = result.data[0].answers;
            $scope.series = ['Number of votes'];
            $scope.labels = [];
        $scope.data = [];
        for(var i=0;i<$scope.options.length;i++){
            $scope.labels.push($scope.options[i].text);
            $scope.data.push(parseInt($scope.options[i].count));
        }

        });
        
        }

        $scope.view_poll_results();

        $scope.condividi = function(){
            var referer = "https://votingfcc-computerluca.c9users.io/#poll/view/"+$stateParams.id;
            console.log(referer);
            window.open("https://twitter.com/intent/tweet?text=Vote me "+referer);
            
        }
        $scope.add_option = function(){
            $scope.visible = true;
            
        }
        $scope.confirm_new_option = function(){
            
            var n = $scope.options.length;
            console.log($scope.new_option);
            var obj_add = {name: 'option'+(n+1), text:$scope.new_option};
    $scope.options.push(obj_add);
    $http.patch("/api/poll/addoption/"+$stateParams.id,{"option":obj_add}).then(function(result){
        alert("Option added correctly! You can now use this option to vote the poll");
        $scope.view_poll_results();
        $scope.visible=false;
    });
        }
    
    


});
app.controller('MyCtrl',function($scope,AuthService,$state,$http,PollService,ngProgressFactory){
    $scope.isLoggedIn = AuthService.isAuthenticated;
    if(!$scope.isLoggedIn()){
        $state.go('app.login');
    }
    else{
        $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.memberinfo);
  });
         $scope.elimina = function(id){
             console.log(id);
      $http.delete("api/poll/"+id).then(function(result){
           PollService.getpolls($scope.memberinfo).then(function(msg){
       $scope.mypolls = msg;
       $scope.progressbar.complete();
       
   }),function(errmsg){
       console.log(errmsg);
   }
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
