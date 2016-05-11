import app from './components/app';

Parse.initialize("pocowebparse", "XoHirs3LE7PhOYiR");
Parse.serverURL = 'http://localhost:1337/parse';

Vue.config.debug = true;

var appVm = new Vue(app);

var loginVm = new Vue({
    el: '#login-page',
    data: {
      pages: {
        isShowLandingPage: true,
        isShowSigninPage: false,
        isShowSignupPage: false
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
        signin() {
            this.pages.isShowLandingPage = false;
            this.pages.isShowSigninPage = true;
            this.pages.isShowSignupPage = false;
            appVm.hide();
        },
        signup() {
            this.pages.isShowLandingPage = false;
            this.pages.isShowSigninPage = false;
            this.pages.isShowSignupPage = true;
            appVm.hide();
        },
        submit() {
            this.pages.isShowLandingPage = false;
            this.pages.isShowSigninPage = false;
            this.pages.isShowSignupPage = false;
            appVm.show();          
        }
    }
})