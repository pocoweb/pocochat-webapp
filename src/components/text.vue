<script>
    export default {
        props: ['session', 'user'],
        data () {
            return {
                text: ''
            };
        },
        methods: {
            inputing (e) {
                if (e.keyCode === 13 && this.text.length) {
                    console.log('session', this.session);
                    console.log('user', this.user);
                    console.log('this', this);
                    this.session.messages.push({
                        text: this.text,
                        date: new Date(),
                        send: this.user.id
                    });
                    this.text = '';
                }
            }
        }
    };
</script>

<template>
    <div class="m-text">
        <textarea placeholder="按 Enter 发送" v-model="text" @keyup="inputing"></textarea>
    </div>
</template>

<style lang="less">
    .m-text {
        height: 160px;
        border-top: solid 1px #ddd;
        
        textarea {
            padding: 10px;
            height: 100%;
            width: 100%;
            border: none;
            outline: none;
            font-family: "Micrsofot Yahei";
            resize: none;
        }
    }
</style>