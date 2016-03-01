'use strict';

angular.module('myApp.auth', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/auth/create', {
    templateUrl: 'modules/auth/auth.html',
    controller: 'ViewAuthCreateCtrl'
  })
  .when('/auth/login', {
    templateUrl: 'modules/auth/login.html',
    controller: 'ViewAuthLoginCtrl'
  })
  .when('/auth/logout', {
    templateUrl: 'modules/auth/logout.html',
    controller: 'ViewAuthLogoutCtrl'
  })
  ;
}])

.controller('ViewAuthLoginCtrl', ['$scope', 'dataService', function($scope, dataService) {
  $scope.loginError = null;
  
  $scope.frmLogin = {};
  function loginSuccess(response) {
    //console.log('success results: ', response);
    if (response.data.error === 1) {
      $scope.loginError = response.data.errorMessage;
      return;
    }
    
    $scope.loginError = "Authenticated successfully with uid:" + response.data.data.uid;
    //setting user data
    $scope.loggedInUsersData = {
      uid: response.data.data.uid,
      token: response.data.data.token,
      email: response.data.data.email,
      user_created: response.data.data.user_created,
      user_details: response.data.data.user_details,
      username: response.data.data.username,
      users_info_id: response.data.data.users_info_id,
      ref_id: response.data.data.ref_id
    };
    
    $scope.$parent.loggedInUsersData = $scope.loggedInUsersData;
    //console.log($scope.loggedInUsersData);
    //console.log($scope.$parent.loggedInUsersData);
    localStorage.setItem('userProfile', JSON.stringify($scope.loggedInUsersData));
    
    //end setting user data
    $scope.frmLogin = {};
    if(!$scope.$$phase) $scope.$apply();
  }
 
  function loginFailure(response) {
    $scope.loginError = "Login Failed! " + response.statusText;
  }
    
  $scope.loginUser = function() {
    var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/login.php?action=login&saveIP=1';
    var postData = 'username='+encodeURIComponent($scope.frmLogin.email)+'&password='+encodeURIComponent($scope.frmLogin.password);
    
    dataService.post(url, postData, loginSuccess, loginFailure);
  };
  
}])

.controller('ViewAuthCreateCtrl', ['$scope', 'dataService', function($scope, dataService) {
  //var ref = new Firebase("https://boiling-torch-3780.firebaseio.com");

  $scope.createUserError = null;

  function createUserSuccess(response) {
    //console.log('success results: ', response);
    if (response.data.error === 1) {
      $scope.createUserError = response.data.errorMessage;
      return;
    }
    
    $scope.createUserError = "Successfully created user account with uid:" + response.data.data.uid + ", email: " + response.data.data.email + ", Username: " + response.data.data.username;
    $scope.frm = {};
  }
 
  function createUserFailure(response) {
    $scope.createUserError = "Error creating user " + response.statusText;
  }
    
  $scope.createNewUser = function() {
    if ($scope.frm.confirm_password !== $scope.frm.password) {
       $scope.createUserError = 'Password does not match with confirm password. Please check again!';
       return;
    }
    
    var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/login.php?action=register&saveIP=1';
    var postData = 'email='+encodeURIComponent($scope.frm.email)+'&password='+encodeURIComponent($scope.frm.password)+'&username='+encodeURIComponent($scope.frm.username)+'&user_details[fullname]='+encodeURIComponent($scope.frm.fullname)+'&user_details[age]='+encodeURIComponent($scope.frm.age);
    
    dataService.post(url, postData, createUserSuccess, createUserFailure);
  };
  
  
}])


.controller('ViewAuthLogoutCtrl', ['$scope', 'dataService', '$location', function($scope, dataService, $location) {
  
  $scope.logoutError = null;

  function logoutSuccess(response) {
    console.log('success results: ', response);
    if (response.data.error === 1) {
      $scope.logoutError = response.data.errorMessage;
      return;
    }
    
    $scope.logoutError = "You are successfully logged out of the page";
    $scope.loggedInUsersData = null;
    $scope.$parent.loggedInUsersData = null;
    localStorage.removeItem('userProfile');
    if(!$scope.$$phase) $scope.$apply();
    $location.path('/auth/login');
  }
 
  function logoutFailure(response) {
    $scope.logoutError = "Error logging out " + response.statusText;
  }
    
  var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/login.php?action=logout&saveIP=1&uid='+$scope.loggedInUsersData.uid;
    
  dataService.get(url, logoutSuccess, logoutFailure, false);
  
}])
;