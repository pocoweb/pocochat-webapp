const STORAGE_KEY = 'POCOWEB-CHAT-V1';
const KEY_CHAT = STORAGE_KEY + '-CHAT';
const KEY_TIME = STORAGE_KEY + '-TIME';

Parse.initialize("pocoweb-chat", "njLwbUJgejKCjC2y");
Parse.serverURL = 'http://pocoweb.com:11337/parse';
//Parse.serverURL = 'http://localhost:1337/parse';

var ParseSession = Parse.Object.extend('Messages');

function loadUserByID(uid, callback) {
    var userQuery = new Parse.Query('User');
    userQuery.get(uid, {
        success: function(data) {
            //console.log('got user:', data, data.get('username'));
            callback(data);
        },
        error: function(data, error) {
            console.log("load user Error: " + error.code + " " + error.message);
        }
    });
}

export default {
    getAIId() {
        return 'PhU3ki2QQV'; //release
        //return '1E5T8KLWbF'; //debug
    },
    getGroupId() {
        return '7SDMDWUPFh'; //release
        //return 'qjm7IQwids'; //debug
    },
    loadSession(user, callback) {
        console.log('>>> loadSession')
        
        let updateTime = this.loadTime(user);
        
        let toMe = new Parse.Query(ParseSession);
        toMe.equalTo('to', user.id);
        toMe.greaterThan('createdAt', updateTime);

        let groupSession = new Parse.Query(ParseSession);
        groupSession.equalTo('to', this.getGroupId());
        groupSession.greaterThan('createdAt', updateTime);

        var query = Parse.Query.or(toMe, groupSession);
        query.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    callback(results[i]);
                }
                console.log('<<< loadSession');
            },
            error: function(error) {
                console.log("load session Error: " + error.code + " " + error.message);
                console.log('<<< loadSession');
            }
        });
    },
    loadUsers(currentUser, callback) {
        console.log('>>> loadUsers')
        var self = this;
        return new Promise(function(resolve, reject) {
            var userQuery = new Parse.Query('User');
            userQuery.get(self.getAIId()).then(function(user) {
                callback(user);
                console.log('got ai');
                return userQuery.get(self.getGroupId());
                
            }).then(function(user) {
                callback(user);
                console.log('got group');
                
                var query = new Parse.Query('User');
                query.equalTo('group', currentUser.get('group'));
                query.notEqualTo('ObjectId', currentUser.id);
                return query.find();
                
            }).then(function(users) {
                for (var i = 0; i < users.length; i++) {
                    callback(users[i]);
                }
                console.log('<<< query users ok', users);
                resolve();
            }, function(error) {
                console.log('<<< query users ng', error);
                reject();
            });
        }); 
    },
    loadMe(parseUser) {
        return creatUser(parseUser);
    },
    send(tempSession) {
        var session = new ParseSession();
        session.set('load', false);
        session.save(tempSession, {
            success: function(data) {
                console.log('send session ok', data);
            },
            error: function(data, error) {
                console.log('send session ng, with error code: ' + error.description);
            }
        });
    },
    update(tempSession) {
        tempSession.set('load', true);
        tempSession.save();
    },
    loadChat(user) {
        let value = localStorage.getItem(KEY_CHAT + user.id);
        return (value!=null && value!='undefined') ? JSON.parse(value) : [];
    },
    loadTime(user) {
        let value = localStorage.getItem(KEY_TIME + user.id);
        if (value!=null && value!='undefined') {
            value = new Date(JSON.parse(value));
        } else {
            value = new Date();
        }
        return value;
    },
    save(user, data, updateTime) {
        localStorage.setItem(KEY_CHAT + user.id, JSON.stringify(data));
        localStorage.setItem(KEY_TIME + user.id, JSON.stringify(updateTime));
    }
};