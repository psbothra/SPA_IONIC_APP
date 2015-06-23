angular.module('starter.services', [])
.service('LoginService', function($http,$q) {
	
	var loginUser = function(name, pw){ 
			var def = $q.defer();
			 //if (name == 'aa' && pw == 'aa') {
          	if (name == 'FA01' && pw == 'pass123') {
				def.resolve("Ok");
            }else{
				def.resolve("Fail");
			}
			return def.promise;
	};
	      
	return {
		loginUser: function(name, pw) {
		  return loginUser(name, pw);
		}
	};	

})

.service('ClientService', function($http,$q) {
	var getClientData = function(){ 
			var def = $q.defer();
			$http.get('data/clientdetails.json').success(function (data){
				def.resolve(data);
			});
			return def.promise;
	};
	
	var getAccountData = function(clientId){ 
			var def = $q.defer();
			$http.get('data/ac_details_'+clientId+'.json').success(function (data){
				def.resolve(data);
			});
			return def.promise;
	};
	
	var getStockData = function(account_ID){ 
			var def = $q.defer();
			if(account_ID==""){
				
			}
			else{
				$http.get('data/stock_details_'+account_ID+'.json').success(function (data){
					def.resolve(data);
				});
			}
			return def.promise;
	};
	
	var getHistoryData = function(){ 
			var def = $q.defer();
			$http.get('data/history.json').success(function (data){
				def.resolve(data);
			});
			return def.promise;
	};
	
	      
  return {
	getClientData: function() {
	  return getClientData();
	},
	getAccountData: function(clientId) {
	  return getAccountData(clientId);
	},
	getStockData: function(account_ID) {
	  return getStockData(account_ID);
	},
	getHistoryData: function() {
	  return getStockData();
	}
	
  };	
	
});
