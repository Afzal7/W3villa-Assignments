var app = angular.module('myApp',['ngRoute']);

app.controller('myCtrl',function($rootScope, $scope){
	$scope.show_compose = false;
	$scope.show_delete = false;

	$scope.mail_data = JSON.parse(data);

	$scope.menu_options = ["Inbox" , "Sent" , "Spam" , "Label"];

	$scope.new_name = $scope.new_subject = $scope.new_message = '';
	$scope.mail = '';

	selected_mail_index = '';

	$scope.open_mail = function(index){
		$scope.mail = $rootScope.mail_list[index];
	};

	$scope.close_mail = function(){
		$scope.mail = '';	
	};

	$scope.select_mail = function(index, $event){
		$event.stopPropagation();
		
		$scope.show_delete = !$scope.show_delete;

		if (!$scope.show_delete){
			selected_mail_index = index;
		}
		else{
			selected_mail_index = '';
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
		/*if (selected_mail_index>-1){
			$rootScope.mail_list.splice(selected_mail_index,1);
			selected_mail_index = '';
			$scope.show_delete = false;	
		}*/
		var a = [];
		angular.forEach($rootScope.mail_list, function(mail){
			if ($rootScope.isChecked(mail))
			{
				a.push(mail);
			}
		});
		console.log(a);
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
	selected_mail_index = '';
	$scope.show_delete = false;	
});