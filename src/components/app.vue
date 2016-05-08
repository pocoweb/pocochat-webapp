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
            let userId = store.loadMeId();
            var users = store.loadUsers();
            var user = null;
            for (var i=0; i<users.length; i++) {
                if (users[i].id === userId) {
                    user = users[i];
                    break;
                }
            }
            users.splice(i, 1);
            
            return {
                // 登录用户
                user: user,
                // 用户列表
                userList: users,
                // 会话列表
                sessionList: serverData.sessionList,
                // 搜索key
                search: '',
                // 选中的会话Index
                sessionIndex: 0
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
        }
    };

</script>

<template>
    <div>
        <div class="sidebar">
            <card :user="user" :search.sync="search"></card>
            <list :user-list="userList" :session-list="sessionList" :user="user" :session="session" :session-index.sync="sessionIndex" :search="search"></list>
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