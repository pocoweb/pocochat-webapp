const STORAGE_KEY = 'POCOWEB-CHAT-V1';
const KEY_CHAT = STORAGE_KEY + '-CHAT';

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
    loadChat() {
        return JSON.parse(localStorage.getItem(KEY_CHAT));
    },
    loadUsers(user, callback) {
        //默认，智能助手
        loadUserByID(this.getAIId(), callback);
        
        //默认，群聊
        loadUserByID(this.getGroupId(), callback);
        
        var query = new Parse.Query('GroupUsers');
        query.equalTo('group', user.get('group'));
        query.notEqualTo('uid', user.id);
        query.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    var uid = results[i].get('uid');
                    //console.log('group users:', uid);
                    loadUserByID(uid, callback);
                }
            },
            error: function(error) {
                console.log("load group users Error: " + error.code + " " + error.message);
            }
        });
    },
    loadMe(parseUser) {
        return creatUser(parseUser);
    },
    send(tempSession) {
        var session = new ParseSession();
        session.save(tempSession, {
            success: function(data) {
                console.log('send session ok', data);
            },
            error: function(data, error) {
                console.log('send session ng, with error code: ' + error.description);
            }
        });
    },
    save(store) {
        localStorage.setItem(KEY_CHAT, JSON.stringify(store));
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