var request = require("request");
var csv = require('csv');
csv().from.stream(request("http://syminight.com/OBS/site%20summary.csv")).on('record', function (data, index) {
console.log('#'+index+' '+JSON.stringify(data));
});