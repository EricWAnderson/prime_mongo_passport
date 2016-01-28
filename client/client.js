var app = angular.module('myApp', []);

app.controller('myController', ['$scope', 'myService', function($scope, myService){
    $scope.data = myService.data;
    myService.user();
}]);

app.factory('myService', ['$http', function($http){
    var data = {};

    data.hello = 'hello world';

    var user = function(){
      console.log('the function is firing!');
      $http.get('/getUser').then(function(response){
        console.log('we got a response, folks:', response);
        data.users = response.data;
      })
    }

    return {
        user: user,
        data: data
    }
}]);
