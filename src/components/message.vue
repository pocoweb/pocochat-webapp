<script>
    export default {
        props: ['session', 'user', 'userList'],

        filters: {
            // 筛选出用户头像
            avatar (item) {
                let otherId = (item.from === this.user.id) ? item.to : item.from;
                let otherUser = this.userList.filter(item => item.id === otherId)[0];
                
                // 如果是自己发的消息显示登录用户的头像
                let user = (item.from === this.user.id) ? this.user : otherUser;
                return user && user.avatar;
            },
            // 将日期过滤为 hour:minutes
            time (date) {
                if (date == null) {
                    return '';
                }
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                return date.getHours() + ':' + date.getMinutes();
            }
        },
        directives: {
            // 发送消息后滚动到底部
            'scroll-bottom' () {
                Vue.nextTick(() => {
                    this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight;
                });
            }
        }
    };
</script>

<template>
    <div class="m-message" v-scroll-bottom="session.messages">
        <ul>
            <li v-for="item in session.messages">
                <p class="time"><span>{{item.createAt | time}}</span></p>
                <div class="main" :class="{ self: (item.from === this.user.id) }">
                    <img class="avatar" width="30" height="30" :src="item | avatar" />
                    <div class="text">{{item.msg}}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="less">
    .m-message {
        padding: 10px 15px;
        overflow-y: scroll;
        
        li {
            margin-bottom: 15px;
        }
        .time {
            margin: 7px 0;
            text-align: center;
            
            > span {
                display: inline-block;
                padding: 0 18px;
                font-size: 12px;
                color: #fff;
                border-radius: 2px;
                background-color: #dcdcdc;
            }
        }
        .avatar {
            float: left;
            margin: 0 10px 0 0;
            border-radius: 3px;
        }
        .text {
            display: inline-block;
            position: relative;
            padding: 0 10px;
            max-width: ~'calc(55% - 40px)';
            min-height: 30px;
            line-height: 1.75;
            font-size: 12px;
            text-align: left;
            word-break: break-all;
            background-color: #fafafa;
            border-radius: 4px;
            
            &:before {
                content: " ";
                position: absolute;
                top: 9px;
                right: 100%;
                border: 6px solid transparent;
                border-right-color: #fafafa;
            }
        }
        
        .self {
            text-align: right;
            
            .avatar {
                float: right;
                margin: 0 0 0 10px;
            }
            .text {
                background-color: #b2e281;
                
                &:before {
                    right: inherit;
                    left: 100%;
                    border-right-color: transparent;
                    border-left-color: #b2e281;
                }
            }
        }
    }
</style>