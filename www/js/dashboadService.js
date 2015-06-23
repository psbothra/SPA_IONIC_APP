angular.module('starter.dashboadService', [])
.factory('DashboadService', function() {
  
  
  var getPieChartData = function(data){
	  var processed_json = new Array();
	  angular.forEach(data,function(value,index){
	   processed_json.push([value.Symbol, value.Amount]);     
	  });
	  return processed_json;
  };
  
  var getBarChartData = function(data){
	   var totalSum_Stocks = null;
	   var totalSum_MF = null;
		var totalSum_ETF = null;
		var totalSum_Commodities = null;
		var totalSum_Currencies = null;

		angular.forEach(data,function(value,index){
					if(value.Asset == "Stocks"){
						totalSum_Stocks += value.Amount;
					}
					if(value.Asset == "Mutual Fund"){
						totalSum_MF += value.Amount;
					}
					if(value.Asset == "ETF"){
						totalSum_ETF += value.Amount;
					}
					if(value.Asset == "Commodities"){
						totalSum_Commodities += value.Amount;
					}
					if(value.Asset == "Currencies"){
						totalSum_Currencies += value.Amount;
					}
			   
		});
		return {
			"totalSum_Stocks":totalSum_Stocks,
			"totalSum_MF":totalSum_MF,
			"totalSum_ETF":totalSum_ETF,
			"totalSum_Commodities":totalSum_Commodities,
			"totalSum_Currencies":totalSum_Currencies};
  };
  
   var addHistory = function(data,clientObj){
	   return null; //data.push(clientObj);
   };
   var removeHistory = function(data,id){
		return null; //data.slice(id);
   };
      
  return {
    getPieChartData: function(data) {
      return getPieChartData(data);
    },
	getBarChartData: function(data) {
      return getBarChartData(data);
    },
	addHistory: function(data,clientObj) {
      return addHistory(data,clientObj);
    },
	removeHistory: function(data,id) {
      return removeHistory(data,id);
    }
  };
});