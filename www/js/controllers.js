angular.module('starter.controllers', ['highcharts-ng'])
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};
 
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})


.controller('StockCtrl', function($scope, $http) {
    $http.get("data/stock.json")
    .success(function(response) {$scope.myData = response;});
})


.controller('ClientCtrl', function($scope, $http, $timeout) {
$scope.peopleArray = null;
$scope.Account = null;
$scope.stylePath = 'basic.css';
        $scope.changePath = function() {
            $scope.stylePath = $scope.stylePath === 'basic.css' ? 'cool.css': 'basic.css';
        };
 
$http.get('data/clientdetails.json')
    .success(function (data) {
        $scope.peopleArray = data;     
    });
  $scope.changeItem = function(iem){
       var accountVal = iem - 1;
       $scope.Account = $scope.peopleArray[accountVal].Account;
      }
      
      
  $scope.mySelections = [];
  $scope.grid = { 
    data: 'Account',
    selectedItems: $scope.mySelections,
    columnDefs: [{ field: 'Account_ID', displayName: 'Account ID'},
                 { field: 'Account_Name', displayName: 'Account Name'},
                 { field: 'Account_Value',  displayName: 'Account Value'},
                 { field: 'Available_Balance', displayName: 'Available Balance'}],
    multiSelect: false,
    beforeSelectionChange: function(row) {
      row.changed = true;
      return true;
    },
    afterSelectionChange: function (row, event) {
      if (row.changed){
        var StockVal = row.rowIndex;

         /* Added Grid for Stock on Selecting row */ 
        $scope.Stock = $scope.Account[StockVal].Stock;
        $scope.gridStock = { 
          data: 'Stock'
        };


        var processed_json = new Array();
        angular.forEach($scope.Stock,function(value,index){
           processed_json.push([value.Symbol, value.Amount]);     
        })

$scope.totalSum_Stocks = null;
$scope.totalSum_MF = null;
$scope.totalSum_ETF = null;
$scope.totalSum_Commodities = null;
$scope.totalSum_Currencies = null;

angular.forEach($scope.Stock,function(value,index){

            if(value.Asset == "Stocks"){
             $scope.totalSum_Stocks += value.Amount;
            }
            if(value.Asset == "Mutual Fund"){
             $scope.totalSum_MF += value.Amount;
            }
            if(value.Asset == "ETF"){
             $scope.totalSum_ETF += value.Amount;
            }
            if(value.Asset == "Commodities"){
             $scope.totalSum_Commodities += value.Amount;
            }
            if(value.Asset == "Currencies"){
             $scope.totalSum_Currencies += value.Amount;
            }
       
        })

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
                name: 'Market share',
                data: processed_json
            }]
        }
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
                data: [$scope.totalSum_Stocks, $scope.totalSum_MF, $scope.totalSum_ETF, $scope.totalSum_Commodities, $scope.totalSum_Currencies]
            }],
            title: {
                text: 'Distribution by Asset Type'
            }
        }
        row.changed=false;
      }
    }
  };
});
