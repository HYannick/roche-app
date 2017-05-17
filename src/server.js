var express = require('express');
var isUseHTTPs = process.env.USE_HTTPS !== undefined;
var app = require('express')();
var fs = require('fs-extra');
var path = require('path');
var logger = require('morgan');
var http = require('http');
var https = require('https');
//var async = require('async');
//var helpers = require('./helpers');

var signaling = require('./Signaling-Server');
var scalableBroadcast = require('./Scalable-Broadcast');

//SSL Certification
if(isUseHTTPs){
    var privateKey  = fs.readFileSync(path.join(__dirname, 'fake-keys/privatekey.pem'), 'utf8');
    var certificate = fs.readFileSync(path.join(__dirname, 'fake-keys/certificate.pem'), 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var httpsPort = process.env.PORT || 8443;
    var httpsServer = https.createServer(credentials, app);
}else{
    var httpPort = process.env.PORT || 8080;
    var httpServer = http.createServer(app);
}

signaling(isUseHTTPs ? httpsServer : httpServer);
scalableBroadcast(isUseHTTPs ? httpsServer : httpServer);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function (req, res) {
    var obj;
    var images;
    var pdf;
    var video;
    var files = {};
    var data = {};
    var json;

    fs.readFile(path.join(__dirname,'shared-data.json'), 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        images = obj.pictures;
        pdf = obj.pdfFiles;
        video = obj.videoFiles;
        files = {
            pictures: images,
            pdfFiles : pdf,
            videoFiles : video
        };
        res.render('index', files);
    });
});

app.get('/shared-data.json', function(req,res){
    res.json(require('./shared-data.json'))
});


if(!isUseHTTPs){
    httpServer.listen(httpPort, function(){
        console.log('listening port 8080')
    });
    module.exports = httpServer;
}else{
    httpsServer.listen(httpsPort, function(){
        console.log('listening port 8443');
    });
    module.exports = httpsServer;
}


