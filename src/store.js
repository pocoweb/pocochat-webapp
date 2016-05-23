const STORAGE_KEY = 'POCOWEB-CHAT-V1';
const KEY_CHAT = STORAGE_KEY + '-CHAT';
const KEY_TIME = STORAGE_KEY + '-TIME';

//Parse.serverURL = 'http://localhost:1337/parse';
Parse.serverURL = 'http://azure.pocoweb.com:11337/parse';

Parse.initialize("pocoweb-chat", "njLwbUJgejKCjC2y");

var ParseSession = Parse.Object.extend('Messages');
var ParseEmail = Parse.Object.extend('UserEmails');

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

var ID_AI = null;
var ID_GROUP = null;

export default {
    getAIId() {
        return ID_AI;
    },
    getGroupId() {
        return ID_GROUP;
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
            userQuery.equalTo('username', '智能助手');
            userQuery.find().then(function(users) {
                if (users.length == 1) {
                    ID_AI = users[0].id;
                    callback(users[0]);
                    console.log('got ai');
                }
                
                userQuery = new Parse.Query('User');
                userQuery.equalTo('username', '团队群聊');
                return userQuery.find();
            }).then(function(users) {
                if (users.length == 1) {
                    ID_GROUP = users[0].id;
                    callback(users[0]);
                    console.log('got group');
                }
                
                var query = new Parse.Query('User');
                query.equalTo('group', currentUser.get('group'));
                query.notEqualTo('objectId', currentUser.id);
                return query.find();
                
            }).then(function(users) {
                for (var i = 0; i < users.length; i++) {
                    callback(users[i]);
                }
                console.log('<<< query users ok', users);
                resolve();
            }, function(error) {
                console.log('<<< query users ng', error);
                resolve();
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
    setUserInfo(user, email) {
        console.log('set email', email);
        var parse = new ParseEmail();
        parse.setACL(new Parse.ACL(user));
        parse.save({
            uid: user.id,
            username: user.get('username'),
            email: email
        }, {
            success: function(data) {
                console.log('set email ok', data);
            },
            error: function(data, error) {
                console.log('set email ng, with error code: ' + error.description);
            }
        });
    },
    update(tempSession) {
        tempSession.set('load', true);
        tempSession.save();
    },
    loadChat(user) {
        return [];
        // let value = localStorage.getItem(KEY_CHAT + user.id);
        // return (value!=null && value!='undefined') ? JSON.parse(value) : [];
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
        //localStorage.setItem(KEY_CHAT + user.id, JSON.stringify(data));
        localStorage.setItem(KEY_TIME + user.id, JSON.stringify(updateTime));
    }
};