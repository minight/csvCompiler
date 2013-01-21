var request = require("request");
var csv = require("csv");
var fs = require("fs");
//fetch the file from the net via http request
function stripSpace(url){
    url = url.substr(25);
    url = url.replace("%20", "");
    return url;
}
// function processArray() YOU"RE UP TO HERE
function getFile(url, type, index1){
    csvArray = [];
    switch(type){
        case 'online':
            request(url, function (error, response, body) {
                if (error) throw error;
                // csv().from(body).to(fs.createWriteStream("./output/" +stripSpace(url)));
                csv().from(body).on('record', function(data, index){
                    var index1 = [index, data];
                    csvArray.push(index1);    
                });
                csv().from(body).on('end', function(data, index){
                    // console.log(csvArray);
                    return csvArray;
                });
            });
            break;
        case 'local':
            break;
        default:
            console.log('somethng went wrong' + url + " " + type);
    }
}
///////////////////////////

var name = [    "http://syminight.com/OBS/SEM%20report.csv",
                "http://syminight.com/OBS/conversion%20funnel.csv",
                "http://syminight.com/OBS/site%20summary.csv",
                "http://syminight.com/OBS/source%20report.csv",
                "http://syminight.com/OBS/switch%20report.csv",
                "./rates.csv"];
var type = [    "online",
                "online",
                "online",
                "online",
                "online",
                "local"];
var fileNames = [name, type];
for(i = 0; i < 1; i++){
    var csvReturn = [i];
    csvReturn[i] = getFile(fileNames[0][i],fileNames[1][i], i);
}

var finalCsv = [];
//intializing all the static stuff
var columns = [ " ",
                "item", 
                "prevDate", 
                "prevPrevDate",
                "change",
                "vtb",
                "wtd",
                "ytd"];
finalCsv.push(columns);
//the item column *pardon the longass array
/*var items = [   "Visits", "   Paid Clicks", "   Unpaid Clicks", "Switches", "   Paid Switches", "   Unpaid Switches", "Conversion Rate", "   Paid", "   Unpaid", "eGPPS", "Gross Profit", "", "Impressions", "Clicks", "CTR", "AVG CPC", "Switches", "ConvRate", "Adj Switches", "Ad Spend", "CPA", "Total Spend", "eCPA", "", "Unique Visitors", "Page Views", "Avg. Duration", "Bounce Rate", "", "Paid Search", "Organic Search", "Email", "Direct", "Referral", "", "Alinta Energy", "Click Energy", "Energy Australia", "Australia Power & Gas", "", "NSW", "QLD", "SA", "VIC"];
var title = [' '];
    title[0] = "Site Stats";
    title[14] = "SEM Summary";
    title[26] = "Site Summary";
    title[30] = "Traffic Sources";
    title[37] = "Switches By";
addToFile(title, " ");
addToFile(items, "item");*/

csv().from(finalCsv).to('output.csv');