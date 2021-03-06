var UrlDb = require('../src/UrlDb'),
config = require('../src/config'),
testKey = 'testKey',
testUrl = 'www.google.com',
testKey2 = 'testKey2',
testUrl2 = 'www.facebook.com',
testKey3 = 'testKey3',
testUrl3 = 'www.yahoo.com',
testDb = 'mongodb://'+ config.dbAddress +':27017/test';

var urlDb = new UrlDb(testDb);

module.exports = {

    testConnect: function(test) {
        var uri = urlDb.connect().then(function(db){
            test.done();
        });
    },

    testCreateUrlCollection: function(test){
        urlDb.createUrlCollection().then(function(data){
            test.ok(data.s.name === 'urls', 'url collection created');
            return test.done();
        }, function(err){
            return log(err);
        });
    },

    testAddUrl: function(test) {
        urlDb.addUrl(testKey, testUrl).then(function(){
            urlDb.findById(testKey).then(function(data){
                test.ok(data._id === testKey, 'key found');
                test.ok(data.url === testUrl, 'with correct value');

                urlDb.addUrl(testKey, testUrl).then(function(data){
                    test.ok(data._id !== testKey,
                         'new key generated for duplicate keys');
                    test.done();
                });
            });
        });
    },

    testGetUrl: function(test){
        urlDb.getUrl(testKey).then(function(data){
            test.ok(data.url === testUrl, 'test url retrieved');
            test.done();
        });
    },

    testInsertUrlObject: function(test) {
        urlDb.insertUrlObject(testKey3, testUrl3).then(function(){
            urlDb.findById(testKey3).then(function(data){
                test.ok(data._id === testKey3, 'key found');
                test.ok(data.url === testUrl3, 'with correct value');

                test.done();
            });
        });
    },

    testFindById: function(test) {
        urlDb.findById(testKey).then(function(data){
            test.ok(data._id === testKey, 'key found');
            test.ok(data.url === testUrl, 'with correct value');

            test.done();
        });
    },

    testRemoveUrl: function(test) {
        urlDb.removeUrl(testKey3).then(function(){
            urlDb.findById(testKey3).then(function(data){
                test.ok(!data, 'key removed');
                test.done();
            });
        });
    },

    testRemoveUrlCollection: function(test) {
        urlDb.removeUrlCollection().then(function(data) {
            test.ok(data, 'url collection removed');
            test.done();
        });
    },

    testDisconnect: function(test){
        urlDb.disconnect();
        test.done();
    }
};
