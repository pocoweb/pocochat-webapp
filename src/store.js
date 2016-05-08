const STORAGE_KEY = 'POCOWEB-CHAT-V1';
const KEY_ME = STORAGE_KEY + '-ME';
const KEY_USERS = STORAGE_KEY + '-USERS';
const KEY_CHAT = STORAGE_KEY + '-CHAT';

// 虚拟数据
if (!localStorage.getItem(KEY_CHAT)) {
    let now = new Date();
    
    let userList = [
            {
                id: 0,
                name: '智能助手',
                img: 'dist/images/0.png'
            },
            {
                id: 1,
                name: '朱一婷',
                img: 'dist/images/1.jpg'
            },
            {
                id: 2,
                name: 'fred',
                img: 'dist/images/2.png'
            },
            {
                id: 3,
                name: '孙立文',
                img: 'dist/images/3.jpg'
            }
        ];
    
    let data = {
        // 会话列表
        sessionList: [
            {
                userId1: 1,
                userId2: 2,
                messages: [
                    {
                        text: '朱一婷对fred的测试对话',
                        date: now,
                        send: 1
                    }, 
                    {
                        text: 'fred对朱一婷的测试对话',
                        date: now,
                        send: 2
                    }
                ]
            },
            {
                userId1: 1,
                userId2: 3,
                messages: [
                    {
                        text: '孙立文对朱一婷的测试对话',
                        date: now,
                        send: 3
                    }
                ]
            },
            {
                userId1: 2,
                userId2: 3,
                messages: [
                    {
                        text: '孙立文对fred的测试对话',
                        date: now,
                        send: 3
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
    loadUsers () {
        return JSON.parse(localStorage.getItem(KEY_USERS));
    },
    loadMeId () {
        return JSON.parse(localStorage.getItem(KEY_ME));
    },
    save (store) {
        localStorage.setItem(KEY_CHAT, JSON.stringify(store));
    }
};