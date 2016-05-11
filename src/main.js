import app from './components/app';

Parse.initialize("pocoweb-chat", "XoHirs3LE7PhOYiR");
Parse.serverURL = 'http://localhost:1337/parse';

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
      password: ''
    },
    $vm: this,
    // TODO(liwen): try to avoid create the model if the user has signed in.
    ready: function() {
        currentUser = Parse.User.current();
        if (currentUser != null) {
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
            return this.pages.isShowSigninPage ? "登  录" : "注  册";
        }
    },
    methods: {
        showApp() {
            this.pages.isShowLandingPage = false;
            this.pages.isShowSigninPage = false;
            this.pages.isShowSignupPage = false;
            
            this.clearAuthForm();

            appVm.show();
        },
        showLandingPage() {
            this.pages.isShowLandingPage = true;
            this.pages.isShowSigninPage = false;
            this.pages.isShowSignupPage = false;
            
            this.clearAuthForm();

            appVm.hide();
        },
        clearAuthForm() {
            this.pages.username = '';
            this.pages.password = '';
        },
        signin() {
            console.log('singin');

            this.pages.isShowLandingPage = false;
            this.pages.isShowSigninPage = true;
            this.pages.isShowSignupPage = false;

            this.clearAuthForm();

            appVm.hide();
        },
        signup() {
            console.log('singup');
            this.pages.isShowLandingPage = false;
            this.pages.isShowSigninPage = false;
            this.pages.isShowSignupPage = true;

            this.clearAuthForm();

            appVm.hide();
        },
        signOut() {
            currentUser = Parse.User.current();
            if (currentUser != null) {
                Parse.User.logOut();
                this.showLandingPage();
            } else {
                this.showLandingPage();
            }
        },
        submit() {
            console.log('submit');

            console.log(this.username);
            console.log(this.password);

            // if signin
            if (this.pages.isShowSigninPage) {
                Parse.User.logIn(this.username, this.password, {
                    success: function(user) {
                        
                        appVm.currentUser = user;

                        // redirect to app ui
                        appVm.authVM.pages.isShowLandingPage = false;
                        appVm.authVM.pages.isShowSigninPage = false;
                        appVm.authVM.pages.isShowSignupPage = false;

                        appVm.show(); 
                    },

                    error: function(user, error) {
                        alert("Error: " + error.code + " " + error.message + "."); 
                    }
                });
            }

            if (this.pages.isShowSignupPage) {
                var user = new Parse.User();
                user.set("username", this.username);
                user.set("password", this.password);

                user.signUp(null, {
                    success: function(user) {
                        alert("Thanks for signing up!");
                        appVm.authVM.signin();
                    },

                    error: function(user, error) {
                        alert("Error: " + error.code + " " + error.message + ".");
                    }
                });
            }        
        }
    }
})