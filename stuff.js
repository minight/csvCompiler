var request = require("request");
request("http://syminight.com/OBS/site%20summary.csv", function (error, response) {
if (error) throw error;
	console.log(response.data) 
});