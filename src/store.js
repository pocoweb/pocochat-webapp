const STORAGE_KEY = 'POCOWEB-CHAT-V1';
const KEY_ME = STORAGE_KEY + '-ME';
const KEY_USERS = STORAGE_KEY + '-USERS';
const KEY_CHAT = STORAGE_KEY + '-CHAT';

import { EventEmitter } from 'events'
import { Promise } from 'es6-promise'

const store = new EventEmitter()


// 虚拟数据
if (!localStorage.getItem(KEY_CHAT)) {
    let now = new Date();
    
    let userList = [
            {
                id: 'abwPeEfkgL',
                name: '智能助手',
                avatar: 'dist/images/0.png'
            },
            {
                id: 'IxJjAum8vW',
                name: '朱一婷',
                avatar: 'dist/images/1.jpg'
            },
            {
                id: "crASHMirAS",
                name: 'fred',
                avatar: 'dist/images/2.png'
            },
            {
                id: "nn8HysalBr",
                name: '孙立文',
                avatar: 'dist/images/3.jpg'
            }
        ];
    
    let data = {
        // 会话列表
        sessionList: [
            {
                userId1: 'IxJjAum8vW',
                userId2: 'crASHMirAS',
                messages: [
                    {
                        text: '朱一婷对fred的测试对话',
                        createdAt: now,
                        sendFrom: "crASHMirAS"
                    }, 
                    {
                        text: 'fred对朱一婷的测试对话',
                        createdAt: now,
                        sendFrom: "IxJjAum8vW"
                    }
                ]
            },
            {
                userId1: 'nn8HysalBr',
                userId2: 'IxJjAum8vW',
                messages: [
                    {
                        text: '孙立文对朱一婷的测试对话',
                        createdAt: now,
                        sendFrom: "IxJjAum8vW"
                    }
                ]
            },
            {
                userId1: 'nn8HysalBr',
                userId2: 'crASHMirAS',
                messages: [
                    {
                        text: '孙立文对fred的测试对话',
                        createdAt: now,
                        sendFrom: "crASHMirAS"
                    }
                ]
            }
        ],
    };
    
    localStorage.setItem(KEY_ME, JSON.stringify(1));
    localStorage.setItem(KEY_USERS, JSON.stringify(userList));
    localStorage.setItem(KEY_CHAT, JSON.stringify(data));
}




export default {
    loadChat () {
        return JSON.parse(localStorage.getItem(KEY_CHAT));
    },
    loadFriends () {
        return {};
    },
    loadUsers () {
        return JSON.parse(localStorage.getItem(KEY_USERS));
    },
    loadAI () {

        return new Promise(function(resolve, reject){
            var query = new Parse.Query('User');
            query.equalTo('username', 'ai');
            query.find().then(function(results){
                var user = results[0];

                var ret = {
                    'id': user.id,
                    'name': user.get('username'),
                    'avatar': user.get('avatar').url()
                };
                return ret;

                // error: function(error) {
                //     // error is an instance of Parse.Error.
                //     return {
                //         'id': -1,
                //         'name': 'AI',
                //         'avatar': 'dist/images/0.png'
                //     }
                // }
            });
        });
    },
    loadMe () {
        //return JSON.parse(localStorage.getItem(KEY_ME));
        let user = Parse.User.current();
        if (user != null) {

            var avatar = '';
            if (user.get('avatar') != null) {
                avatar = user.get('avatar').url()
            }
            return {
                'id': user.id,
                'name': user.get('username'),
                'avatar': avatar
            }
        } else {
            return {
                'id': -1,
                'name': '未登陆用户',
                'avatar': 'dist/images/unknown.jpg'
            }
        }
    },
    save (store) {
        localStorage.setItem(KEY_CHAT, JSON.stringify(store));
    }
};