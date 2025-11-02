const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose'); // Assuming this is where your MongoDB connection is configured
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');
const router=express.Router();

// Use SASS middleware for styling
app.use(
    sassMiddleware({
        src: './assets/scss',    // Source directory for SCSS files
        dest: './assets/css',    // Destination directory for compiled CSS
        debug: true,             // Enable debugging
        outputStyle: 'extended', // Output style for compiled CSS
        prefix: '/css'           // URL prefix to match in views
    })
);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/css', express.static('./assets/css'));

app.use(expressLayouts);
// Extract style and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Session configuration using MongoDB store
app.use(session({
    name: 'codeial',
    secret: process.env.SESSION_SECRET, // Use an environment variable for secret
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // Session expiry time
    },
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI, // Ensure correct MongoDB URL
        autoRemove: 'disabled'
    }, function (err) {
        console.log(err || 'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
 // Apply passport middleware globally

// Use express router
// app.use('/users', require('./routes/users'));
// app.get('/', (req, res) => {
//     res.render('home', {
//         title: 'Home Page',
//         user: req.user // Assuming `user` is defined elsewhere for conditional rendering
//     });
// });


// router.use('/posts',require('./routes/posts'));
app.use('/', require('./routes'));


// Start the server
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
