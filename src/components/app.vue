<script>
    import store from '../store';
    import card from './card';
    import list from './list';
    import text from './text';
    import message from './message';
    
    var SessionQuery = new Parse.Query('TempTest');

    export default {
        el: '#chat',
        data () {
            return {
                // 当前用户Parse Id
                currentUser: null,
                // 当前用户信息
                user: {
                    'id': -1,
                    'name': '未登陆',
                    'avatar': 'dist/images/unknown.jpg'
                },
                // 用户列表
                userList: [],
                // 会话列表
                sessionList: [],
                // 搜索key
                search: '',
                // 选中的会话Index
                sessionIndex: -1,
                // 条件渲染
                isShow: false,
                // parse liveQuery
                subscription: null
            };
        },
        computed: {
            session () {
                if (this.sessionIndex >= 0) {
                    return this.sessionList[this.sessionIndex];
                }
                return {
                    id1: '',
                    id2: '',
                    messages: []
                }
            }
        },
        watch: {
            sessionList: {
                deep: true,
                handler () {
//                    store.save({
//                        sessionList: this.sessionList
//                    });
                }
            }
        },
        components: {
            card, list, text, message
        },
        methods: {
            clearData() {
                this.currentUser = null;
                this.user = {
                    'id': -1,
                    'name': '未登陆',
                    'avatar': 'dist/images/unknown.jpg'
                };
                this.userList = [];
                this.sessionList = [];
                this.search = '';
                this.sessionIndex =  -1;
                this.isShow = false;
                this.subscription.unsubscribe();
            },
            show() {
                this.isShow = true;
                this.user = this.creatUser(this.currentUser);
                store.loadUsers(this.currentUser, this.addUserList);
                this.wsopen();
            },
            hide() {
                this.isShow = false;
            },
            signout() {
                Parse.User.logOut();
                this.authVM.showLandingPage();
                this.clearData();
            },
            wsopen() {
                this.subscription = SessionQuery.subscribe();
                this.subscription.on('open', () => {
                    console.log('subscription opened');
                });
                this.subscription.on('create', (object) => {
                    console.log('object created', object);
                });
                this.subscription.on('update', (object) => {
                    console.log('object updated', object);
                });
                this.subscription.on('close', () => {
                    console.log('subscription closed');
                });
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
            <list :ai="ai" :user-list="userList" :session-list="sessionList" :user="user" :session="session" :session-index.sync="sessionIndex" :search="search"></list>
        </div>
        <div class="main">
            <message :session="session" :user="user" :user-list="userList"></message> 
            <text :session="session" :user="user"></text>
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
    @media screen and (max-width:767px) {
        #chat {
            width: 600px;
        }
    }
</style>