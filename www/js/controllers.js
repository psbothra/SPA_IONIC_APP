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

.controller('ClientCtrl', function($scope, $http) {


function rowTemplate() {
    return
    { 
        var stockVal = row.entity.widgets;
        $scope.Stock = row.entity.Stock[stockVal];
    }
  }

  $scope.waiting = 'Double click on any row to seed the row data';

  $http.get('data/clientdetails.json')
    .success(function (data) {
        $scope.peopleArray = data;
     
       $scope.changeItem = function(iem){
       var accountVal = iem - 1;
       $scope.Account = $scope.peopleArray[accountVal].Account;
       $scope.Account.forEach( function(row, index) {
        row.widgets = index % 10;
        }); 
      }

      $scope.rowDblClick = function( row, index) {
        console.log("test");
        var stockVal = row.entity.widgets;
        $scope.Stock = row.entity.Stock[stockVal];
      };
    });


  $scope.gridOptions = {
    enableRowSelection: true,
    rowTemplate: rowTemplate(),
    data: 'Account',
    columnDefs: [
      { name: 'Account ID' },
      { name: 'Account Name' },
      { name: 'Account Value' },
      { name: 'Available Balance' }
      
    ]
  };
  $scope.gridOptionStock = {
    enableRowSelection: true,
    data: 'Stock',
    columnDefs: [
      { name: 'Symbol' },
      { name: 'Price' },
      { name: 'Qty' },
      { name: 'Amount' }
      
    ]
  };
})


.controller('piechartCtrl', function($scope) {
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
            text: ''
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
            data: [
                ['Account 1',   45.0],
                ['Account 2',   26.8],
                ['Account 3',   12.8],
                ['Account 4',    8.5],
                ['Account 5',    6.2],
                ['Account 6',    0.7]
            ]
        }]
    }
})
;
