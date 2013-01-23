//Reading this code may cause cognitive logical failure. No insurane is implied or explciitly granted
var request = require("request");
var csv = require("csv");
var fs = require("fs");
var url = require("url");

function decodeUrl(link) {
    var decode = decodeURIComponent(url.parse(link).pathname);
    decode = decode.slice(decode.lastIndexOf("/") + 1);
    decode = decode.slice(0, decode.lastIndexOf("."));
    return decode;
}
function getDate(difference) {
    var today = new Date();
    var dd = today.getDate() - difference;
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    today = Date.parse(today);
    return today;
}
function calculate(date, location){
    if (!(this instanceof Lazy)) return new Lazy(em, opts);
    var self = this;
    //working on calculations
}
function processArray(array, index, column) {
//return 4;
//chosen by diceroll, guaranteed to be random
    var date;
    var resultsArray;
    switch(column){
    case 'prevDate':
        date = getDate(1);
        break;
    case 'prevPrevDate':
        date = getDate(2);
        break;
    default:
        console.log('notyetprogged');
        break;
    }
    // console.log(array);
    console.log(date);
    console.log(column);
    for(i = 0; i < items.length; i++) {
        var itemName = items[i];
        var calcResult;
        switch(itemName) {
        case 'Visits':
            console.log(itemName);
            break;
        case '   Paid Clicks':
            console.log(itemName);
            break;
        case '   Unpaid Clicks':
            console.log(itemName);
            break;
        case 'Switches':
            console.log(itemName);
            break;
        case '   Paid Switches':
            console.log(itemName);
            break;
        case '   Unpaid Switches':
            console.log(itemName);
            break;
        case 'Conversion Rate':
            console.log(itemName);
            break;
        case '   Paid':
            console.log(itemName);
            break;
        case '   Unpaid':
            console.log(itemName);
            break;
        case 'eGPPS':
            console.log(itemName);
            break;
        case 'Gross Profit':
            console.log(itemName);
            break;
        case 'Impressions':
            console.log(itemName);
            break;
        case 'Clicks':
            console.log(itemName);
            break;
        case 'CTR':
            console.log(itemName);
            break;
        case 'AVG CPC':
            console.log(itemName);
            break;
        case 'Switches':
            console.log(itemName);
            break;
        case 'ConvRate':
            console.log(itemName);
            break;
        case 'Adj Switches':
            console.log(itemName);
            break;
        case 'Ad Spend':
            console.log(itemName);
            break;
        case 'CPA':
            console.log(itemName);
            break;
        case 'Total Spend':
            console.log(itemName);
            break;
        case 'eCPA':
            console.log(itemName);
            break;
        case 'Unique Visitors':
            console.log(itemName);
            break;
        case 'Page Views':
            console.log(itemName);
            break;
        case 'Avg. Duration':
            console.log(itemName);
            break;
        case 'Bounce Rate':
            console.log(itemName);
            break;
        case 'Paid Search':
            console.log(itemName);
            break;
        case 'Organic Search':
            console.log(itemName);
            break;
        case 'Email':
            console.log(itemName);
            break;
        case 'Direct':
            console.log(itemName);
            break;
        case 'Referral':
            console.log(itemName);
            break;
        case 'Alinta Energy':
            console.log(itemName);
            break;
        case 'Click Energy':
            console.log(itemName);
            break;
        case 'Energy Australia':
            console.log(itemName);
            break;
        case 'Australia Power & Gas':
            console.log(itemName);
            break;
        case 'NSW':
            console.log(itemName);
            break;
        case 'QLD':
            console.log(itemName);
            break;
        case 'SA':
            console.log(itemName);
            break;
        case 'VIC':
            console.log(itemName);
            break;
        case "":
            console.log('SPAAAACE');
            break;
        default:
            console.log('borken' + itemName);
        }
    }
}
//used in the getFile function. To make it easier to read
//in turn created a realllly long callback chain
function pushToArray(location, url, callback) {
    var csvArray = [];
    var container = [];
    csv().from(location).on('record', function(data, index) {
        var container = data;
        csvArray.push(container);
    });
    csv().from(location).on('end', function(data, index) {
        callback(csvArray, decodeUrl(url));
    });
}
// takes the url, reads the csv, and adds it to an array
function getFile(url, type, iterator, callback) {
    switch(type) {
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
function initializeFile(array, column) {
    for(i = 0; i < array.length; i++) {
        var row = [];
        row[columns.indexOf(column)] = array[i];
        finalCsv.push(row);
    }
}
//used to fill data in columns, will fill as is in the array, so inlcude any gaps
function addColumn(array, column) {
    var counter = 0;
    while(counter <= columns.length) {
        if(finalCsv[0][counter] == column) {
            break;
        }else {
             counter++;
        }
    }
    for(i = 0; i < array.length; i++) {
        finalCsv[i+1][counter] = array[i];
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

for(i = 0; i < name.length; i++) {
    var getFileCounter = 0;
    getFile(fileNames[0][i],fileNames[1][i], i, function(array, name) {
        getFileCounter++;// using this so it executes AFTER the callback finishes
        outputArrayIndex.push(name);
        outputArray.push(array);
        if(getFileCounter > 5) {
            // note to future suicidal programmers
            // the outputArray stored is in the following structure
            // [ [ [REPORT1 ROW 1], [REPORT1 ROW 2] ], [ [REPORT2 ROW 1], [REPORT2} ROW 2] ] ]
            // the order they are stored in is chosen by diceroll, so use outputArrayIndex for the index
            // for(j = 2; j < columns.length; j++){
            for(j = 2; j < 3; j++) {
                processArray(outputArray, outputArrayIndex, columns[j]);
            }
        }
    }); // I MADE A FUNCTION IN A LOOP. WHAT ARE YOU GOING TO DO ABOUT IT
}
finalCsv.push(columns);
initializeFile(title, " "); //using this different function to create all the rows to prevent type errors
addColumn(items, "item"); //all the others will use this function to append to the created rows

// console.log(finalCsv);
csv().from(finalCsv).to('output.csv');