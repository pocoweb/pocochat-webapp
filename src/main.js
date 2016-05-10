import app from './components/app';

Parse.initialize("pocowebparse", "XoHirs3LE7PhOYiR");
Parse.serverURL = 'http://localhost:1337/parse';

Vue.config.debug = true;

new Vue(app);