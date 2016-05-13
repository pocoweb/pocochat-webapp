<script>
    export default {
        props: ['userList', 'sessionList', 'user', 'sessionIndex', 'session', 'search'],

        methods: {
            select (value) {
                let id1 = value.id < this.user.id ? value.id : this.user.id;
                let id2 = value.id > this.user.id ? value.id : this.user.id;
                
                this.sessionIndex = -1;
                for (var i=0; i<this.sessionList.length; i++) {
                    var item = this.sessionList[i];
                    if (item.id1 == id1 && item.id2 == id2) {
                        this.sessionIndex = i;
                        break;
                    }
                }
                console.log(id1, id2, this.sessionIndex);
                if (this.sessionIndex == -1) {
                    this.sessionList.push({
                        id1: id1,
                        id2: id2,
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
            <li v-for="item in userList | search" :class="{ active: (session.id1 === item.id) || (session.id2 === item.id) }" @click="select(item)">
                <img class="avatar"  width="40" height="40" :alt="item.name" :src="item.avatar">
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