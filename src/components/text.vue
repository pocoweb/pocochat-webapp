<script>
    import store from '../store';

    function doNotify(inTitle, inBody, inSilent, inIcon) {
        Notification.requestPermission();
        var option = {
            title: inTitle,
            body: inBody,
            icon: inIcon
        }
        var noti = new Notification(option.title, option);
        noti.onclick = function () {
            console.log('Notification clicked')
        }
    }
    
    export default {
        self: this,
        props: ['session', 'user'],
        data () {
            return {
                text: ''
            };
        },
        methods: {
            inputing (e) {
                if (e.keyCode === 13 && this.text.length) { 
                    var sendData = {
                        from: this.user.id,
                        to: this.session.id1 == this.user.id ? this.session.id2 : this.session.id1,
                        msg: this.text
                    }
                    //this.session.messages.push(sendData);
                    store.send(sendData);
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