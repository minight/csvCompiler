var request = require("request");
var csv = require("csv");
var fs = require("fs");
    
function stripSpace(url){
    url = url.substr(25);
    url = url.replace("%20", "");
    return url;
}

function processArray(array, testType){
//return 4;
//chosen by diceroll, guaranteed to be random
}

function getFile(url, type, iterator){
// takes the url, reads the csv, and adds it to an array.
    var container = [];
    container[0] = stripSpace(url);
    var tempArray = [];
    switch(type){
        case 'online':
            request(url, function (error, response, body) {
                if (error) throw error;
                // csv().from(body).to(fs.createWriteStream("./output/" +stripSpace(url)));
                csv().from(body).on('record', function(data, index){
                    var iterator = data;
                    iterator.unshift(index);
                    container.push(iterator);
                });
                csv().from(body).on('end', function(data, index){
                    csvArray.push(container);
                    fs.writeFile("result.txt", csvArray, function(err){
                        if (err) throw err;
                        console.log("Its Saved... Hopefully");
                    });
                });
            });
            break;
        case 'local':
            break;
        default:
            console.log('somethng went wrong' + url + " " + type);
    }
}
//addToFile used to intialize the finalCsv array, so you dont get undefined rows
function addToFile(fnArray, fnColName){
    for(i = 0; i < fnArray.length; i++){
        var row = [];
        row[columns.indexOf(fnColName)] = fnArray[i];
        finalCsv.push(row);
        console.log(fnArray[i] + " index: " + i);
    }
}
//used to fill data in columns, will fill as is in the array, so inlcude any gaps
function addColumn(fnArray, fnColumn){
    var fnCounter = 0;
    while(fnCounter <= columns.length){
        if(finalCsv[0][fnCounter] == fnColumn){
            break;
        }else{
            // console.log(finalCsv[0][fnCounter]);
            fnCounter++;
        }
    }  
    // console.log(fnCounter); 
    for(i = 0; i < fnArray.length; i++){
        // console.log("value: " + fnArray[i] + " iterator: " + i);
        finalCsv[i+1][fnCounter] = fnArray[i];
    }
}
/////////////////////////// end function declaration

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
var csvArray = []; //this array intialized for the following loop
var fileNames = [name, type];
for(i = 0; i < name.length; i++){
    getFile(fileNames[0][i],fileNames[1][i], i);
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
    title[12] = "SEM Summary";
    title[24] = "Site Summary";
    title[29] = "Traffic Sources";
    title[35] = "Switches By";
    title[43] = "";
addToFile(title, " "); //using this different function to create all the rows to prevent type errors
addColumn(items, "item"); //all the others will use this function to append to the created rows

console.log(finalCsv);
csv().from(finalCsv).to('output.csv');