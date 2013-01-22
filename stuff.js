//Reading this code may cause cognitive logical failure. No insurane is implied or explciitly granted
var request = require("request");
var csv = require("csv");
var fs = require("fs");
    
function stripSpace(url){
    url = url.substr(25);
    url = url.replace("%20", "");
    return url;
}

function processArray(array, column){
//return 4;
//chosen by diceroll, guaranteed to be random
    for(i = 0; i < items.length; i++){
        var itemName = items[i];
        var calcResult;
        switch(itemName){
            
        }
    }
}

function getFile(url, type, iterator, callback){
// takes the url, reads the csv, and adds it to an array.
    var csvArray = []; 
    var container = [];
    switch(type){
        case 'online':
            request(url, function (error, response, body) {
                if (error) throw error;
                // csv().from(body).to(fs.createWriteStream("./output/" +stripSpace(url)));
                csv().from(body).on('record', function(data, index){
                    var container = data;
                    csvArray.push(container);
                });
                csv().from(body).on('end', function(data, index){
                    callback(csvArray);
                    fs.writeFile("result.txt", csvArray, function(err){
                        if (err) throw err;
                        // console.log("Its Saved... Hopefully");
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
function addToFile(fnArray, fnColumn){
    for(i = 0; i < fnArray.length; i++){
        var row = [];
        row[columns.indexOf(fnColumn)] = fnArray[i];
        finalCsv.push(row);
        // console.log(fnArray[i] + " index: " + i);
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
var fileNames = [name, type];
outputArray = [];
for(i = 0; i < name.length; i++){
    var getFileCounter = 0;
    getFile(fileNames[0][i],fileNames[1][i], i, function(array){
        // console.log("\nyes\n"  + array);
        getFileCounter++;
        outputArray.push(array);
        console.log(getFileCounter);
        if(getFileCounter >= 5){
            console.log(outputArray);
        }
    });
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
//the item column *pardon the longass array (second column)
var items = [   "Visits", "   Paid Clicks", "   Unpaid Clicks", "Switches", "   Paid Switches", "   Unpaid Switches", "Conversion Rate", "   Paid", "   Unpaid", "eGPPS", "Gross Profit", "", "Impressions", "Clicks", "CTR", "AVG CPC", "Switches", "ConvRate", "Adj Switches", "Ad Spend", "CPA", "Total Spend", "eCPA", "", "Unique Visitors", "Page Views", "Avg. Duration", "Bounce Rate", "", "Paid Search", "Organic Search", "Email", "Direct", "Referral", "", "Alinta Energy", "Click Energy", "Energy Australia", "Australia Power & Gas", "", "NSW", "QLD", "SA", "VIC"];
//title column for the first one
var title = [' '];
    title[0] = "Site Stats";
    title[12] = "SEM Summary";
    title[24] = "Site Summary";
    title[29] = "Traffic Sources";
    title[35] = "Switches By";
    title[43] = "";
addToFile(title, " "); //using this different function to create all the rows to prevent type errors
addColumn(items, "item"); //all the others will use this function to append to the created rows

// console.log(finalCsv);
csv().from(finalCsv).to('output.csv');