<script>
    import store from '../store';
    
    export default {
        self: this,
        props: ['session', 'user'],
        data () {
            return {
                text: ''
            };
        },
        methods: {
            inputing (event) {
                var tempText = this.text.trim();
                if (!event.shiftKey) {
                    if (tempText.length) { 
                        var sendData = {
                            from: this.user.id,
                            to: this.session.id1 == this.user.id ? this.session.id2 : this.session.id1,
                            msg: tempText,
                            group: this.user.group
                        }
                        this.session.messages.push(sendData);
                        store.send(sendData);
                        this.text = "";  // after sent -> empty
                    } else {
                        this.text = "";  // all whitespace/newline -> empty
                    }
                } else {
                    // enter + shift -> break a new line
                    this.text += "\r\n";
                }
            },
            validateEnter (event) {
                console.log("enter shift");
                var tempText = this.text.trim();
                if (!event.shiftKey) {
                    if (!tempText.length) { 
                        this.text = "";  // enter with no text -> empty
                    } 
                } 
            },
        }
    };
</script>

<template>
    <div class="m-text">
        <textarea placeholder="按 Enter 发送" v-model="text" @keydown.enter.prevent="validateEnter" @keyup.enter.prevent="inputing($event)"></textarea>
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