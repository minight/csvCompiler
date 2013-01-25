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
function getDate(difference, day) {
    //i now realise this function is wrong... HOWEVER becaues everything is based
    //off this function, its all relatively correct. so it still pulls the correct 
    //results... SO YOU TOUCH IT. AND THE SERVER MELTS
    var today;
    if(day){
        today = new Date(day);
    }else { 
        today = new Date();
    }
    var dd = today.getDate() - difference;
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + "-" + mm + "-" + dd + " Z";
    today = parse(today);
    return today;
}
function parse(str, special) {
    var date;
    if(special){
        date = getDate(0, str);
    }else {
        if(!/^(\d){8}$/.test(str)){
            var string = str.split('-');
            str = string.join('');
        }
        var y = str.substr(0,4),
            m = str.substr(4,2),
            d = str.substr(6,2);
        date = new Date(y,m,d);
        date = Date.parse(date+ ' Z');
    }
    return date;
}
function calculate(array){
    //this array will give you cancer. definitely.
    var self = this;
    function sum(start, end, location, column, comp1){
        // console.log(start,end);
        // comp1 is for comparison between two vals.
        var cur = start;
        var counter = 0;
        var counter2 = 0;
        var avgCounter = 0;
        var answer = 0;
        var returnArray = [];
        // console.log("location: " + location, "column: " + column);
        while(counter <= columns.length) {
            if(outputArrayIndex[counter] == location) {
                break;
            }else {
                 counter++;
            }
        }
        // console.log(location, outputArray[counter]);
        if(comp1){
            // console.log("COMP1");
            // console.log(outputArray[counter]);
            counter2 = 7;
            while(cur <= end){
                counter2= 7;
                while(counter2 <= (outputArray[counter].length-1)){
                    if(parse(outputArray[counter][counter2][0]) == cur && outputArray[counter][counter2][1] == comp1){
                        answer += Number(outputArray[counter][counter2][column]);
                        // console.log("answer: " + answer);
                        avgCounter++;
                    }
                    counter2++;
                }
                cur += 86400000;
            }
        }else {
            switch(location){
                // switch is used to change how many lines to skip (counter2) incase google anal. adds comment lines that will fsu.
                case 'conversion funnel':
                case 'site summary':
                case 'source report':
                    while(cur <= end){
                        // console.log(avgCounter, cur);
                        //console.log(parse(outputArray[counter][counter2][0]), outputArray[counter][counter2][0]);
                        //console.log(cur, outputArray[counter][counter2][column]);
                        counter2= 7;
                        while(counter2 <= (outputArray[counter].length-1)){
                            if(parse(outputArray[counter][counter2][0]) == cur){
                                answer += Number(outputArray[counter][counter2][column]);
                                // console.log("answer: " + answer);
                                avgCounter++;
                            }
                            counter2++;
                        }
                        cur += 86400000;
                    }
                    break;
                case 'SEM report':
                    while(cur <= end){
                        // console.log(avgCounter, cur);
                        //console.log(parse(outputArray[counter][counter2][0]), outputArray[counter][counter2][0]);
                        //console.log(cur, outputArray[counter][counter2][column]);
                        counter2= 1;
                        while(counter2 <= (outputArray[counter].length-1)){
                            if(parse(outputArray[counter][counter2][0]) == cur){
                                answer += Number(outputArray[counter][counter2][column]);
                                // console.log("answer: " + answer);
                                avgCounter++;
                            }
                            counter2++;
                        }
                        cur += 86400000;
                    }
                    break;
                default:
            }
            // console.log("hi" + outputArray[counter][counter2]);
        }
        returnArray.push(answer, avgCounter);
        // console.log(returnArray);
        return returnArray;
    }
    //i split count and self.count because i thought i could use it for countsum. turns out i cant.
    function count(location, date, val, col, special){
        var counter = 0;
        var counter2 = 1;
        var answer = 0;
        while(counter <= columns.length) {
            if(outputArrayIndex[counter] == location) {
                break;
            }else {
                 counter++;
            }
        }
        if(special){
            while(counter2 <= (outputArray[counter].length - 3)){
                if(parse(outputArray[counter][counter2][1], "1") == date && parse(outputArray[counter][counter2][col]) == val){
                    answer++;
                    counter2++;
                }else {
                    counter2++;
                }
            }
        }else {
            while(counter2 <= (outputArray[counter].length - 3)){
                if(parse(outputArray[counter][counter2][1], "1") == date && outputArray[counter][counter2][col] == val){
                    answer++;
                    counter2++;
                }else {
                    counter2++;
                }
            }
        }
        return answer;
    }
    self.count = function(location, date, val, col, special){
        if(special){
            answer = count(location, date, val, col, special);
        }else {
            answer = count(location, date, val, col);
        }
        return answer;
    };
    //fetches a value thats matched against a single field(date) or multiple (comp1). res1 is the column number or its position in the array.
    self.fetch = function(location, date, comp1, res1){
        var counter = 0;
        var counter2 = 0;
        var answer = 0;
        while(counter <= columns.length) {
            if(outputArrayIndex[counter] == location) {
                break;
            }else {
                 counter++;
            }
        }
        if(comp1){
            // console.log(outputArray[counter]);
            counter2 = 7;
            while(counter2 <= outputArray[counter].length -2){
                if(parse(outputArray[counter][counter2][0]) == date && outputArray[counter][counter2][1] == comp1){
                    answer = outputArray[counter][counter2][res1];
                    break;
                }else {
                    counter2++;
                    // console.log(outputArray[counter][counter2]);
                }
            }
        }else {
            switch(location){
                // switch is used to change how many lines to skip (counter2) incase google anal. adds comment lines that will fsu.
                case 'conversion funnel':
                case 'site summary':
                case 'source report':
                    counter2 = 7;
                    while(counter2 <= outputArray[counter].length){
                        // console.log(outputArray[counter][counter2][0]);
                        if(parse(outputArray[counter][counter2][0]) == date){
                            answer = outputArray[counter][counter2][res1];
                            break;
                        }else {
                            counter2++;
                        }
                    }
                    break;
                case 'SEM report':
                    counter2 = 1;
                    while(counter2 < outputArray[counter].length){
                        if(parse(outputArray[counter][counter2][0]) == date){
                            answer = outputArray[counter][counter2][res1];
                            break;
                        }else {
                            counter2++;
                        }
                    }
                    break;
                default:
            }
        }
        return answer;
    };
    self.sum = function(start,end,location,column,comp1){
        result = sum(start,end,location,column,comp1);
        return result[0];
    };
    self.average = function(start,end,location,column,comp1){
        result = sum(start,end,location,column,comp1);
        answer = result[0] / result[1];
        return answer;
    };
    self.countSum = function(start, end, location, column, val, special){
        var cur = start;
        var counter = 0;
        var counter2 = 0;
        var avgCounter = 0;
        var answer = 0;
        var returnArray = [];
        // console.log("location: " + location, "column: " + column);
        while(counter <= columns.length) {
            if(outputArrayIndex[counter] == location) {
                break;
            }else {
                 counter++;
            }
        }
        while(cur <= end){
                if(special){
                    answer += Number(count(location, cur, cur, column, special));
                }else {
                    answer += Number(count(location,cur,val, column));
                    // console.log(Number(count(location,cur,val, column)));
                }
            cur += 86400000;
        }
        return answer;
               // console.log("hi" + outputArray[counter][counter2]);
    };
    //working on calculations
}
function processArray(array, index, column) {
//return 4;
//chosen by diceroll, guaranteed to be random
    var date;
    var calcType;
    var resultsArray = [];
    // here we get which column it is, thereby defining what date we're using or whether its calculated or not. (wtd/ytd)
    switch(column){
    case 'prevDate':
        //change to 1 because you want yesterdays stats not todays or maybe tomorrows
        date = getDate(7);
        break;
    case 'prevPrevDate':
        //change to prev + 1
        date = getDate(8);
        break;
    case 'change':
        calcType = "diff";
        break;
    case 'wtd':
        calcType = "wtd";
        break;
    default:
        console.log('notyetprogged');
        break;
    }
    // console.log(date);
    // initalize the class used for calculations
    var stuff = new calculate(array);
    if(date != null){
        for(i = 0; i < items.length; i++) {
            var itemName = items[i];
            var calcResult;
            switch(itemName) {
            case 'Visits':
            case 'Unique Visitors':
                calcResult = stuff.fetch('site summary', date, '', 1);
                break;
            case '   Unpaid Clicks':
                calcResult = stuff.fetch('site summary', date, '', 2) - stuff.fetch('SEM report', date, '', 2);
                break;
            case 'Switches':
                calcResult = stuff.count('switch report', date, date, 2, "maybe");
                break;
            case '   Unpaid Switches':
                calcResult = stuff.count('switch report', date, date, 2, "maybe") - stuff.fetch('SEM report', date, '', 15);
                break;
            case 'Conversion Rate':
                calcResult = ( (stuff.fetch('SEM report', date, '', 7)) + ((stuff.count('switch report', date, date, 2) - stuff.fetch('SEM report', date, '', 15)) / (stuff.fetch('site summary', date, '', 2) - stuff.fetch('SEM report', date, '', 2))  )   ) / 2;
                break;
            case '   Unpaid':
                calcResult = ((stuff.count('switch report', date, date, 2, "HERPDERP") - stuff.fetch('SEM report', date, '', 15)) / (stuff.fetch('site summary', date, '', 2) - stuff.fetch('SEM report', date, '', 2)));
                break;
            case 'eGPPS':
                calcResult = "";
                break;
            case 'Gross Profit':
                calcResult = "";
                break;
            case 'Impressions':
                calcResult = stuff.fetch('SEM report', date, '', 1);
                break;
            case '   Paid Clicks':
            case 'Clicks':
                calcResult = stuff.fetch('SEM report', date, '', 2);
                break;
            case 'CTR':
                calcResult = stuff.fetch('SEM report', date, '', 3);
                break;
            case 'AVG CPC':
                calcResult = stuff.fetch('SEM report', date, '', 4);
                break;
            case '   Paid Switches':
            case 'SwitchesSEM':
                calcResult = stuff.fetch('SEM report', date, '', 15);
                break;
            case '   Paid':
            case 'ConvRate':
                calcResult = stuff.fetch('SEM report', date, '', 7);
                break;
            case 'Adj Switches':
                calcResult = stuff.fetch('SEM report', date, '', 15) * 0.8;
                break;
            case 'Ad Spend':
                calcResult = stuff.fetch('SEM report', date, '', 6);
                break;
            case 'CPA':
                calcResult = (stuff.fetch('SEM report', date, '', 8) / stuff.fetch('SEM report', date, '', 15));
                break;
            case 'Total Spend':
                calcResult = "";
                break;
            case 'eCPA':
                calcResult = "";
                break;
            case 'Page Views':
                calcResult = stuff.fetch('site summary', date, '', 2);
                break;
            case 'Avg. Duration':
                calcResult = stuff.fetch('site summary', date, '', 3);
                break;
            case 'Bounce Rate':
                calcResult = stuff.fetch('site summary', date, '', 4);
                break;
            case 'Paid Search':
                calcResult = stuff.fetch('source report', date, 'paid', 2);
                break;
            case 'Organic Search':
                calcResult = stuff.fetch('source report', date, 'organic', 2);
                break;
            case 'Email':
                calcResult = stuff.fetch('source report', date, 'email', 2);
                break;
            case 'Direct':
                calcResult = stuff.fetch('source report', date, 'direct', 2);
                break;
            case 'Referral':
                calcResult = stuff.fetch('source report', date, 'referral', 2);
                break;
            case 'Alinta Energy':
                calcResult = stuff.count('switch report', date, 'Alinta Energy', 3);
                break;
            case 'Click Energy':
                calcResult = stuff.count('switch report', date, 'Click Energy', 3);
                break;
            case 'Energy Australia':
                calcResult = stuff.count('switch report', date, 'EnergyAustralia', 3);
                break;
            case 'Australia Power & Gas':
                calcResult = stuff.count('switch report', date, 'Australian Power & Gas', 3);
                break;
            case 'NSW'://dontforget to change back to 15 because of changes to the .csv
                calcResult = stuff.count('switch report', date, 'NSW', 14);
                break;
            case 'QLD':
                calcResult = stuff.count('switch report', date, 'QLD', 14);
                break;
            case 'SA':
                calcResult = stuff.count('switch report', date, 'SA', 14);
                break;
            case 'VIC':
                calcResult = stuff.count('switch report', date, 'VIC', 14);
                break;
            case "":
                calcResult = "";
                break;
            default:
                console.log('borken' + itemName);
            }
            // console.log(calcResult + " " + itemName);
            resultsArray.push(calcResult);
        }
        addColumn(resultsArray, column);
    }
    if(calcType === "diff"){
        for(i = 1; i < finalCsv.length; i++) {
            finalCsv[i][4] = ((finalCsv[i][2] / finalCsv[i][3]) - 1)*-1;
            if(isNaN(finalCsv[i][4])){
                finalCsv[i][4] = "";
            }
        }
    }
    if(calcType === "wtd"){
        //i need todays date,
        //need the startof the week.
        todayDate = getDate(3);
        dateString = new Date(todayDate);
        dayOfWeek = dateString.getDay();
        startOfWeek = todayDate - ((dayOfWeek-1) * 86400000);
        date2 = new Date(startOfWeek);
        console.log("date string: " + dateString + " " + todayDate);
        console.log("start of week" + date2 + " " + startOfWeek);
        // var test = stuff.sum(startOfWeek, todayDate, 'site summary', 1);
        for(i = 0; i < items.length; i++) {
        // for(i = 0; i < 2; i++) {
            var itemName = items[i];
            var calcResult;
            //console.log(itemName);
            switch(itemName) {
            case 'Visits':
            case 'Unique Visitors':
                calcResult = stuff.sum(startOfWeek, todayDate, 'site summary', 1);
                break;
            case '   Unpaid Clicks':
                calcResult = stuff.sum(startOfWeek, todayDate, 'site summary', 2) - stuff.sum(startOfWeek, todayDate, 'SEM report', 2);
                break;
            case 'Switches':// add special case for this (start, end, location, column, val, special)
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 2, todayDate, "maybe");
                break;
            case '   Unpaid Switches':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 2, todayDate, "maybe") - stuff.sum(startOfWeek, todayDate, 'SEM report', 15);
                break;
            case 'Conversion Rate':
                calcResult = ( stuff.average(startOfWeek, todayDate, 'SEM report', 7) + (stuff.countSum(startOfWeek, todayDate, 'switch report', 2, todayDate, "maybe") - stuff.sum(startOfWeek, todayDate, 'SEM report', 15)) / (stuff.sum(startOfWeek, todayDate, 'site summary', 2) - stuff.sum(startOfWeek, todayDate, 'SEM report', 2))     ) / 2;
                break;
            case '   Unpaid':
                calcResult = (stuff.countSum(startOfWeek, todayDate, 'switch report', 2, todayDate, "maybe") - stuff.sum(startOfWeek, todayDate, 'SEM report', 15)) / (stuff.sum(startOfWeek, todayDate, 'site summary', 2) - stuff.sum(startOfWeek, todayDate, 'SEM report', 2));
                break;
            case 'eGPPS':
                calcResult = "";
                break;
            case 'Gross Profit':
                calcResult = "";
                break;
            case 'Impressions':
                calcResult = stuff.sum(startOfWeek, todayDate, 'SEM report', 1);
                break;
            case '   Paid Clicks':
            case 'Clicks':
                calcResult = stuff.sum(startOfWeek, todayDate, 'SEM report', 2);
                break;
            case 'CTR':
                calcResult = stuff.average(startOfWeek, todayDate, 'SEM report', 3);
                break;
            case 'AVG CPC':
                calcResult = stuff.average(startOfWeek, todayDate, 'SEM report', 4);
                break;
            case '   Paid Switches':
            case 'SwitchesSEM':
                calcResult = stuff.sum(startOfWeek, todayDate, 'SEM report', 15);
                break;
            case '   Paid':
            case 'ConvRate':
                calcResult = stuff.average(startOfWeek, todayDate, 'SEM report', 7);
                break;
            case 'Adj Switches':
                calcResult = stuff.sum(startOfWeek, todayDate, 'SEM report', 15) * 0.8;
                break;
            case 'Ad Spend':
                calcResult = stuff.sum(startOfWeek, todayDate, 'SEM report', 6);
                break;
            // case 'CPA':
            //     calcResult = (stuff.fetch('SEM report', date, '', 8) / stuff.fetch('SEM report', date, '', 15));
            //     break;
            case 'Total Spend':
                calcResult = "";
                break;
            case 'eCPA':
                calcResult = "";
                break;
            case 'Page Views':
                calcResult = stuff.sum(startOfWeek, todayDate, 'site summary', 2);
                break;
            case 'Avg. Duration':
                calcResult = stuff.average(startOfWeek, todayDate, 'site summary', 3);
                break;
            case 'Bounce Rate':
                calcResult = stuff.average(startOfWeek, todayDate, 'site summary', 4);
                break;
            case 'Paid Search':
                calcResult = stuff.sum(startOfWeek, todayDate, 'source report', 2, 'paid');
                break;
            case 'Organic Search':
                calcResult = stuff.sum(startOfWeek, todayDate, 'source report', 2, 'organic');
                break;
            case 'Email':
                calcResult = stuff.sum(startOfWeek, todayDate, 'source report', 2, 'email');
                break;
            case 'Direct':
                calcResult = stuff.sum(startOfWeek, todayDate, 'source report', 2, 'direct');
                break;
            case 'Referral':
                calcResult = stuff.sum(startOfWeek, todayDate, 'source report', 2, 'referral');
                break;
            case 'Alinta Energy':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 3, 'Alinta Energy');
                break;
            case 'Click Energy':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 3, 'Click Energy');
                break;
            case 'Energy Australia':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 3, 'EnergyAustralia');
                break;
            case 'Australia Power & Gas':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 3, 'Australian Power & Gas');
                break;
            case 'NSW'://dontforget to change back to 15 because of changes to the .csv
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 14, 'NSW');
                break;
            case 'QLD':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 14, 'QLD');
                break;
            case 'SA':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 14, 'SA');
                break;
            case 'VIC':
                calcResult = stuff.countSum(startOfWeek, todayDate, 'switch report', 14, 'VIC');
                break;
            case "":
                calcResult = "";
                break;
            default:
                // console.log('borken' + itemName);
            }
            // console.log(calcResult + " " + itemName);
            resultsArray.push(calcResult);
        }
        addColumn(resultsArray, column);
    }
    //for each of the items, we will do the calculation for its value (using a bigassswitch because thats the only way i can think of as a scrub)
    
    // we stick these results into the array one by one, in order. then this array will be shoved into the final csv
    // remember. this is all still in a callback. so you have to push it from here. else you'll push a blank array derpderp
    // console.log(resultsArray);
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
var items = [   "Visits", "   Paid Clicks", "   Unpaid Clicks", "Switches", "   Paid Switches", "   Unpaid Switches", "Conversion Rate", "   Paid", "   Unpaid", "eGPPS", "Gross Profit", "", "Impressions", "Clicks", "CTR", "AVG CPC", "SwitchesSEM", "ConvRate", "Adj Switches", "Ad Spend", "CPA", "Total Spend", "eCPA", "", "Unique Visitors", "Page Views", "Avg. Duration", "Bounce Rate", "", "Paid Search", "Organic Search", "Email", "Direct", "Referral", "", "Alinta Energy", "Click Energy", "Energy Australia", "Australia Power & Gas", "", "NSW", "QLD", "SA", "VIC"];
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
new calculate();
for(i = 0; i < name.length; i++) {
    var getFileCounter = 0;
    getFile(fileNames[0][i],fileNames[1][i], i, function(array, name) {
        getFileCounter++;// using this so it executes AFTER the callback finishes
        outputArrayIndex.push(name);
        outputArray.push(array);
        if(getFileCounter > type.length-1) {
            // note to future suicidal programmers
            // the outputArray stored is in the following structure
            // [ [ [REPORT1 ROW 1], [REPORT1 ROW 2] ], [ [REPORT2 ROW 1], [REPORT2] ROW 2] ] ]
            // the order they are stored in is chosen by diceroll, so use outputArrayIndex for the index
            for(j = 2; j < columns.length; j++){
            //for(j = 2; j < 7; j++) {
                processArray(outputArray, outputArrayIndex, columns[j]);
            }
            console.log("SPITTINGOUTFINAL");
            csv().from(finalCsv).to('output.csv');
        }
    }); // I MADE A FUNCTION IN A LOOP. WHAT ARE YOU GOING TO DO ABOUT IT
}
finalCsv.push(columns);
initializeFile(title, " ");
addColumn(items, "item");