var app = angular.module('myApp',['ngRoute']);

app.controller('myCtrl',function($rootScope, $scope){
	$scope.show_compose = false;
	$rootScope.show_delete = false;

	$scope.mail_data = JSON.parse(data);

	$scope.menu_options = ["Inbox" , "Sent" , "Spam" , "Label"];

	$scope.new_name = $scope.new_subject = $scope.new_message = '';
	$scope.mail = '';

	$scope.open_mail = function(index){
		$scope.mail = $rootScope.mail_list[index];
	};

	$scope.close_mail = function(){
		$scope.mail = '';	
	};

	$rootScope.selected_mail = [];
	$scope.select_mail = function(index,value,$event){
		$event.stopPropagation();
		if (value)
		{
			$rootScope.selected_mail.push($rootScope.mail_list[index]);
		}
		else{
			$rootScope.selected_mail.splice($rootScope.selected_mail.indexOf($rootScope.mail_list[index]),1);
		}
		if ($rootScope.selected_mail.length != 0)
		{
			$rootScope.show_delete = true;
		}
		else{
			$rootScope.show_delete = false;
		}
	};

	$scope.show_compose_mail = function(){
		$scope.show_compose = true;
	};

	$scope.send_mail = function(){
		new_mail = {"subject":$scope.new_subject,"text":$scope.new_message,"sender":$scope.new_name};
		$scope.mail_data['Sent'].push(new_mail);
		$scope.show_compose = false;
	};	

	$scope.cancel_mail = function(){
		$scope.show_compose = false;
	};

	$scope.delete = function(){
		for (i=0;i<$rootScope.selected_mail.length;i++)
		{
			$rootScope.mail_list.splice($rootScope.mail_list.indexOf($rootScope.selected_mail[i]),1);
		}
		$rootScope.selected_mail = [];
		$rootScope.show_delete = false;	
	};
});

app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		redirectTo : "/Inbox"
	})
	.when("/Inbox",{
		templateUrl : "display_mail.html",
		controller : "select_mail_list"
	})
	.when("/Sent",{
		templateUrl : "display_mail.html",
		controller : "select_mail_list"
	})
	.when("/Spam",{
		templateUrl : "display_mail.html",
		controller : "select_mail_list"
	})
	.when("/Label",{
		templateUrl : "display_mail.html",
		controller : "select_mail_list"
	})
	.otherwise({
		templateUrl : "/error.html"
	});
});

app.controller("select_mail_list",function($rootScope,$scope,$route){
	index = $scope.menu_options.indexOf($route.current.originalPath.substr(1));
	$rootScope.mail_list = $scope.mail_data[$scope.menu_options[index]];
	$rootScope.selected_mail = [];
	$rootScope.show_delete = false;	
});