<script>
    import store from '../store';
    import card from './card';
    import list from './list';
    import text from './text';
    import message from './message';

    export default {
        el: '#chat',
        data () {
            let serverData = store.loadChat();
            // var ai = store.loadAI();
            // console.log(ai);
            // var users = [];

            // for (var i=0; i<users.length; i++) {
            //     if (users[i].id === userId) {
            //         user = users[i];
            //         break;
            //     }
            // }

            // users.splice(1, 1);
            // users.push(ai);
            
            return {
                // AI
                ai: {
                    name: 'ai',
                    id: 'ai',
                    avatar: 'dist/images/0.png'
                },
                // 当前用户Parse Id
                currentUser: null,
                // 当前用户信息
                user: {
                    'id': -1,
                    'name': '未登陆用户',
                    'avatar': 'dist/images/unknown.jpg'
                },
                // 用户列表
                userList: [],
                // 会话列表
                sessionList: serverData.sessionList,
                // 待处理消息
                tempSession: null,
                // 搜索key
                search: '',
                // 选中的会话Index
                sessionIndex: 0,
                // 条件渲染
                isShow: false,
            };
        },
        computed: {
            session () {
                return this.sessionList[this.sessionIndex];
            }
        },
        watch: {
            // 每当sessionList改变时，保存到localStorage中
            sessionList: {
                deep: true,
                handler () {
                    store.save({
                        sessionList: this.sessionList
                    });
                }
            },
            tempSession: {
                deep: true,
                handler () {
                    store.send(this.tempSession);
                }
            }
        },
        components: {
            card, list, text, message
        },
        methods: {
            show() {
                this.isShow = true;
                this.user = this.creatUser(this.currentUser);
                store.loadUsers(this.currentUser, this.addUserList);
                
                var SessionQuery = new Parse.Query('TempTest');
                var subscription = SessionQuery.subscribe();
                subscription.on('open', () => {
                    console.log('subscription opened');
                });
                subscription.on('create', (object) => {
                    console.log('object created');
                });
                subscription.on('update', (object) => {
                    console.log('object updated');
                });
                subscription.on('close', () => {
                    console.log('subscription closed');
                });
            },
            hide() {
                this.isShow = false;
            },
            newUser() {
                store.saveGroupUser(this.currentUser);
            },
            creatUser(parseUser) {
                if (parseUser != null) {
                    var avatar = parseUser.get('avatar');
                    if (avatar ==  null) {
                        avatar = 'dist/images/unknown.jpg';
                    }
                    return {
                        'id': parseUser.id,
                        'name': parseUser.get('username'),
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
            addUserList(groupUser) {
                this.userList.push(this.creatUser(groupUser));
            }

        }
    };

</script>

<template>
    <div>
        <div class="sidebar">
            <card :user="user" :search.sync="search"></card>
            <list :ai="ai" :user-list.sync="userList" :session-list="sessionList" :user="user" :session="session" :session-index.sync="sessionIndex" :search="search" :sendTo="sendTo"></list>
        </div>
        <div class="main">
            <message :session="session" :user="user" :user-list.sync="userList" :sendTo="sendTo"></message> 
            <text :session="session" :user="user" :sendTo="sendTo"></text>
        </div>
    </div>
</template>

<style lang="less">
    #chat {
        margin: auto;
        width: 1000px;
        height: 100%;
        overflow: hidden;
        border-radius: 3px;

        .sidebar, .main {
            height: 100%;   
        }
        .sidebar {
            float: left;
            width: 200px;
            color: #f4f4f4;
            background-color: #2e3238;
        }
        .main {
            position: relative;
            overflow: hidden;   
            background-color: #eee;
        }
        .m-text {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
        }
        .m-message {
            height: ~'calc(100% - 160px)';
        }
    }
</style>