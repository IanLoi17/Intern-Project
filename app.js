const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const productRoute = require('./routes/product');



const MySQLStore = require('express-mysql-session');
const db = require('./config/db');


const internDatabase = require('./config/DBConnection');
internDatabase.setUpDB(false);

const authenticate = require('./config/passport');
authenticate.localStrategy(passport);


const mainRoute = require('./routes/main');
const userRoute = require('./routes/user');



const {formatDate} = require('./helpers/hbs');


const app = express();


app.engine('handlebars', exphbs({
    defaultLayout: 'main',

    helpers: {
        formatDate: formatDate
    }
}));

app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use(methodOverride('_method'));


app.use(cookieParser());

app.use(session({
    key: 'ecommerce_session',
    secret: 'tojiv',
    store: new MySQLStore({
        host: db.host,
        port: 3306,
        user: db.username,
        password: db.password,
        database: db.database,
        clearExpired: true,
        checkExpirationInterval: 900000,
        expiration: 900000,
    }),
    resave: false,
    saveUninitialized: false
}));

app.use(session({
    key: 'ecommerce_session',
    secret: 'tojiv',
    resave: false,
    saveUninitialized: false
}));


app.use(flash());
app.use(FlashMessenger.middleware);4

app.use(passport.initialize());
app.use(passport.session());



app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use(function(req, res, next) {
    next();
});


app.use('/', mainRoute);
app.use('/user', userRoute);
app.use('/', productRoute);


const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port} at: \x1b[33mhttp://localhost:${port}\x1b[0m`);
});