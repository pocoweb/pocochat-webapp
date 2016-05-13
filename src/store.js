const STORAGE_KEY = 'POCOWEB-CHAT-V1';
const KEY_ME = STORAGE_KEY + '-ME';
const KEY_USERS = STORAGE_KEY + '-USERS';
const KEY_CHAT = STORAGE_KEY + '-CHAT';

Parse.initialize("pocowebchat", "njLwbUJgejKCjC2y");
Parse.serverURL = 'http://pocoweb.com:11337/parse';

//Parse.LiveQuery.on('error', (error) => {
//  console.log('socket connection error', error);
//});
//Parse.LiveQuery.on('open', () => {
//  console.log('socket connection established');
//});
//Parse.LiveQuery.on('close', () => {
//  console.log('socket connection closed');
//});

var ParseSession = Parse.Object.extend('TempTest');
var ParseGroupUsers = Parse.Object.extend('GroupUsers');

// 虚拟数据
if (!localStorage.getItem(KEY_CHAT)) {
    localStorage.setItem(KEY_ME, JSON.stringify(1));
    localStorage.setItem(KEY_USERS, JSON.stringify(userList));
    localStorage.setItem(KEY_CHAT, JSON.stringify(data));
}

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
    loadChat() {
        return JSON.parse(localStorage.getItem(KEY_CHAT));
    },
    loadUsers(user, callback) {
        //默认，智能助手
        loadUserByID('PhU3ki2QQV', callback);
        
        //默认，群聊
        loadUserByID('7SDMDWUPFh', callback);
        
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
    loadSession() {

    },
    loadMe(parseUser) {
        return creatUser(parseUser);
    },
    send(tempSession) {
        console.log('send', tempSession);
        var session = new ParseSession();
        for ( var p in tempSession ) {
            session.set(p, tempSession[p]);
        }
        session.save(null, {
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