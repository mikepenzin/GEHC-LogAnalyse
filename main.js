var isDevelopment = process.env.NODE_ENV === 'development';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

var mainWindow = null;
var connect;

if (isDevelopment) {
  connect = require('electron-connect').client;
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs-extra');
var webApp = express();
var port = 3000;

var routes = require('./routes/index');

var tempLocation = app.getPath('temp');
tempLocation = tempLocation;
console.log(tempLocation);

app.on('ready', function () {
    express();
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      'node-integration': false,
      center: true,
      title: "GE Healthcare - Log Analysis",
      icon: '.\\public\\img\\icons\\ms-icon-310x310.png'
  });

// view engine setup
webApp.set('views', path.join(__dirname, 'views'));
webApp.set('view engine', 'ejs');

webApp.use(logger('dev'));
webApp.use(bodyParser.urlencoded({ extended: true }));
webApp.use(express.static(path.join(__dirname, 'public')));


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

webApp.use(allowCrossDomain);

webApp.use('/', routes);

var server = webApp.listen(port, function () {
  console.log('app listening at http://%s:%s', server.address().host, server.address().port);
});


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    fs.emptyDir(tempLocation)
    .then(() => {
      console.log('success!');
      server.close();
      app.quit();
    })
    .catch(err => {
      console.error(err)
    })
  }
});

  mainWindow.loadURL('http://localhost:'+ port);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    fs.emptyDir('./public/tmp/')
    .then(() => {
      console.log('success!');
      server.close();
      mainWindow = null;
      app.quit();
    })
    .catch(err => {
      console.error(err)
    })
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
  });

});
