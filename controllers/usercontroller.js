const bcrypt = require('bcryptjs');
const { User } = require('../models');

const UserController = {
    // User registration logic
    async register(req, res) {
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await User.create({
                username,
                password: hashedPassword,
            });

            // Log the user in immediately after registration by setting the session userId
            req.session.userId = newUser.id;
            // Set loggedIn flag to true
            res.locals.loggedIn = true;
            // Redirect to the homepage
            res.redirect('/');
        } catch (error) {
            // Render the registration page with an error message
            res.status(500).render('register', { errorMessage: "Failed to register user" });
        }
    },

    // User login logic
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ where: { username } });
            if (user && await bcrypt.compare(password, user.password)) {
                req.session.userId = user.id;
                // Set loggedIn flag to true
                res.locals.loggedIn = true;
                // Redirect to the homepage or dashboard after login
                res.redirect('/dashboard');
            } else {
                // Render the login page with an error message
                res.status(401).render('login', { errorMessage: "Invalid credentials" });
            }
        } catch (error) {
            // Render the login page with an error message
            res.status(500).render('login', { errorMessage: "Failed to log in" });
        }
    },

    // User logout logic
    async logout(req, res) {
        console.log('Attempting to logout user');
        req.session.destroy((err) => {
            if (err) {
                // Render an error message or redirect with a failure message
                res.status(500).render('dashboard', { errorMessage: "Failed to log out" });
            } else {
                res.clearCookie('connect.sid'); // Assuming 'connect.sid' is the name of your session cookie
                // Redirect to the login page after logout
                res.redirect('/');
            }
        });
    },

    // Accessing the user dashboard
    async dashboard(req, res) {
        try {
            // Assuming you are storing the userId in the session upon login
            const user = await User.findByPk(req.session.userId);
            // Render the dashboard page for the user
            res.render('dashboard', { user });
        } catch (error) {
            res.status(500).render('dashboard', { errorMessage: "Failed to access dashboard" });
        }
    }
};

module.exports = UserController;
