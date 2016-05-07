<script>
    export default {
        props: ['userList', 'sessionList', 'sessionIndex', 'session', 'search'],
        methods: {
            select (value) {
                for (var i=0; i<this.sessionList.length; i++) {
                    var item = this.sessionList[i];
                    if (item.userId1 == value.id || item.userId2 == value.id) {
                        this.sessionIndex = i;
                        break;
                    }
                }
            }
        },
        filters: {
            search (list) {
                return list.filter(item => item.name.indexOf(this.search) > -1);
            }
        }
    };
</script>

<template>
    <div class="m-list">
        <ul>
            <li v-for="item in userList | search" :class="{ active: (session.userId1 === item.id) || (session.userId2 === item.id) }" @click="select(item)">
                <img class="avatar"  width="30" height="30" :alt="item.name" :src="item.img">
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