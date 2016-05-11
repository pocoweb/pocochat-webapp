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
            var ai = store.loadAI();
            console.log(user);
            var users = store.loadUsers();

            // for (var i=0; i<users.length; i++) {
            //     if (users[i].id === userId) {
            //         user = users[i];
            //         break;
            //     }
            // }

            users.splice(1, 1);
            users.push(ai);
            
            return {
                // AI
                ai: ai,
                // 登录用户
                user: user,
                // 用户列表
                userList: users,
                // 会话列表
                sessionList: serverData.sessionList,
                // 搜索key
                search: '',
                // 选中的会话Index
                sessionIndex: 0,
                // 条件渲染
                isShow: false
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
            <list :user-list="userList" :session-list="sessionList" :user="user" :session="session" :session-index.sync="sessionIndex" :search="search"></list>


            <div id="userform">
                <label>Username: </label>
                <input type="text" placeholder="Ex. user123" id="usernameField">
                <label>Password: </label>
                <input type="password" placeholder="***********" maxlength="14" id="passwordField">
                <button type="button" id="loginButton">Login</button>
                <button type="button" id="showRegisterForm">Register</button>
            </div>


            <!-- Chatbox area (User logged in) -->

            <div id="messagediv" hidden="yes">
                <label id="username" style="display:inline-block"></label>
                <button type="button" id="logoutButton">Logout</button>
            </div>

            <!-- Registration form -->

            <div id="registerDiv" hidden="yes">
                <h1> Parse API Chat Register form </h1>
                <div id="credentials">
                <label>Username: </label>
                <input type="text" id="regUsername" placeholder="Ex. User123">
                <label>Password: </label>
                <input type="password" id="regPassword" placeholder="***********" maxlength="14">
                <button type="button" id="registerButton">Register</button>
                <button type="button" id="cancel">Cancel</button>
                </div>
            </div>
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
</style>