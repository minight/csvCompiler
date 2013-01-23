//Reading this code may cause cognitive logical failure. No insurane is implied or explciitly granted
var request = require("request");
var csv = require("csv");
var fs = require("fs");
var url = require("url");

function decodeUrl(link){
    var decode = decodeURIComponent(url.parse(link).pathname);
    decode = decode.slice(decode.lastIndexOf("/") + 1);
    decode = decode.slice(0, decode.lastIndexOf("."));
    return decode;
}

function processArray(array, index, column){
//return 4;
//chosen by diceroll, guaranteed to be random
    for(i = 0; i < items.length; i++){
        var itemName = items[i];
        var calcResult;
        switch(itemName){

        }
    }
}
//used in the getFile function. To make it easier to read
//in turn created a realllly long callback chain
function pushToArray(location, url, callback){
    var csvArray = [];
    var container = [];
    csv().from(location).on('record', function(data, index){
        var container = data;
        csvArray.push(container);
    });
    csv().from(location).on('end', function(data, index){
        callback(csvArray, decodeUrl(url));
    });
}
// takes the url, reads the csv, and adds it to an array
function getFile(url, type, iterator, callback){
    switch(type){
    case 'online':
        request(url, function (error, response, body) {
            if (error) throw error;
            pushToArray(body, url, callback);
        });
        break;
    case 'local':
        pushToArray(url, url, callback);
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
    }
}
//used to fill data in columns, will fill as is in the array, so inlcude any gaps
function addColumn(fnArray, fnColumn){
    var fnCounter = 0;
    while(fnCounter <= columns.length){
        if(finalCsv[0][fnCounter] == fnColumn){
            break;
        }else{
             fnCounter++;
        }
    }  
    for(i = 0; i < fnArray.length; i++){
        finalCsv[i+1][fnCounter] = fnArray[i];
    }
}
/////////////////////////// end function declaration

//LOCATION OF FILES, UNLESS USING GOOGLE API WHICH I WILL EVENTUALLY.
var name = [    "http://syminight.com/OBS/SEM%20report.csv",
                "http://syminight.com/OBS/conversion%20funnel.csv",
                "http://syminight.com/OBS/site%20summary.csv",
                "http://syminight.com/OBS/source%20report.csv",
                "http://syminight.com/OBS/switch%20report.csv",
                "./rates.csv"];
//WHETHER THE FILE IS LOCAL OR IS ONLINE, DEFINES HOW ITS TREATED WHEN READING DATA
var type = [    "online",
                "online",
                "online",
                "online",
                "online",
                "local"];
//intializing all the static stuff
var columns = [ " ",
                "item",
                "prevDate",
                "prevPrevDate",
                "change",
                "vtb",
                "wtd",
                "ytd"];
//the item column *pardon the longass array (second column)
var items = [   "Visits", "   Paid Clicks", "   Unpaid Clicks", "Switches", "   Paid Switches", "   Unpaid Switches", "Conversion Rate", "   Paid", "   Unpaid", "eGPPS", "Gross Profit", "", "Impressions", "Clicks", "CTR", "AVG CPC", "Switches", "ConvRate", "Adj Switches", "Ad Spend", "CPA", "Total Spend", "eCPA", "", "Unique Visitors", "Page Views", "Avg. Duration", "Bounce Rate", "", "Paid Search", "Organic Search", "Email", "Direct", "Referral", "", "Alinta Energy", "Click Energy", "Energy Australia", "Australia Power & Gas", "", "NSW", "QLD", "SA", "VIC"];
//title column for the first one
var title = [];
    title[0] = "Site Stats";
    title[12] = "SEM Summary";
    title[24] = "Site Summary";
    title[29] = "Traffic Sources";
    title[35] = "Switches By";
    title[43] = "";
var fileNames = [name, type];
var outputArray = [];
var outputArrayIndex = [];
var finalCsv = [];

for(i = 0; i < name.length; i++){
    var getFileCounter = 0;
    getFile(fileNames[0][i],fileNames[1][i], i, function(array, name){
        getFileCounter++;
        outputArrayIndex.push(name);
        outputArray.push(array);
        if(getFileCounter > 5){
            // note to future suicidal programmers
            // the outputArray stored is in the following structure
            // [ [ [REPORT1 ROW 1], [REPORT1 ROW 2] ], [ [REPORT2 ROW 1], [REPORT2} ROW 2] ] ]
            // the order they are stored in is chosen by diceroll, so use outputArrayIndex for the index
            
        }
    }); // I MADE A FUNCTION IN A LOOP. WHAT ARE YOU GOING TO DO ABOUT IT
}
finalCsv.push(columns);
addToFile(title, " "); //using this different function to create all the rows to prevent type errors
addColumn(items, "item"); //all the others will use this function to append to the created rows

// console.log(finalCsv);
csv().from(finalCsv).to('output.csv');