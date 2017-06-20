var express     = require("express"),
    multer      = require("multer"),
    fs          = require("fs-extra"),
    StreamZip   = require('node-stream-zip'),
    request     = require('request'),
    fsc         = require('fs-cheerio'),
    router      = express.Router();
const electron = require('electron');
const app = electron.app;


var tempLocation = app.getPath('temp');
tempLocation = tempLocation;
console.log(tempLocation);

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, tempLocation);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('zip');

router.get("/", function(req, res){
  res.render("general/home");
});

router.post("/", function(req, res){

  upload(req, res, function(err) {
    if(err) {
        return res.end("Error uploading file." + err);
    }
    var zip = tempLocation + "\\" + req.file.filename;
    var unzipPath = tempLocation;
    console.log("Path to unzip:  " + unzipPath);

    var zip = new StreamZip({
        file: zip,
        storeEntries: true
    });

    zip.on('error', function(err) { console.log(err) });
    zip.on('ready', function() {
        console.log('Entries read: ' + zip.entriesCount);

        zip.extract('\log', unzipPath, function(err, count) {
            console.log('Extracted ' + count + ' entries');

            var url = unzipPath + "\\Log@PEFApp.html";
            console.log(url);
            fsc.readFile(url).then(function($){
                var error_count;
                var error_data = [];
                $( "pre[style='color:white;background:red']" ).each(function( index ) {
                    error_data.push($(this).text());
                });
                error_count = error_data.length;
                res.render("general/results", { url: url, error_count: error_count, error_data: error_data });
            });
        });
    });
  });
});

module.exports = router;
