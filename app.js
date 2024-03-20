const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const sequelize = require('./config/connection'); // Adjust this path as needed
const handlebarsHelpers = require('./helpers/handlebars-helpers');
const routes = require('./routes');
// const { ensureAuthenticated, redirectIfAuthenticated } = require('./middleware/authmiddleware');

const app = express();


const hbs = exphbs.create({handlebarsHelpers})
const sess = {
    secret:   'yourSecretKey',
    store: new SequelizeStore({
        db: sequelize,
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { 
       // secure: process.env.NODE_ENV === "production", // Use secure cookies in production (over HTTPS)
        maxAge: 3600000, // Example: 1 hour
        sameSite: 'lax' // Adjust based on your cross-origin request needs
    }
}

// Set up express-session with connect-session-sequelize store
app.use(session(sess));
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));



// Sync the session store at the start of the application
sequelize.sync();

// console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);

// Logging session data for debugging
// app.use((req, res, next) => {
//     console.log('Session data:', req.session);
//     next();
// });

// General request logging middleware
// app.use((req, res, next) => {
//     const now = new Date().toISOString();
//     console.log(`${now} - ${req.method} ${req.originalUrl}`);
//     next(); // Pass control to the next handler
// });

// Middleware to make 'loggedIn' status available to all views
// app.use((req, res, next) => {
//     res.locals.loggedIn = !!req.session.userId;
//     console.log(`Request made to: ${req.method} ${req.originalUrl}`); // Log incoming request
//     next();
// });

// Use routes defined in your routes directory
app.use(routes);

module.exports = app;
