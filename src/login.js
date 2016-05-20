var Login = {
    validateEmail: function(a) {
        return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(a)
    },
    validatePassword: function(a) {
        return a.length >= 6;
    }
}

////////////////////////////////////////////////////////////////
// export
////////////////////////////////////////////////////////////////
module.exports = Login;