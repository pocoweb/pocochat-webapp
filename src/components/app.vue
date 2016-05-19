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
                var self = this;
                this.user = this.creatUser(this.currentUser);
                this.sessionList = store.loadChat(this.user);
                let promise = store.loadUsers(this.currentUser, this.addUserList);
                promise.then(function() {
                    store.loadSession(self.currentUser, self.sessionCreateCB);
                    self.isShow = true;
                });   
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
                let fromId = session.get('from'), toId = session.get('to');
                if (toId === this.user.id) {
                    var index = this.selectSession(fromId, toId);
                    if (index < 0) return;
                    this.sessionList[index].messages.push({
                        from: fromId,
                        to: toId,
                        msg: session.get('msg'),
                        createdAt: session.createdAt
                    });
                    store.save(this.user, this.sessionList, session.createdAt);
                    
                } else if (toId === store.getGroupId()) {
                    let foundUser = this.userList.filter(item => item.id === fromId);
                    if (foundUser.length <= 0) return;
                    
                    let otherUser = foundUser[0];
                    var index = this.selectSession(this.user.id, toId);
                    if (index < 0) return;
                    
                    this.sessionList[index].messages.push({
                        from: otherUser.id,
                        to: this.user.id,
                        msg: session.get('msg'),
                        createdAt: session.createdAt
                    });
                    store.save(this.user, this.sessionList, session.createdAt);
                    
                } else if (fromId === this.user.id) {
                    store.save(this.user, this.sessionList, session.createdAt);
                }
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