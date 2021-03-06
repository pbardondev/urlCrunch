(function() {
    'use strict';
    
    var crypto = require('crypto');

    module.exports = {
        generateKey: function(uri, keyLength) {
            var key = '';
            var hash = crypto.createHash('sha256');
            hash.update(uri);
            var digested = hash.digest('hex');
            for(var i=0; i<keyLength; i++){
                key = key.concat(getRandomCharacter(digested));
            }
            return key;
        }
    };

    function getRandomCharacter(hash){
        var index = Math.floor(Math.random() * (hash.length - 1));
        return hash.slice(index, index+1).toUpperCase();
    }
}());
