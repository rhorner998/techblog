const express = require('express');
const { engine } = require('express-handlebars');
const handlebarsHelpers = require('./helpers/handlebars-helpers');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection'); // Adjust this path as needed
const path = require('path');
const routes = require('./routes');
const { ensureAuthenticated, redirectIfAuthenticated } = require('./middleware/authmiddleware');

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars with custom helpers
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: handlebarsHelpers,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up express-session with connect-session-sequelize store
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    store: new SequelizeStore({
        db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production (over HTTPS)
        maxAge: 3600000, // Example: 1 hour
        sameSite: 'lax' // Adjust based on your cross-origin request needs
    }
}));

// Sync the session store at the start of the application
sequelize.sync();

console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);

// Logging session data for debugging
app.use((req, res, next) => {
    console.log('Session data:', req.session);
    next();
});

// General request logging middleware
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`${now} - ${req.method} ${req.originalUrl}`);
    next(); // Pass control to the next handler
});

// Middleware to make 'loggedIn' status available to all views
app.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.userId;
    console.log(`Request made to: ${req.method} ${req.originalUrl}`); // Log incoming request
    next();
});

// Use routes defined in your routes directory
app.use(routes);

module.exports = app;
