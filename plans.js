var csvDelimiter = ",";
var encoding = "utf-8";
var inputDir = process.argv[2] ? process.argv[2] : ".";
var outputDir = "output"; // Relative to inputDir, which is the first argument to this script
var isDoPreprocess = !process.argv[3];

var targetColumns =
{
    "Asset ID": function (data) { return !!data.match(/^[0-9]{4,}$/); },
    "Asset_Number Property": function (data) { return !!data.match(/^[0-9]{15}$/); },
    "Device_ID Property": function (data) { return !!data.match(/^W2X\.[A-Z0-9()\-. ]{2,}$/); },
    "SERIAL_NUMBER Property": function (data) { return !!data.match(/^[A-Z0-9]{5,}$/); },
    "WESTPAC_BARCODE Property": function (data) { return !!data.match(/^WBG[0-9]{5}$/); },
    "IBM_BARCODE Property": function (data) { return !!data.match(/^IGS[AW][0-9]{6}$/); },
    "CLIENT_BARCODE Property": function (data) { return data.length > 5; },
    "CONTAINED ASSET NAME": function (data) { return data.length > 2; },
    "FLOOR ASSET NAME": function (data) { return data.length > 2; }
};
var blankText = "---blank";
var duplicatedText = "---dupes";
var unusualText = "---error";
var dataExceptionColumn = "Data Exceptions";
var dataExceptionColumnOverflow = "Data Exceptions Overflow";

var apertureTypesFile = "./apertures.csv"; // Relative to the current directory
var apertureTypesColumns = { id: "Symbol Name", name: "Aperture Type" };
var apertureTypesTargetColumns = { id: "SHAPE TYPE ID", name: "Type Property" };

///////////////////////////////

var lazy = require("./lazy.js");
var fs = require("fs");

if (isDoPreprocess)
{
    console.log("Converting XLS to CSV...");
    require("child_process").spawn("wscript", ["xls2csv.js"], {cwd: inputDir}).on("exit", function (code)
    {
        if (code !== 0)
            throw new Error("Couldn't convert from XLS to CSV");
            
        var files = fs.readdirSync(inputDir);
        var targetDirs = {};
        for (var f = 0; f < files.length; ++f)
        {
            var index = files[f].lastIndexOf("-");
            if (index < 0)
                continue;
            var match = files[f].slice(index + 1).match(/(.+)\.csv/);
            if (!match)
                continue;
            targetDirs[match[1]] = true;
            try { fs.mkdirSync(inputDir + "/" + match[1]); } catch (e) {}
            fs.renameSync(inputDir + "/" + files[f], inputDir + "/" + match[1] + "/" + files[f]);
        }

        var exitCode = false;
        var childrenToExit = Object.keys(targetDirs).length;
        for (var t in targetDirs)
            require("child_process").spawn("node", [__filename, inputDir + "/" + t, 1])
                .on("exit", function (code)
                {
                    exitCode = !!(exitCode || code);
                    --childrenToExit;
                    console.log("Waiting for " + childrenToExit + " more child processes");
                });
        console.log("Processing CSV files...");
        var interval = setInterval(function ()
        {
            if (childrenToExit !== 0)
                return;
            if (exitCode !== false)
                throw new Error("Couldn't process CSV files");
            clearInterval(interval);

            exitCode = false;
            childrenToExit = Object.keys(targetDirs).length;
            for (var t in targetDirs)
            {
                var outputPath = inputDir + "/" + t + "/" + outputDir;
                fs.createReadStream(inputDir + "/csv2xls.js").pipe(fs.createWriteStream(outputPath + "/csv2xls.js").on("close", function ()
                {
                    require("child_process").spawn("wscript", ["csv2xls.js"], {cwd: outputPath})
                        .on("exit", function (code)
                        {
                            exitCode = !!(exitCode || code);
                            --childrenToExit;
                            console.log("Waiting for " + childrenToExit + " more child processes");
                        });
                }));
            }
            console.log("Converting CSV to XLS...");
            
            setInterval(function ()
            {
                if (childrenToExit !== 0)
                    return;
                if (exitCode !== false)
                    throw new Error("Couldn't process CSV files");
                process.exit();
            }, 100);
        }, 100);
    });
}
else
{
    function parseCsvLine(line, state)
    {
        if (!state)
            state = {results: [], result: "", isInQuotes: false};
        else if (state.isInQuotes)
            line = "\n" + line;

        var l = 0;
        for (; l < line.length; ++l)
            if (state.isInQuotes && line.slice(l, l + 2) === '""')
            {
                state.result += '"';
                ++l;
            }
            else if (line[l] === '"')
                state.isInQuotes = !state.isInQuotes;
            else if (line.slice(l, l + csvDelimiter.length) === csvDelimiter && !state.isInQuotes)
            {
                state.results.push(state.result);
                state.result = "";
            }
            else
                state.result += line[l];
        if (!state.isInQuotes)
        {
            state.results.push(state.result);
            return state.results;
        }
        return state;
    }

    function escapeForCsv(str, isForceQuotes)
    {
        if (!Array.isArray(str))
        {
            var isNeedQuotes = isForceQuotes;
            var result = "";
            for (var c = 0; c < str.length; ++c)
                if (str[c] === '"')
                {
                    isNeedQuotes = true;
                    result += '""';
                }
                else if (str.slice(c, c + csvDelimiter.length) === csvDelimiter || str[c] === '\n')
                {
                    isNeedQuotes = true;
                    result += str[c];
                }
                else
                    result += str[c];
            if (isNeedQuotes)
                result = '"' + result + '"';
            return result;
        }
        else
        {
            var result = str.slice(0);
            for (var r = 0; r < result.length; ++r)
                result[r] = escapeForCsv(result[r].toString(), isForceQuotes);
            return result;
        }
    }

    function getApertureTypes()
    {
        var lines = fs.readFileSync(apertureTypesFile).toString().replace(/\r/g, "\n").split("\n");
        var result = {};
        var columnMapping = {};
        var parserState = null;
        for (var l = 0; l < lines.length; ++l)
        {
            // Parse csv
            var entries = parseCsvLine(lines[l], parserState);
            if (!Array.isArray(entries))
            {
                parserState = entries;
                return;
            }
            else
                parserState = null;

            for (var e = 0; e < entries.length; ++e)
                entries[e] = entries[e].trim().replace(/[ \n\r\t]+/g, " ").replace(/[^\x20-\x7e]/g, "?");

            if (Object.keys(columnMapping).length === 0)
                for (var e = 0; e < entries.length; ++e)
                    columnMapping[entries[e]] = e;
            else
            {
                if (!entries[columnMapping[apertureTypesColumns.id]] || !entries[columnMapping[apertureTypesColumns.name]])
                    continue;

                var id = entries[columnMapping[apertureTypesColumns.id]].toLowerCase().replace(/[^a-z0-9]/g, "");
                var name = entries[columnMapping[apertureTypesColumns.name]].toUpperCase();
                if (result[id])
                    console.warn("Duplicate for aperture type ID " + id.toUpperCase());
                else
                    result[id] = name;
            }
        }
        return result;
    }

    var entryCount = {};
    function checkRow(entries, columnMapping)
    {
        for (var e = 0; e < entries.length; ++e)
            entries[e] = entries[e].trim().replace(/[ \n\r\t]+/g, " ").replace(/[^\x20-\x7e]/g, "?");

        if (!entries[columnMapping[dataExceptionColumn]])
            entries.push("");
        if (!entries[columnMapping[dataExceptionColumnOverflow]])
            entries.push("");

        var dataExceptions = [];
        for (var t in targetColumns)
        {
            if (!(t in columnMapping))
                continue;

            if (!entryCount[t])
                entryCount[t] = {};

            var data = entries[columnMapping[t]].trim();
            if (!data)
            {
                if (!entryCount[t][""])
                    entryCount[t][""] = 0;
                data = blankText + "." + (++entryCount[t][""]);
                dataExceptions.push("Data in `" + t + "' null");
            }
            else
            {
                if (!targetColumns[t](data))
                {
                    if (!entryCount[t][unusualText])
                        entryCount[t][unusualText] = 0;
                    data += unusualText + "." + (++entryCount[t][unusualText]);
                    dataExceptions.push("Data in `" + t + "' unusual");
                }

                var dataId = data.toLowerCase().replace(/[^a-z0-9]/g, "");

                if (!entryCount[t][dataId])
                    entryCount[t][dataId] = 1;
                else
                {
                    if (!entryCount[t][duplicatedText])
                        entryCount[t][duplicatedText] = 0;
                    data += duplicatedText + "." + (++entryCount[t][duplicatedText]);
                    ++entryCount[t][dataId];
                    dataExceptions.push("Data in `" + t + "' duplicated");
                }
            }
            entries[columnMapping[t]] = data;
        }

        if (entries[columnMapping[apertureTypesTargetColumns.id]] && entries[columnMapping[apertureTypesTargetColumns.name]] !== undefined)
        {
            var apertureTypesId = entries[columnMapping[apertureTypesTargetColumns.id]].toLowerCase().replace(/[^a-z0-9]/g, "");
            var apertureTypesName = apertureTypes[apertureTypesId];
            if (!apertureTypesName)
                apertureTypesName = "N/A";
            if (apertureTypesName !== entries[columnMapping[apertureTypesTargetColumns.name]].toUpperCase())
            {
                if (!entries[columnMapping[apertureTypesTargetColumns.name]])
                    entries[columnMapping[apertureTypesTargetColumns.name]] = "<blank>";
                dataExceptions.push("Data in `" + apertureTypesTargetColumns.name + "' = " + (entries[columnMapping[apertureTypesTargetColumns.name]] + " -> " + apertureTypesName).trim());
                entries[columnMapping[apertureTypesTargetColumns.name]] = apertureTypesName;
            }
        }

        var currentExceptionLength = 0;
        var dataExceptionsOverflow = [];
        for (var e = 0; e < dataExceptions.length; ++e)
        {
            currentExceptionLength += dataExceptions[e].length + "\r\n".length;
            if (currentExceptionLength >= 255)
            {
                dataExceptionsOverflow = dataExceptions.splice(e, dataExceptions.length - e);
                break;
            }
        }
        entries[columnMapping[dataExceptionColumn]] = dataExceptions.join("\r\n");
        entries[columnMapping[dataExceptionColumnOverflow]] = dataExceptionsOverflow.join("\r\n");
    }

    var apertureTypes = getApertureTypes();

    // Find the input files
    //var inputDir = process.argv[2] ? process.argv[2] : ".";
    var inputFiles = fs.readdirSync(inputDir);

    fs.mkdir(inputDir + "/" + outputDir, function ()
    {
        // Read input files
        for (var i = 0; i < inputFiles.length; ++i) (function (inputFile)
        {
            if (!inputFile.match(/\.csv$/))
                return;

            var columnMapping = {};
            var parserState = null;
            var output = fs.createWriteStream(inputDir + "/" + outputDir + "/" + inputFile, {encoding: encoding});
            new lazy(fs.createReadStream(inputDir + "/" + inputFile, {encoding: encoding})).lines.forEach(function (line)
            {
                // Parse csv
                var entries = parseCsvLine(line.toString().replace(/\r/g, "\n"), parserState);
                if (!Array.isArray(entries))
                {
                    parserState = entries;
                    return;
                }
                else
                    parserState = null;

                // Process and edit data
                for (var e = 0; e < entries.length; ++e)
                    entries[e] = entries[e].trim().replace(/[ \n\r\t]+/g, " ").replace(/[^\x20-\x7e]/g, "?");
                if (Object.keys(columnMapping).length === 0)
                {
                    for (var e = 0; e < entries.length; ++e)
                        columnMapping[entries[e]] = e;

                    if (!columnMapping[dataExceptionColumn])
                    {
                        entries.push(dataExceptionColumn);
                        columnMapping[dataExceptionColumn] = entries.length - 1;
                    }
                    if (!columnMapping[dataExceptionColumnOverflow])
                    {
                        entries.push(dataExceptionColumnOverflow);
                        columnMapping[dataExceptionColumnOverflow] = entries.length - 1;
                    }
                }
                else
                    checkRow(entries, columnMapping);

                // Write data
                for (var e = 0; e < entries.length; ++e)
                {
                    entries[e] = entries[e].trim();
                    if (entries[e].slice(0,2).match(/[0-9+\-]/))
                        entries[e] = '="' + entries[e] + '"';
                }
                output.write(escapeForCsv(entries, true).join(csvDelimiter) + "\r\n", encoding);
            }).join(function () { output.end(); });
        })(inputFiles[i]);
    });
}
