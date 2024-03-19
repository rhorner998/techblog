const bcrypt = require('bcryptjs');
const { User } = require('../models');

const UserController = {
    async register(req, res) {
        try {
            console.log('Attempting to register user');
            const { username, password } = req.body;
            console.log('Received registration request for username:', username);
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 12);
            // Create a new user
            const newUser = await User.create({
                username,
                password: hashedPassword,
            });
            console.log('User registration successful:', newUser);
            // Set session and redirect to dashboard
            req.session.userId = newUser.id;
            res.locals.loggedIn = true;
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).render('register', { errorMessage: "Failed to register user" });
        }
    },

    // async login(req, res) {
    //     try {
    //         console.log('Attempting to log in user');
    //         const { username, password } = req.body;
    //         console.log('Received login request for username:', username);
    //         // Find user in the database
    //         const user = await User.findOne({ where: { username } });
    //         if (user && await bcrypt.compare(password, user.password)) {
    //             console.log('User logged in successfully:', user);
    //             req.session.userId = user.id;
    //             res.locals.loggedIn = true;
    //             res.redirect('/dashboard');
    //         } else {
    //             console.log('Invalid login credentials');
    //             res.status(401).render('login', { errorMessage: "Invalid credentials" });
    //         }
    //     } catch (error) {
    //         console.error('Error logging in user:', error);
    //         res.status(500).render('login', { errorMessage: "Failed to log in" });
    //     }
    // },
    async login(req, res) {
        try {
            console.log('Attempting to log in user for testing');
            const { username } = req.body;
            console.log('Received login request for username:', username);
            
            // Find user in the database based only on username for testing
            const user = await User.findOne({ where: { username } });
    
            if (user) {
                console.log('User logged in successfully (for testing):', user);
                // Directly set the session userId without checking the password
                req.session.userId = user.id;
                res.locals.loggedIn = true;
                res.redirect('/dashboard');
            } else {
                console.log('User not found');
                res.status(401).render('login', { errorMessage: "User not found" });
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).render('login', { errorMessage: "Failed to log in" });
        }
    },    

    async logout(req, res) {
        try {
            console.log('Attempting to logout user');
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error logging out user:', err);
                    res.status(500).render('dashboard', { errorMessage: "Failed to log out" });
                } else {
                    console.log('User logged out successfully');
                    res.clearCookie('connect.sid');
                    res.redirect('/');
                }
            });
        } catch (error) {
            console.error('Error logging out user:', error);
            res.status(500).render('dashboard', { errorMessage: "Failed to log out" });
        }
    },

    async dashboard(req, res) {
        try {
            console.log('Accessing dashboard');
            const user = await User.findByPk(req.session.userId);
            console.log('User retrieved from session:', user);
            res.render('dashboard', { user });
        } catch (error) {
            console.error('Error accessing dashboard:', error);
            res.status(500).render('dashboard', { errorMessage: "Failed to access dashboard" });
        }
    }
};

module.exports = UserController;
