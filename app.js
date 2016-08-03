var app = angular.module('myApp',["ngRoute"]);

app.controller('myCtrl',function($scope,hexafy,$http){
	$scope.myName = '';
	$scope.list = ['Apple','Mango','Orange'];
	$scope.dict = [{'name':'asdfgh','age':25},{'name':'qwerty','age':22},{'name':'zxcvbn','age':24}];

	$scope.limit = 3;
	$scope.data_length = 0;
	
	$http({
		method : "GET",
		url : "http://www.w3schools.com/angular/customers.php"
		}).then(function Success(response){
				$scope.http_response = response.data.records;
				$scope.data_length = $scope.http_response.length;
		},function Failure(){
			$scope.http_response = 'Error loading the data!!!';
		});

	$scope.show_view = true;
	$scope.form_button = 'Hide Form';

	$scope.show_more = function(){
		$scope.limit+=3;
	}

	$scope.clear_view = function(){
		$scope.show_view = !$scope.show_view;
		if ($scope.show_view)
		{
			$scope.form_button = 'Hide Form';
		}
		else{
			$scope.form_button = 'Show Form';
		}
	}
});

app.directive('w3TestDirective',function(){
	return {
		template : '<h1> Testing Directive...</h1>'
	};
});

app.filter('Hexafy_It',['hexafy',function(hexafy){
	return function(x){
		if (!x)
		{
			console.log(!x);
			return 0;
		}
		return hexafy.fun(x);
	}
}]);

app.service('hexafy',function(){
	this.fun = function(x){
		return x.toString(16);
	}
});

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        template : ""
    })
    .when("/1", {
        templateUrl : "1.html",
        controller : "set_show_view"
    })
    .when("/2", {
        templateUrl : "2.html",
        controller : "set_show_view"
    });
});

app.controller('set_show_view',function($scope){
	$scope.show_view = true;
});