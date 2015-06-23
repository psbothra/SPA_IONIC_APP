angular.module('starter.controllers', ['highcharts-ng'])
.controller('LoginCtrl', function($scope, LoginService,DashboadService, $ionicPopup, $state) {
    $scope.data = {}; 
    $scope.login = function() {
		var promise = LoginService.loginUser($scope.data.username, $scope.data.password);
		promise.then(
			function(data) {
					if(data=="Ok"){
						$state.go('dash');
					}else{
						var alertPopup = $ionicPopup.alert({
							title: 'Login failed!',
							template: 'Please check your credentials!'
						});
					}
			}
		);
       
    }
})




.controller('ClientCtrl', function($scope, ClientService, DashboadService, $http, $timeout) {
		$scope.peopleArray = null;
		$scope.Account = null;

		// Basic Client Deatils Section
		var promiseClient = ClientService.getClientData();
		promiseClient.then(
			function(data) {
					$scope.peopleArray = data;
			}
		);
		
		$scope.getBalanceTotal = function(){
		    var totalSum_Position_Balance = null;
			angular.forEach($scope.Account,function(value,index){
							totalSum_Position_Balance += value.Position_Balance;	   
			});
			return totalSum_Position_Balance;
		}
		
		$scope.getAvailableCashTotal = function(){
		    var totalSum_Cash_Balance = null;
			angular.forEach($scope.Account,function(value,index){
							totalSum_Cash_Balance += value.Cash_Balance;	   
			});
			return totalSum_Cash_Balance;
		}

		function getAccountData(clientId){
			var promiseAc = ClientService.getAccountData(clientId);
			promiseAc.then(
				function(data) {
						 $scope.Account = data;
				}
			);
		}
		
		$scope.getStockGridData = function(index){
				var promiseStock = ClientService.getStockData(index);
				promiseStock.then(
					function(data) {
							$scope.Stock = data;	
							$scope.gridStock = {data: 'Stock'};
							plotPieChart(data);
							plotBarChart(data);
					}
				);
			}

		$scope.tabs = [{
            title: 'Instrument',
            url: 'one.tpl.html'
        }, {
            title: 'Asset Type',
            url: 'two.tpl.html'
        }];
		
		 $scope.currentTab = 'one.tpl.html';

		$scope.onClickTab = function (tab) {
			$scope.currentTab = tab.url;
		}
		
		$scope.isActiveTab = function(tabUrl) {
			return tabUrl == $scope.currentTab;
		}
	
	    
		function plotBarChart(data){
				var obj = DashboadService.getBarChartData(data);
				$scope.chartConfigBar = {
					options: {
						chart: {
							type: 'bar'
						}
					},
					legend: {
						enabled: false
					},
					  xAxis: {
						categories: ['Stocks', 'Mutual Fund', 'ETF', 'Commodities', 'Currencies']
					},
					series: [{
					   showInLegend: false, 
					   name: 'Total Amount',
						data: [obj.totalSum_Stocks, obj.totalSum_MF, obj.totalSum_ETF,obj.totalSum_Commodities, obj.totalSum_Currencies]
					}],
					title: {
						text: 'Distribution by Asset Type'
					}
				};
		}
		
		
		
		function plotPieChart(data){
			var processed_json = DashboadService.getPieChartData(data);
						
				/* Pie Chart*/
				 // Radialize the colors
				Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
					return {
						radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
						stops: [
							[0, color],
							[1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
						]
					};
				});
				$scope.chartConfig = {
						chart: {
							plotBackgroundColor: null,
							plotBorderWidth: null,
							plotShadow: false
						},
						title: {
							text: 'Distribution by Instrument'
						},
						tooltip: {
							pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
						},
						plotOptions: {
							pie: {
								allowPointSelect: true,
								cursor: 'pointer',
								dataLabels: {
									enabled: true,
									format: '<b>{point.name}</b>: {point.percentage:.1f} %',
									style: {
										color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
									},
									connectorColor: 'silver'
								}
							}
						},
						series: [{
							type: 'pie',
							name: 'Amount',
							data: processed_json
						}]
					}
						
					}
	
	
	
		
		
		
		// Account Grid Section
	  $scope.changeItem = function(iem){
		var accountVal = iem - 1;
		var clientId = $scope.peopleArray[accountVal].client_id;
		getAccountData(clientId);
      };
 
	  
	  $scope.grid = { 
		data: 'Account',
		
		multiSelect: false,
		beforeSelectionChange: function(row) {
		  row.changed = true;
		  return true;
		},
		afterSelectionChange: function (row, event) {
		  if (row.changed){
			if(row.selectionProvider.selectedItems.length >0){
					var acid = row.selectionProvider.selectedItems[0].Account_ID;
					getStockGridData(acid);
			}
			row.changed=false;
		  }
		}
	  };
  
		// Preference UI Change Section	  
		$scope.stylePath = 'basic.css';
        $scope.changePath = function() {
            $scope.stylePath = $scope.stylePath === 'basic.css' ? 'cool.css': 'basic.css';
        };

});
