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
            var user = store.loadMe();
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
                // 登录用户
                user: user,
                // 用户列表
                userList: [],
                // 会话列表
                sessionList: serverData.sessionList,
                // 搜索key
                search: '',
                // 选中的会话Index
                sessionIndex: 0,
                // 条件渲染
                isShow: false,

                // sendTo
                sendTo: null
            };
        },
        asyncData: function() {
            var self = this;
            store.loadAI()
                .then(function(results) {
                    // returning this as the Promise's resolve value
                    // will call `vm.$set('msg', msg)` for you
                    item = results[0];
                    ai = {
                            name: item.get('username'),
                            id: item.id,
                            avatar: item.get('avatar').url(),
                            obj: ai
                        };
                    self.ai = ai;
                    self.sendTo = ai;
                });

            store.loadUsers()
                .then(function(results) {
                    // returning this as the Promise's resolve value
                    // will call `vm.$set('msg', msg)` for you
                    var items = results;

                    //var userList = [];

                    var item = null;
                    for(var i =0; i < results.length; i ++ ) {
                        item = results[i];
                        console.log(item);
                        self.userList.push({
                            name: item.get('username'),
                            id: item.id,
                            avatar: item.get('avatar').url(),
                            obj: item
                        });
                    }
                });
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
            }
        },
        components: {
            card, list, text, message
        },
        methods: {
            show() {
                this.isShow = true;

                this.user = store.loadMe();

            },
            hide() {
                this.isShow = false;

                // TODO(liwen) cleanup the model?
            }
        }
    };

</script>

<template>
    <div>
        <div class="sidebar">
            <card :user="user" :search.sync="search"></card>
            <list wait-for="async-data" :ai="ai" :user-list="userList" :session-list="sessionList" :user="user" :session="session" :session-index.sync="sessionIndex" :search="search" :sendTo="sendTo"></list>
        </div>
        <div class="main">
            <message :session="session" :user="user" :user-list="userList" :sendTo="sendTo"></message> 
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