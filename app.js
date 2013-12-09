var Twit = require('twit'),
    async = require('async'),
    _ = require('underscore'),
    screen_name = 'nthgergo',
    users = {};

var T = new Twit({
    consumer_key:         'rLpmjofg1B5NlWXdmztpAg',
    consumer_secret:      'gDUSZLQ49YqhNlYAb1rwxy0Ve9UYQEg6QDum4PC7cw',
    access_token:         '1030698720-2wJNCp2B6ATm2i1kQhP8C5i5O0nCerFx1iULwOG',
    access_token_secret:  'gG50SgFZJZA1SPjCNP8h4FqGSunorp0nhyBzJzo02ou8R'
});

async.parallel([
    function(callback) {
        // get people who follow me
        T.get('followers/ids', { screen_name: screen_name }, function(err, reply) {
            callback(null, reply.ids);
        });
    },
    function(callback) {
        // get people who I follow
        T.get('friends/ids', { screen_name: screen_name }, function(err, reply) {
            callback(null, reply.ids);
        });
    }
],function(err, results) {
    var iFollow = _.difference(results[1], results[0]);
    async.each(iFollow, function(user, callback) {
        T.get('users/show', {user_id: user}, function(err, data) {
            if (err) {
                return callback(err);
            }
            users[user] = {};
            users[user].name = data.name
            users[user].screen_name = data.screen_name;
            users[user].description = data.description;
            callback();
        });
    }, function(err) {
        if (err) {
            console.log(err);
        }
        // Evil people not following you (but you follow them)!!!!1111
        console.log(users);
        process.exit();
    });
});