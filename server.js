
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const sequelize = require('./config/connection'); // Adjust this path as needed
const helpers = require('./helpers/handlebars-helpers');
const routes = require('./routes');
// const { ensureAuthenticated, redirectIfAuthenticated } = require('./middleware/authmiddleware');
const PORT = process.env.PORT || 3000;
const app = express();


const hbs = exphbs.create({helpers})
const sess = {
    secret: 'yourSecretKey',
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

// Use routes defined in your routes directory
app.use(routes)

// Sync the session store at the start of the application
sequelize.sync({force:false}).then(()=>{
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
})













//n
