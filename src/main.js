import app from './components/app';
import Login from './login';
import Store from './store';

Vue.config.debug = true;
var appVm = new Vue(app);

appVm.authVM = new Vue({
    el: '#login-page',
    data: {
        pages: {
            isShowLandingPage: true,
            isShowSigninPage: false,
            isShowSignupPage: false
        },
        username: '',
        password: '',
        group: '',
        email: ''
    },
    $vm: this,
    // TODO(liwen): try to avoid create the model if the user has signed in.
    ready: function() {
        appVm.currentUser = Parse.User.current();
        if (appVm.currentUser != null) {
            this.showApp();
        }
    },
    computed: {
        isShowLoginPage() {
            return this.pages.isShowSigninPage || this.pages.isShowSignupPage;
        },
        loginTitle() {
            return this.pages.isShowSigninPage ? "登录PocoChat账号" : "注册PocoChat账号";
        },
        submitBtnStr() {
            return this.pages.isShowSigninPage ? "登录" : "注册";
        }
    },
    methods: {
        reset() {
            this.pages.isShowLandingPage = false;
            this.pages.isShowSigninPage = false;
            this.pages.isShowSignupPage = false;
            this.clearAuthForm();
            appVm.hide();
        },
        showApp() {
            this.reset();
            appVm.show();
        },
        showLandingPage() {
            this.reset();
            this.pages.isShowLandingPage = true;
        },
        clearAuthForm() {
            this.username = '';
            this.password = '';
            this.group = '';
            this.email = '';
        },
        signin() {
            console.log('signin');            
            this.reset();
            this.pages.isShowSigninPage = true;
        },
        signup() {
            console.log('signup');
            this.reset();
            this.pages.isShowSignupPage = true;
        },
        signOut() {
            if (appVm.currentUser != null) {
                Parse.User.logOut();
            }
            this.showLandingPage();
        },
        submit() {
            console.log('submit', this.username, this.password);
            if (this.pages.isShowSigninPage) {
                Parse.User.logIn(this.username, this.password, {
                    success: function(user) {
                        console.log("signin success", user);
                        appVm.currentUser = user;
                        appVm.authVM.showApp();
                    },
                    error: function(user, error) {
                        console.log("Error: " + error.code + " " + error.message + ".");
                        //TODO: add error case
                    }
                });
                
            } else if (this.pages.isShowSignupPage) {
                //TODO: add check
                var email = this.email;
                var user = new Parse.User();
                user.set('username', this.username);
                user.set('password', this.password);
                user.set('group', this.group);
                user.signUp(null, {
                    success: function(user) {
                        console.log("signup success", user);
                        appVm.currentUser = user;
                        appVm.authVM.showApp();
                        Store.setUserInfo(user, email);
                    },
                    error: function(user, error) {
                        console.log("Error: " + error.code + " " + error.message + ".");
                        //TODO: add error case
                    }
                });
            }  
        }
    }
})