var app = angular.module('myApp',['ngRoute','ngAnimate','ui.bootstrap']);

app.controller('myCtrl',function($rootScope, $scope, $uibModal, $filter, $route){
	$scope.user = 'Bruce';

	$scope.show_compose = false;
	$rootScope.show_delete = false;

	$scope.mail_data = data.Mails;
	$scope.mail_list = [];
	$scope.mail_list_type = '';


	$scope.menu_options = [{id:0,name:"Inbox"} , {id:1,name:"Sent"} , {id:2,name:"Spam"}];
	$scope.labels = [{id:0,name:"None"}, {id:1,name:"Friends"} , {id:2,name:"Family"} , {id:3,name:"Co Workers"}];

	$scope.new_name = $scope.new_subject = $scope.new_message = '';
	$scope.mail = '';

	$scope.get_mails = function(mail_type){
		if (mail_type == 'Inbox'){
			$scope.filtered_mail_data = $scope.filterMails($scope.mail_data,'reciever');
			$scope.filtered_mail_data = $scope.spamFilter($scope.filtered_mail_data, true);
		}
		else if (mail_type == 'Sent'){
			$scope.filtered_mail_data =  $scope.filterMails($scope.mail_data,'sender');
		}
		else if (mail_type == 'Spam'){
			$scope.filtered_mail_data = $scope.filterMails($scope.mail_data,'reciever');
			$scope.filtered_mail_data = $scope.spamFilter($scope.filtered_mail_data,false);
		}
		else{
			$scope.filtered_mail_data = $scope.filterMails($scope.mail_data,'reciever');
			$scope.filtered_mail_data = $scope.tagsFilter($scope.filtered_mail_data,mail_type,false);
		}
		$scope.mail_list = $scope.filtered_mail_data;
		return $scope.filtered_mail_data;
	};

	$scope.filterMails = function(arr,type){
		new_arr = [];
        angular.forEach(arr, function (item,i) {
        	flag = true;
        	if (item[type] != $scope.user)
        	{
        		flag = false;
        	}
        	if (flag)
        	{
        		new_arr.push(item);
        	}
        });
        return new_arr;
	};

	$scope.spamFilter = function(arr,flag_value){
		new_arr = [];
		angular.forEach(arr, function (item,i) {
        	flag = flag_value;
        	if (item['spam'])
        	{
        		flag = !flag;
        	}
        	if (flag)
        	{
        		new_arr.push(item);
        	}
        });
        return new_arr;
	};

	$scope.tagsFilter = function(arr, tag, flag_value){
		new_arr = [];
		angular.forEach(arr, function (item) {
			flag = flag_value;
			angular.forEach(item.tags, function(t) {  
    		if (t == tag) {
    			flag = !flag;
    		}
    		});
	    	if (flag) {
				new_arr.push(item);
	      	}
		});
		return new_arr;
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

	$rootScope.$on('send_the_mail',function(event, mail_data){
		$scope.send_mail(mail_data);
	});

	$scope.send_mail = function(mail_data){
		new_mail = {subject:mail_data[1], text:mail_data[2], sender:$scope.user, reciever:mail_data[0], spam:false, tags:[]};
		$scope.mail_data.push(new_mail);

		$scope.display_message("Message Sent Successfully.");
	};	

	$scope.cancel_mail = function(){
		$scope.show_compose = false;
	};

	$scope.delete = function(){
		for (i=0;i<$rootScope.selected_mail.length;i++)
		{
			$scope.mail_data.splice($scope.mail_data.indexOf($rootScope.selected_mail[i]),1);
			$rootScope.mail_list.splice($rootScope.mail_list.indexOf($rootScope.selected_mail[i]),1);
		}
		$rootScope.selected_mail = [];
		$rootScope.show_delete = false;
		$scope.display_message("Message Deleted Successfully.");
	};

	$rootScope.$on('Add_label',function(event, mail, label){
		if (label != 'None'){
			$scope.mail_data[$scope.mail_data.indexOf(mail)].tags.push(label);
			$scope.display_message("Message Added to "+label);
		}
	});

	$rootScope.$on('Remove_label',function(event, mail, label){
		$scope.mail_data[$scope.mail_data.indexOf(mail)].tags.splice($scope.mail_data[$scope.mail_data.indexOf(mail)].tags.indexOf(label),1);
		$scope.display_message("Message Remove from "+label);
	});

	$scope.open_compose_mail = function(){
		$uibModal.open({
			animation : true,
			templateUrl : 'compose_mail_template.html',
			controller : 'modalCtrl',
			size:'lg'
		});
	};
	$scope.open_mail_content = function(index){
		uibModalInstance = $uibModal.open({
			animation : true,
			templateUrl : 'mail_content.html',
			controller : 'mail_content_controller',
			resolve: {
				index : index,
				labels : function(){return $scope.labels;}
			}
		});

		uibModalInstance.result.then(function(){
			$route.reload();
		},
		function(){
			$route.reload();
		});
	};
	$scope.display_message = function(message){
		$uibModal.open({
			animation : true,
			templateUrl : 'message_template.html',
			controller : 'display_message_controller',
			resolve: {
				message : function(){ return message; }
			}
		});
	};
});

app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		redirectTo : "/Inbox"
	})
	.when("/Inbox",{
		templateUrl : "display_mail.html",
		controller : "show_inbox"
	})
	.when("/Sent",{
		templateUrl : "display_mail.html",
		controller : "show_sent"
	})
	.when("/Spam",{
		templateUrl : "display_mail.html",
		controller : "show_spam"
	})
	.otherwise({
		templateUrl : "display_mail.html",
		controller : "show_labels"
	});
});
app.controller("show_inbox",function($rootScope,$scope,$route){
	$rootScope.mail_list = $scope.get_mails('Inbox');
});

app.controller("show_sent",function($rootScope,$scope,$route){
	$rootScope.mail_list = $scope.get_mails('Sent');
});

app.controller("show_spam",function($rootScope,$scope,$route){
	$rootScope.mail_list = $scope.get_mails('Spam');
});

app.controller("show_labels",function($rootScope,$scope,$route, $location){
	$rootScope.mail_list = $scope.get_mails($location.path().substr(1));
});

app.controller("select_mail_list",function($rootScope,$scope,$route){
	index = $scope.menu_options.indexOf($route.current.originalPath.substr(1));
	$rootScope.mail_list = $scope.mail_data[$scope.menu_options[index]];
	$rootScope.selected_mail = [];
	$rootScope.show_delete = false;	
});

app.controller('modalCtrl',function($scope, $rootScope, $uibModalInstance, $location, $route){
	$scope.send_mail = function(){
		mail_data = [$scope.new_name, $scope.new_subject, $scope.new_message];
		$rootScope.$emit("send_the_mail",mail_data);
		$scope.close_modal()
		if ($location.path() == '/Sent') {
			$route.reload();
		}
	}
	$scope.close_modal = function(){
		$uibModalInstance.close();
	}
});

app.controller('mail_content_controller',function($scope,$rootScope,index,labels, $uibModalInstance,$route){
	$scope.mail = $rootScope.mail_list[index];
	$scope.labels = labels;
	$scope.selected_label = 'Label';

	$scope.report_spam = function(){
		$rootScope.mail_list[index].spam = true;
	};

	$scope.remove_spam = function(){
		$rootScope.mail_list[index].spam = false;
	};

	$scope.select_label = function(label){
		$scope.selected_label = label;
		$rootScope.$emit("Add_label", $scope.mail, $scope.selected_label);
	};

	$scope.remove_label = function(label){
		$rootScope.$emit("Remove_label", $scope.mail, label);
	};

	$scope.close_modal =function(){
		$uibModalInstance.close();
	}
});

app.controller('display_message_controller',function($scope, message, $uibModalInstance, $timeout){
	$scope.message = message;
	$timeout(function () {
		$uibModalInstance.close();	
	}, 2000);
});