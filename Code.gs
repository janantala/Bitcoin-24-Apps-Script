var USER = "Bitcoin-24 user";
var APIKEY = "Bitcoin-24 api id"

var queryMarkets = function() {

  var response = UrlFetchApp.fetch("http://bitcoincharts.com/t/markets.json");

  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  }
  else {
    return {};
  }
}


var getUserBalance = function() {

   var payload =
   {
     "user" : USER,
     "key" : APIKEY,
     "api": "get_balance"
   };

   var options =
   {
     "method" : "post",
     "payload" : payload
   };

   var response = UrlFetchApp.fetch("https://bitcoin-24.com/api/user_api.php", options);

  
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  }
  else {
    Logger.log('return code' + response.getResponseCode());
    return null;
  }
 }


var getMarket = function(symbol, markets) {
  var found;
  markets.forEach(function(market){
    if (market.symbol == symbol) {
      found = market;
    }
  });

  return found;
}


function main(){
  
  var balance = getUserBalance();
  if (!balance) return false;

  var markets = queryMarkets();
  var btc24EUR = getMarket('btc24EUR', markets);
  
  //var btc2eur = btc24EUR.avg;
  var btc2eur = btc24EUR.ask;
  var eurBtc = balance.btc * btc2eur;
  var eurCash = balance.eur;
  
  
  var TOTAL_BTC = balance.btc;
  var TOTAL_EUR = Number(eurBtc) + Number(eurCash);
  
  Logger.log('BTC:' + ' ' + TOTAL_BTC);
  Logger.log('BTC in EUR' + ' ' + eurBtc);
  Logger.log('exchange rate' + ' ' + btc2eur);
  Logger.log('====');
  Logger.log('EUR:' + ' ' + eurCash);
  Logger.log('TOTAL EUR' + ' ' + TOTAL_EUR);
  
  addLine(TOTAL_BTC, btc2eur, TOTAL_EUR);
  
}


function addLine(btc, rate, eur) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var date = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  sheet.appendRow([date, btc, rate, eur]);
}


function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "new request",
    functionName : "main"
  }];
  sheet.addMenu("Script Menu", entries);
};

function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "new request",
    functionName : "main"
  }];
  sheet.addMenu("Script Menu", entries);
};
