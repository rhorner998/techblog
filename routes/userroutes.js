const router = require('express').Router();
const UserController = require('../controllers/usercontroller');
const { ensureAuthenticated, redirectIfAuthenticated } = require('../middleware/authmiddleware');

// Register route should not be accessible to authenticated users
router.post('/register', redirectIfAuthenticated, UserController.register);

// Login route should not be accessible to authenticated users
router.post('/login', redirectIfAuthenticated, UserController.login);

// Logout route should only be accessible to authenticated users
router.post('/logout', ensureAuthenticated, UserController.logout);

// Dashboard route should only be accessible to authenticated users
router.get('/dashboard', ensureAuthenticated, UserController.dashboard);

// Signup route should not be accessible to authenticated users
router.get('/signup', redirectIfAuthenticated, (req, res) => {
  res.render('signup', { layout: 'main' });
});

// Login route should not be accessible to authenticated users
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', { layout: 'main' });
});

module.exports = router;
