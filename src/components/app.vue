<script>
    import store from '../store';
    import card from './card';
    import list from './list';
    import text from './text';
    import message from './message';
    
    let SessionQuery = new Parse.Query('Messages');
    
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
                sessionIndex: 0,
                // 条件渲染
                isShow: false,
                // parse liveQuery
                subscription: null
            };
        },
        computed: {
            session () {
                if (this.sessionList.length > 0 && this.sessionIndex >= 0) {
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
                
                var defer = jQuery.Deferred();
                defer.done(store.loadUsers(this.currentUser, this.addUserList))
                    .done(store.loadSession(this.currentUser, this.sessionCreateCB));
                this.wsopen(this.sessionCreateCB);
            },
            hide() {
                this.isShow = false;
            },
            signout() {
                Parse.User.logOut();
                this.authVM.showLandingPage();
                this.clearData();
            },
            wsopen(createCB) {
                this.subscription = SessionQuery.subscribe();
                this.subscription.on('open', () => {
                    console.log('subscription opened');
                });
                this.subscription.on('create', (session) => {
                    createCB(session);
                });
                this.subscription.on('close', () => {
                    console.log('subscription closed');
                });
            },
            sessionCreateCB(session) {
                let userId1 = session.get('from'), userId2 = session.get('to');
                if (this.user.id !== userId1 && this.user.id !== userId2) {
                    return;
                }
                var index = this.selectSession(userId1, userId2);
                if (index >= 0) {
                    this.sessionList[index].messages.push({
                        from: session.get('from'),
                        to: session.get('to'),
                        msg: session.get('msg'),
                        createAt: session.createAt
                    });
                }
                store.update(session);
            },
            regUser() {
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
                var newUser = this.creatUser(groupUser);
                this.userList.push(newUser);
                
                let userId1 = newUser.id, userId2 = this.user.id;
                let id1 = userId1 < userId2 ? userId1 : userId2;
                let id2 = userId1 > userId2 ? userId1 : userId2;
                if (this.selectSession(id1, id2) < 0) {
                    this.sessionList.push({
                        id1: id1,
                        id2: id2,
                        messages: []                       
                    });
                }
            },
            selectSession(userId1, userId2) {
                let id1 = userId1 < userId2 ? userId1 : userId2;
                let id2 = userId1 > userId2 ? userId1 : userId2;
                var sessionIndex = -1;
                for (var i=0; i<this.sessionList.length; i++) {
                    var item = this.sessionList[i];
                    if (item.id1 == id1 && item.id2 == id2) {
                        sessionIndex = i;
                        break;
                    }
                }
                return sessionIndex;
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