var request = require("request");
var csv = require("csv");
var fs = require("fs");
//fetch the file from the net via http request
function stripSpace(url){
    url = url.substr(25);
    url = url.replace("%20", "");
    return url;
}
function getFile(url, type){
    switch(type){
        case 'online':
            request(url, function (error, response, body) {
                if (error) throw error;
                csv().from(body).to(fs.createWriteStream("./output/" +stripSpace(url)));
                //console.log('loggedonline');
            });
            break;
        case 'local':
            csv().from(url).to(fs.createWriteStream("./output/" + url));
                //console.log('logged offline');
            break;
        default:
            console.log('somethng went wrong' + url + " " + type);
    }
}
function addToFile(array, colName){
    for(i = 0; i < array.length; i++){
        var row = [];
        row[columns.indexOf(colName)] = array[i];
        finalCsv.push(row);
    }
    row.splice();
}


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
for(i = 0; i < name.length; i++){
    getFile(fileNames[0][i],fileNames[1][i]);
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
var items = [   "Visits", "   Paid Clicks", "   Unpaid Clicks", "Switches", "   Paid Switches", "   Unpaid Switches", "Conversion Rate", "   Paid", "   Unpaid", "eGPPS", "Gross Profit", "", "Impressions", "Clicks", "CTR", "AVG CPC", "Switches", "ConvRate", "Adj Switches", "Ad Spend", "CPA", "Total Spend", "eCPA", "", "Unique Visitors", "Page Views", "Avg. Duration", "Bounce Rate", "", "Paid Search", "Organic Search", "Email", "Direct", "Referral", "", "Alinta Energy", "Click Energy", "Energy Australia", "Australia Power & Gas", "", "NSW", "QLD", "SA", "VIC"];
var title = [' '];
    title[0] = "Site Stats";
    title[14] = "SEM Summary";
    title[26] = "Site Summary";
    title[30] = "Traffic Sources";
    title[37] = "Switches By";
addToFile(title, " ");
addToFile(items, "item");

csv().from(finalCsv).to('output.csv');