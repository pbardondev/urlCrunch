var server = require('../src/server');
config = require('../src/config');
var testDb = 'mongodb://'+ config.dbAddress +':27017/test';
var testUri = '/link/AFDS3';
var testUrl = 'www.ebay.com';
var testNonUrl = 'function(){console.log("hello");}();';
var linkBase = '/link/',
returnedId;

var UrlDb = require('../src/UrlDb');
var urlDb = new UrlDb(testDb);

var mockResponse = {
    writeHead: function(){
        console.log(arguments);
    }
};


exports.testOnPost = function(test) {
    urlDb.initialize().then(function(data){
        console.log('initialized db, now starting on post test');
        var deferred = server.onPost(urlDb, null, {url: testUrl}, mockResponse).then(function(data){
            console.log(data);
            test.ok(data.data._id, 'saved with id');
            test.ok(data.data.url === testUrl, 'saved with id');
            returnedId = data.data._id;
            var deferred = server.onPost(urlDb, null, {url: testNonUrl}, mockResponse).then(function(data){
        }, function(err) {
            console.log('hit error while trying to enter bad url');
            urlDb.disconnect();
            test.done();
        });
        });
        test.ok(typeof deferred.then != 'undefined', 'Promise returned from onPost');
    });
};

exports.testOnGet = function(test) {
    var uri = linkBase + returnedId;
    urlDb.initialize().then(function(data){
        var deferred = server.onGet(urlDb, uri, {}, mockResponse).then(function(data){
            console.log(data);
            console.log('that was data');
            test.ok(data.data._id === returnedId, 'correct id retrieved');
            test.ok(data.data.url === testUrl, 'correct value retrieved');
            
            console.log('about to disconnect server');
            urlDb.disconnect();
            test.done();
        });
        test.ok(typeof deferred.then != 'undefined', 'Promise returned from onGet');
    });
};


exports.testOnDelete = function(test) {
    var uri = linkBase + returnedId;
    urlDb.initialize().then(function(data){
        var deferred = server.onDelete(urlDb,uri).then(function(data){
            test.ok(data.data === returnedId, 'correct id deleted');
            urlDb.disconnect();
            test.done();
        });
        test.ok(typeof deferred.then != 'undefined', 'Promise returned from onDelete');
    });
};
