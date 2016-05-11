<script>
    import store from '../store';

    export default {
        props: ['ai', 'userList', 'sessionList', 'user', 'sessionIndex', 'session', 'search', 'sendTo'],

        methods: {
            select (value) {
                this.sessionIndex = -1;
                for (var i=0; i<this.sessionList.length; i++) {
                    var item = this.sessionList[i];
                    let id1 = value.id < this.user.id ? value.id : this.user.id;
                    let id2 = value.id > this.user.id ? value.id : this.user.id;
                    
                    if (item.fromUser == id1 && item.toUser == id2) {
                        this.sessionIndex = i;
                        break;
                    }
                }
                console.log('user', this.user);
                console.log('value', value);
                console.log('idx', this.sessionIndex);
                if (this.sessionIndex == -1) {
                    this.sessionList.push({
                        sendFrom: value.obj,
                        sendTo: this.user.obj,
                        messages: []
                    });
                    this.sessionIndex = this.sessionList.length - 1;
                }

            }
        },
        filters: {
            search (list) {
                return list.filter(item => item.name.indexOf(this.search) > -1);
            }
        },
        created: function() {

        }
    };
</script>

<template>
    <div class="m-list">
        <ul>
            <li :class="active" @click="select(ai)">
                <img class="avatar"  width="35" height="35" :alt="ai.name" :src="ai.avatar">
                <p class="name">{{ai.name}}</p>
            </li>
            <li v-for="item in userList | search" :class="{ active: (session.fromUser === item.id) || (session.toUser === item.id) }" @click="select(item)">
            <!-- <li v-for="item in userList | search" :class="active" @click="select(item)"> -->
                <img class="avatar"  width="35" height="35" :alt="item.name" :src="item.avatar">
                <p class="name">{{item.name}}</p>
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
        }
    }
</style>