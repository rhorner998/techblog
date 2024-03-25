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

            req.session.save(()=>{
                req.session.userId = newUser.id;
                req.session.loggedIn = true;
                // res.status(200).json(newUser)
                res.redirect('/dashboard');                
            })
            // Set session and redirect to dashboard
            //res.redirect('/dashboard');
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).render('register', { errorMessage: "Failed to register user" });
        }
    },

    async testDbConnection(req, res) {
        try {
            console.log('Testing database connection...');
            // Attempt to fetch a single user
            const user = await User.findOne();
            if (user) {
                console.log('Database connection is good. Found a user:', user);
                res.status(200).send('Database connection is good. Found a user.');
            } else {
                console.log('Database connection is good, but no users found.');
                res.status(404).send('Database connection is good, but no users found.');
            }
        } catch (error) {
            console.error('Database connection test failed:', error);
            res.status(500).send('Failed to connect to the database.');
        }
    },

    async login(req, res) {
        try {
            console.log('Attempting to log in user for testing');
            const { username } = req.body;
            console.log('Received login request for username:', username);
            
            // Find user in the database based only on username for testing
            const user = await User.findOne({ where: { username } });
    
            if (user) {
                console.log('User logged in successfully (for testing):', user);
                req.session.save(()=>{
                    req.session.userId = user.id;
                    req.session.loggedIn = true;
                    res.status(200).json(user)
                })
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
