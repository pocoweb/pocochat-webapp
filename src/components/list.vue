<script>
    export default {
        props: ['userList', 'sessionList', 'user', 'sessionIndex', 'session', 'search'],

        computed: {
            withUserList () {
                return this.sessionList.filter(item => (item.id1 != this.user.id || item.id2 != this.user.id));
            }
        },

        methods: {
            selectSession (value) {
                var id1 = value.id1;
                var id2 = value.id2;
                
                this.sessionIndex = -1;
                for (var i=0; i<this.sessionList.length; i++) {
                    var item = this.sessionList[i];
                    if (item.id1 == id1 && item.id2 == id2) {
                        this.sessionIndex = i;
                        break;
                    }
                }
                //console.log('selectSession ok', id1, id2, this.sessionIndex);
                if (this.sessionIndex == -1) {
                    this.sessionList.push({
                        id1: id1,
                        id2: id2,
                        unread: 0,
                        messages: []
                    });
                    this.sessionIndex = this.sessionList.length - 1;
                }
                
                this.sessionList[this.sessionIndex].unread = 0;
            },
            unread (session) {
                return session.unread > 0 ? '('+session.unread+')' : '';
            }
        },
        filters: {
            search (list) {
                var that = this;
                function findUser(session) {
                    var withUserId = session.id1 == that.user.id ? session.id2 : session.id1;
                    var withUser = that.userList.filter(item => item.id == withUserId)[0];
                    return withUser && withUser.name.indexOf(that.search) > -1;
                }
                return list.filter(item => findUser(item));
            },
            withUserName (session) {
                var withUserId = session.id1 == this.user.id ? session.id2 : session.id1;
                var withUser = this.userList.filter(item => item.id == withUserId)[0];
                if (withUser){
                    return withUser.name;
                }            
            },
            withUserAvatar (session) {
                var withUserId = session.id1 == this.user.id ? session.id2 : session.id1;
                var withUser = this.userList.filter(item => item.id == withUserId)[0];
                if (withUser){
                    //return withUser.avatar != null ? withUser.avatar : $.avatar({name: withUser.name});
                    return $.avatar({name: withUser.name});
                }
            }
        }
    };
</script>

<template>
    <div class="m-list">
        <ul>
            <li v-for="item in withUserList | search" :class="{ active: (item == sessionList[sessionIndex]) }" @click="selectSession(item)">
                <img class="avatar"  width="40" height="40" :alt="item | withUserName" :src="item | withUserAvatar">
                <p class="name">{{item | withUserName}}</p>
                <p class="flag">{{unread(item)}}</p>
            </li>
        </ul>
    </div>
</template>

<style lang="less">
    .m-list {
        li {
            padding: 12px 15px;
            border-bottom: 1px solid #292C33;
            cursor: pointer;
            transition: background-color .1s;
            
            &:hover {
                background-color: rgba(255, 255, 255, 0.03);
            }
            &.active {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
        .avatar, .name {
            vertical-align: middle;
        }
        .avatar {
            border-radius: 2px;
        }
        .name {
            display: inline-block;
            margin: 0 0 0 15px;
            width: 50%;
        }
        .flag {
            display: inline-block;
            text-align: center;
            color: orangered;
            font-weight: 600;
/*
            font-size: 5px;
            background-color:#F00; 
            border-radius: 10px;
*/
        }
    }
</style>