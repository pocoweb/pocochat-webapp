var wd = wd || {};
wd.signup = wd.signup || {},
wd.signup.init = function() {
    var a = $(".warning");
    $(".submit-form").submit(function() {
        return ! 1
    }),
    $("#register-btn").click(function() {
        return $(this).hasClass("disabled") ? !1 : void wd.signup.doSignup()
    }),
    $(".github").click(function() {
        wd.signup.doGithub()
    }),
    $(".coding").click(function() {
        wd.signup.doCoding()
    }),
    $(".weibo").click(function() {
        wd.signup.doWeibo()
    }),
    $.ajax({
        url: "/account/signupTicket",
        type: "GET",
        dataType: "json",
        timeout: 3e4,
        cache: !1
    }),
    $(".email-input").focus(function() {
        a.eq(0).removeClass("warning-show"),
        $(this).removeClass("warning-border").addClass("input-focus")
    }).blur(function() {
        return $(this).removeClass("input-focus").removeClass("warning-border"),
        wd.util.validateEmail($(this).val()) || "" === $(this).val() ? void 0 : ($(".warning").eq(0).text("请输入有效的 Email 地址").addClass("warning-show"), void $(".email-input").addClass("warning-border"))
    }),
    $(".password").focus(function() {
        a.eq(1).removeClass("warning-show"),
        $(this).removeClass("warning-border").addClass("input-focus")
    }).blur(function() {
        $(this).removeClass("warning-border").removeClass("input-focus")
    })
},
wd.signup.doSignup = function() {
    var a = $(".email-input").val(),
    b = $(".password").val();
    return wd.util.validateEmail(a) ? wd.util.validatePassword(b) ? ($("#register-btn").addClass("disabled"), "undefined" != typeof mixpanel && mixpanel.register_once({
        $email: a
    }), void $.ajax({
        url: "https://www.wilddog.com/account/signup",
        type: "POST",
        data: {
            email: a,
            password: b
        },
        cache: !1,
        timeout: 3e4,
        dataType: "json",
        success: function(b, c) {
            var d = b.code;
            0 == d ? ("undefined" != typeof mixpanel && (mixpanel.alias(a), mixpanel.people.set({
                $email: a
            })), setTimeout(function() {
                window.location.href = "https://www.wilddog.com/dashboard?from=signup"
            },
            1e3), goog_report_conversion("https://www.wilddog.com/dashboard?from=signup")) : 1 == d ? ($(".warning").eq(0).text("请输入有效的 Email 地址").addClass("warning-show"), $(".email-input").addClass("warning-border")) : 2 == d ? ($(".warning").eq(1).text("请输入至少8位的字符作为密码").addClass("warning-show"), $(".password").addClass("warning-border")) : 3 == d ? ($(".warning").eq(0).text("Email已注册").addClass("warning-show"), $(".email-input").addClass("warning-border")) : 10 == d && ($(".warning").eq(0).text("当前IP注册过于频繁，请10分后再试").addClass("warning-show-long"), $(".email-input").addClass("warning-border")),
            $("#register-btn").removeClass("disabled")
        },
        error: function() {
            $("#register-btn").removeClass("disabled")
        }
    })) : ($(".warning").eq(1).text("请输入至少8位的字符作为密码").addClass("warning-show"), void $(".password").addClass("warning-border")) : ($(".warning").eq(0).text("请输入有效的 Email 地址").addClass("warning-show"), void $(".email-input").addClass("warning-border"))
},
wd.signup.doGithub = function() {
    $("#register-btn").addClass("disabled"),
    $.ajax({
        url: "/account/github/url",
        type: "GET",
        dataType: "json",
        success: function(a, b, c) {
            var d = a.url;
            setTimeout(window.location = d, 200)
        },
        error: function() {
            $("#register-btn").removeClass("disabled")
        }
    })
},
wd.signup.doCoding = function() {
    $("#register-btn").addClass("disabled"),
    $.ajax({
        url: "/account/coding/url",
        type: "GET",
        dataType: "json",
        success: function(a, b, c) {
            var d = a.url;
            setTimeout(window.location = d, 200)
        },
        error: function() {
            $("#register-btn").removeClass("disabled")
        }
    })
},
wd.signup.doWeibo = function() {
    $("#register-btn").addClass("disabled"),
    $.ajax({
        url: "/account/weibo/url",
        type: "GET",
        dataType: "json",
        success: function(a, b, c) {
            var d = a.url;
            setTimeout(window.location = d, 200)
        },
        error: function() {
            $("#register-btn").removeClass("disabled")
        }
    })
},
wd.util = wd.util || {},
wd.util.validateEmail = function(a) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(a)
},
wd.util.validatePassword = function(a) {
    return a.length >= 8
},
wd.util.validateCode = function(a) {
    return 4 == a.length
};