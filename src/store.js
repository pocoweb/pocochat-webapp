const STORAGE_KEY = 'POCOWEB-CHAT-V1';
const KEY_CHAT = STORAGE_KEY + '-CHAT';
const KEY_TIME = STORAGE_KEY + '-TIME';

Parse.initialize("pocowebchat", "njLwbUJgejKCjC2y");
Parse.serverURL = 'http://pocoweb.com:11337/parse';

var ParseSession = Parse.Object.extend('Messages');
var ParseGroupUsers = Parse.Object.extend('GroupUsers');

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
        return 'PhU3ki2QQV';
    },
    getGroupId() {
        return '7SDMDWUPFh';
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
    loadUsers(user, callback) {
        console.log('>>> loadUsers')
        
        // default users
        loadUserByID(this.getAIId(), callback);
        loadUserByID(this.getGroupId(), callback);
        
        var query = new Parse.Query(ParseGroupUsers);
        query.equalTo('group', user.get('group'));
        query.notEqualTo('uid', user.id);
        
        return new Promise(function(resolve, reject) {
            query.find({
                success: function(results) {
                    for (var i = 0; i < results.length; i++) {
                        var uid = results[i].get('uid');
                        //console.log('group users:', uid);
                        loadUserByID(uid, callback);
                    }
                    console.log('<<< query.find');
                    resolve();
                },
                error: function(error) {
                    console.log("load group users Error: " + error.code + " " + error.message);
                    console.log('<<< query.find');
                    reject();
                }
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
    },
    saveGroupUser(parseUser) {
        var groupUser = new ParseGroupUsers();
        groupUser.set('group', parseUser.get('group'));
        groupUser.set('uid', parseUser.id);
        groupUser.save(null, {
            success: function(data) {
                console.log('saveGroupUser ok', data);
            },
            error: function(data, error) {
                console.log('saveGroupUser ng, with error code: ' + error.description);
            }
        });
    }
};