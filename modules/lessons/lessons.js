'use strict';

angular.module('myApp.lessons', ['ngRoute', 'angularFileUpload', 'youtube-embed'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lessons', {
    templateUrl: 'modules/lessons/lessons.html',
    controller: 'ViewLessonsCtrl'
  }).when('/lessons/create', {
    templateUrl: 'modules/lessons/create.html',
    controller: 'ViewCreateLessonsCtrl'
  }).when('/lessons/create/:id', {
    templateUrl: 'modules/lessons/create.html',
    controller: 'ViewCreateLessonsCtrl'
  }).when('/lessons/create/images/:id', {
    templateUrl: 'modules/lessons/images.html',
    controller: 'ViewImagesLessonsCtrl'
  }).when('/lessons/create/imageurls/:id', {
    templateUrl: 'modules/lessons/imageurls.html',
    controller: 'ViewImagesUrlsLessonsCtrl'
  }).when('/lessons/create/youtube/:id', {
    templateUrl: 'modules/lessons/youtube.html',
    controller: 'ViewYoutubeLessonsCtrl'
  }).when('/lessons/create/links/:id', {
    templateUrl: 'modules/lessons/links.html',
    controller: 'ViewLinksLessonsCtrl'
  }).when('/lessons/my', {
    templateUrl: 'modules/lessons/my.html',
    controller: 'ViewMyLessonsCtrl'
  });
}])

.controller('ViewLessonsCtrl', ['$scope', 'dataService', function($scope, dataService) {
    //location starts
    $scope.mapOptions = {
      types: 'geocode'
    };

    $scope.details = {};
    //location ends
    
    $scope.type = 1;
    $scope.frm = {radius: 30};
    
    
  function getSuccess(response) {
      console.log('success: ', response);
      $scope.results = response.data.data.results;
      $scope.defaultImage = 'images/noimage.jpg';
      
      //getting main image
      angular.forEach(response.data.data.results, function(value, key) {
        angular.forEach(value.detailsFull.images, function(valueImg, keyImg) {
          if (!$scope.results[key].mainImage) {
            $scope.results[key].mainImage = valueImg;
          }
        });
      });
      
      console.log($scope.results);
    }
  
    function getFailure(response) {
      console.log('failure: ', response);
    }
    
    $scope.getData = function() {
      var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=getAll&showLocation=1';
      
      if ($scope.frm.keyword) {
        url = url + '&q='+encodeURIComponent($scope.frm.keyword);
      }
      
      if ($scope.location) {
        url = url + '&lat='+$scope.details.components.lat+'&lon='+$scope.details.components.lng;
        if ($scope.frm.radius) {
          url = url + '&r='+$scope.frm.radius;
        }
      }
      
      dataService.get(url, getSuccess, getFailure, true);
    };
    
    $scope.getData();
}])
.controller('ViewCreateLessonsCtrl', ['$scope', 'dataService', '$location', '$routeParams', function($scope, dataService, $location, $routeParams) {
    $scope.frmAdd = {};
    
    //location starts
    $scope.mapOptions = {
      types: 'geocode'
    };

    $scope.details = {};
    //location ends
    
    $scope.createError = null;
    
    function addSuccess(response) {
      console.log('success: ', response);
      $location.path('/lessons/create/images/'+response.data.data.id);
      $scope.frmAdd = {};
      
    }
    
    function addFailure(response) {
      console.log('failure: ', response);
    }
  
    $scope.mainDetails = function() {
      if ($routeParams.id) {
        $scope.mainDetailsUpdate();
        return;
      }
      
      console.log('insert');
      console.log($scope.frmAdd);
      console.log($scope.loggedInUsersData);
      var submitData = '';
      submitData = submitData + '&title='+encodeURIComponent($scope.frmAdd.title);
      //xtra data
      submitData = submitData + '&description='+encodeURIComponent($scope.frmAdd.description);
      //location
      submitData = submitData + '&location[latitude]='+encodeURIComponent($scope.details.components.lat);
      submitData = submitData + '&location[longitude]='+encodeURIComponent($scope.details.components.lng);
      submitData = submitData + '&location[country]='+encodeURIComponent($scope.details.components.country);
      submitData = submitData + '&location[state]='+encodeURIComponent($scope.details.components.state);
      submitData = submitData + '&location[city]='+encodeURIComponent($scope.details.components.city);
      submitData = submitData + '&location[zip]='+($scope.details.components.zip ? encodeURIComponent($scope.details.components.zip) : '');
      submitData = submitData + '&location[place_id]='+encodeURIComponent($scope.details.place_id);
      submitData = submitData + '&location[county]='+encodeURIComponent($scope.details.components.county);
      submitData = submitData + '&location[formatted_addr]='+encodeURIComponent($scope.details.formatted_address);
      
      //tags
      submitData = submitData + '&tags='+($scope.frmAdd.tags ? encodeURIComponent($scope.frmAdd.tags) : '');
      //url
      var access_token = $scope.loggedInUsersData.token;
      var path = '/manish/lessons';
      var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=add&saveIP=1&access_token='+access_token+'&path='+path;
      dataService.post(url, submitData, addSuccess, addFailure);
    };
    
    
    
    function updateSuccess(response) {
      console.log('success: ', response);
      $location.path('/lessons/create/images/'+response.data.data.id);
      
    }
    
    function updateFailure(response) {
      console.log('failure: ', response);
    }
  
    $scope.mainDetailsUpdate = function() {
      console.log('update');
      console.log($scope.frmAdd);
      console.log($scope.loggedInUsersData);
      var submitData = '';
      submitData = submitData + '&title='+encodeURIComponent($scope.frmAdd.title);
      //xtra data
      submitData = submitData + '&description='+encodeURIComponent($scope.frmAdd.description);
      //location
      submitData = submitData + '&location[latitude]='+encodeURIComponent($scope.details.components.lat);
      submitData = submitData + '&location[longitude]='+encodeURIComponent($scope.details.components.lng);
      submitData = submitData + '&location[country]='+encodeURIComponent($scope.details.components.country);
      submitData = submitData + '&location[state]='+encodeURIComponent($scope.details.components.state);
      submitData = submitData + '&location[city]='+encodeURIComponent($scope.details.components.city);
      submitData = submitData + '&location[zip]='+($scope.details.components.zip ? encodeURIComponent($scope.details.components.zip) : '');
      submitData = submitData + '&location[place_id]='+encodeURIComponent($scope.details.place_id);
      submitData = submitData + '&location[county]='+($scope.details.components.county ? encodeURIComponent($scope.details.components.county) : '');
      submitData = submitData + '&location[formatted_addr]='+encodeURIComponent($scope.details.formatted_address);
      
      //tags
      submitData = submitData + '&tags='+($scope.frmAdd.tags ? encodeURIComponent($scope.frmAdd.tags) : '');
      //url
      var access_token = $scope.loggedInUsersData.token;
      var path = '/manish/lessons';
      var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=update&saveIP=1&access_token='+access_token+'&path='+path+'&id='+$routeParams.id;
      dataService.post(url, submitData, updateSuccess, updateFailure);
    };
    
    
    function getSuccess(response) {
      console.log('success: ', response);
      $scope.frmAdd.title = response.data.data.title;
      $scope.frmAdd.description = response.data.data.description;
      $scope.details.place_id = response.data.data.location.place_id;
      $scope.details.formatted_address = response.data.data.location.formatted_addr;
      $scope.details.components = {};
      $scope.details.components.lat = response.data.data.location.latitude;
      $scope.details.components.lng = response.data.data.location.longitude;
      $scope.details.components.country = response.data.data.location.country;
      $scope.details.components.state = response.data.data.location.state;
      $scope.details.components.city = response.data.data.location.city;
      $scope.details.components.zip = response.data.data.location.zip;
      $scope.details.components.county = response.data.data.location.county;
      $scope.location = response.data.data.location.formatted_addr;
      $scope.frmAdd.tags = response.data.data.detailsFull.tagsSingle;
    }
  
    function getFailure(response) {
      console.log('failure: ', response);
    }
    
    $scope.getData = function() {
      var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=getOne&noCache=1&id='+$routeParams.id;
      dataService.get(url, getSuccess, getFailure);
    };
    
    if ($routeParams.id) {
      $scope.id = $routeParams.id;
      $scope.getData();
    }
}])
.controller('ViewImagesLessonsCtrl', ['$scope', 'dataService', '$location', '$routeParams', 'FileUploader', function($scope, dataService, $location, $routeParams, FileUploader) {
  console.log($routeParams);
  var access_token = $scope.loggedInUsersData.token;
  $scope.id = $routeParams.id;
  
  var requestUrl = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=upload&access_token='+access_token+'&id='+$routeParams.id;
  var uploader = $scope.uploader = new FileUploader({
      url: requestUrl
  });
  // FILTERS

  uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
  });

  // CALLBACKS

  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
  };
  uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
  };
  
}])
.controller('ViewImagesUrlsLessonsCtrl', ['$scope', 'dataService', '$location', '$routeParams', function($scope, dataService, $location, $routeParams) {
  console.log($routeParams);
  var access_token = $scope.loggedInUsersData.token;
  $scope.id = $routeParams.id;
  $scope.frm = {};
  $scope.imageUrls = [];
  
  function getSuccess(response) {
    console.log('success: ', response);
    
    if (response.data && response.data.data && response.data.data.detailsFull && response.data.data.detailsFull.images) {
      angular.forEach(response.data.data.detailsFull.images, function(value, key) {
        $scope.imageUrls.push(value);
      });
      console.log($scope.imageUrls);
    }
  }
  
  function getFailure(response) {
    console.log('failure: ', response);
  }
  
  $scope.getImage = function() {
    var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=getOne&noCache=1&id='+$routeParams.id;
    dataService.get(url, getSuccess, getFailure);
  };
  
  $scope.getImage();
  
  function addSuccess(response) {
    console.log('success: ', response);
    $scope.imageUrls = [];
    $scope.getImage();
    $scope.frm = {};
  }
  
  function addFailure(response) {
    console.log('failure: ', response);
  }
  
  $scope.addImage = function() {
    if (!$scope.frm.image) {
      return; 
    }
    
    
      var submitData = '';
      submitData = submitData + '&param='+encodeURIComponent($scope.frm.image);
      //url
      var access_token = $scope.loggedInUsersData.token;
      var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=updateSingle&access_token='+access_token+'&key=images&id='+$routeParams.id;
      dataService.post(url, submitData, addSuccess, addFailure);
  };
}])
.controller('ViewYoutubeLessonsCtrl', ['$scope', 'dataService', '$location', '$routeParams', function($scope, dataService, $location, $routeParams) {
  console.log($routeParams);
  var access_token = $scope.loggedInUsersData.token;
  $scope.id = $routeParams.id;
  $scope.frm = {};
  $scope.youtubeUrls = [];
  
  function getSuccess(response) {
    console.log('success: ', response);
    
    if (response.data && response.data.data && response.data.data.detailsFull && response.data.data.detailsFull.youtube) {
      angular.forEach(response.data.data.detailsFull.youtube, function(value, key) {
        $scope.youtubeUrls.push(value);
      });
      console.log($scope.youtubeUrls);
    }
  }
  
  function getFailure(response) {
    console.log('failure: ', response);
  }
  
  $scope.getYoutube = function() {
    var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=getOne&noCache=1&id='+$routeParams.id;
    dataService.get(url, getSuccess, getFailure);
  };
  
  $scope.getYoutube();
  
  function addSuccess(response) {
    console.log('success: ', response);
    $scope.youtubeUrls = [];
    $scope.getYoutube();
    $scope.frm = {};
  }
  
  function addFailure(response) {
    console.log('failure: ', response);
  }
  
  $scope.addYoutube = function() {
    if (!$scope.frm.youtube) {
      return; 
    }
    
    
      var submitData = '';
      submitData = submitData + '&param='+encodeURIComponent($scope.frm.youtube);
      //url
      var access_token = $scope.loggedInUsersData.token;
      var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=updateSingle&access_token='+access_token+'&key=youtube&id='+$routeParams.id;
      dataService.post(url, submitData, addSuccess, addFailure);
  };
}])
.controller('ViewLinksLessonsCtrl', ['$scope', 'dataService', '$location', '$routeParams', function($scope, dataService, $location, $routeParams) {
  
  console.log($routeParams);
  var access_token = $scope.loggedInUsersData.token;
  $scope.id = $routeParams.id;
  $scope.frm = {};
  $scope.linkUrls = [];
  
  function getSuccess(response) {
    console.log('success: ', response);
    
    if (response.data && response.data.data && response.data.data.detailsFull && response.data.data.detailsFull.links) {
      angular.forEach(response.data.data.detailsFull.links, function(value, key) {
        $scope.linkUrls.push(value);
      });
      console.log($scope.linkUrls);
    }
  }
  
  function getFailure(response) {
    console.log('failure: ', response);
  }
  
  $scope.getLinks = function() {
    var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=getOne&noCache=1&id='+$routeParams.id;
    dataService.get(url, getSuccess, getFailure);
  };
  
  $scope.getLinks();
  
  function addSuccess(response) {
    console.log('success: ', response);
    $scope.linkUrls = [];
    $scope.getLinks();
    $scope.frm = {};
  }
  
  function addFailure(response) {
    console.log('failure: ', response);
  }
  
  $scope.addLink = function() {
    if (!$scope.frm.linkUrl) {
      return; 
    }
    
    
      var submitData = '';
      submitData = submitData + '&param='+encodeURIComponent($scope.frm.linkUrl);
      //url
      var access_token = $scope.loggedInUsersData.token;
      var url = 'http://bootstrap.mkgalaxy.com/svnprojects/horo/records.php?action=updateSingle&access_token='+access_token+'&key=links&id='+$routeParams.id;
      dataService.post(url, submitData, addSuccess, addFailure);
  };
}])
.controller('ViewMyLessonsCtrl', ['$scope', function($scope) {
  
}]);