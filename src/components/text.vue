<script>
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
        props: ['session', 'user'],
        data () {
            return {
                text: ''
            };
        },
        methods: {
            inputing (e) {
                if (e.keyCode === 13 && this.text.length) {
                    // this.session.messages.push({
                    //     text: this.text,
                    //     date: new Date(),
                    //     send: this.user.id
                    // });

                    //var message = $("#usermsg").val().toString();

                    var messageObject = new Messages();
                    messageObject.save({
                        text: this.text,
                        sendFrom: currentUser,
                        sendTo: this.session.user
                    }).then(function(object) {
                        this.text = '';
                    });


                    doNotify(this.user.name, this.text, this.user.img);
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